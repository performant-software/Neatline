
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map view. Creates and manages the core OpenLayers.Map instance.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  Map.View = Backbone.View.extend({


    options: {
      defaultZoom: 6
    },


    /**
     * Initialize the map and publish initial request for data.
     */
    initialize: function() {

      this.records = null   // The current collection of records.
      this.layers = [];     // An array of record-backed vector layers.

      this.__initOpenLayers();
      this.__initBaseLayers();
      this.__initControls();
      this.__initViewport();
      this.__initEvents();

      this.publishPosition();

    },


    /**
     * Construct the OpenLayers Map instance, set the default base layer
     * and call component start-up routines that add cursor controls, set
     * the default focus/zoom, and listen for movement events.
     */
    __initOpenLayers: function() {

      // Widgets.
      var options = {
        controls: [
          new OpenLayers.Control.PanZoomBar(),
          new OpenLayers.Control.Navigation({ documentDrag: true })
        ],
        theme: null
      };

      // Instantiate map.
      this.map = new OpenLayers.Map(this.el, options);

    },


    /**
     * Construct the base layers and set the default.
     */
    __initBaseLayers: function() {

      this.baseLayers = {};

      // Get the array of base layer instances.
      _.each(Neatline.global.base_layers, _.bind(function(json) {
        var layer = Neatline.request('map:layers:getLayer', json);
        if (_.isObject(layer)) this.baseLayers[json.id] = layer;
      }, this));

      // Add the base layers.
      this.map.addLayers(_.values(this.baseLayers));

      // Set the default layer.
      this.defaultLayer = this.baseLayers[Neatline.global.base_layer];
      this.map.setBaseLayer(this.defaultLayer);

      // Add switcher for more than 1 layer.
      if (_.values(this.baseLayers).length > 1) {
        this.map.addControl(new OpenLayers.Control.LayerSwitcher());
      }

    },


    /**
     * Construct, add, and activate hover and click controls to the map.
     * `hoverControl` handles highlighting, `clickControl` handles clicks.
     */
    __initControls: function() {

      // Build the hover control, bind callbacks.
      this.hoverControl = new OpenLayers.Control.SelectFeature(
        this.layers, {
          hover: true,
          highlightOnly: true,
          renderIntent: 'temporary',
          eventListeners: {
            featurehighlighted:   this.onFeatureHighlight,
            featureunhighlighted: this.onFeatureUnhighlight
          }
        }
      );

      // Build the click control, bind callbacks.
      this.clickControl = new OpenLayers.Control.SelectFeature(
        this.layers, {
          onSelect:   this.onFeatureSelect,
          onUnselect: this.onFeatureUnselect
        }
      );

      // Enable panning when cursor is over feature.
      this.hoverControl.handlers.feature.stopDown = false;
      this.clickControl.handlers.feature.stopDown = false;

      // Add to map, activate.
      this.map.addControls([this.hoverControl, this.clickControl]);
      this.activateControls();

    },


    /**
     * Set the starting focus and zoom.
     */
    __initViewport: function() {

      // Apply defaults if they exist.
      if (_.isString(Neatline.global.map_focus) &&
          _.isNumber(Neatline.global.map_zoom)) {
          this.setViewport(
            Neatline.global.map_focus,
            Neatline.global.map_zoom
          );
      }

      else {
        // Otherwise, geolocate.
        this.map.zoomTo(this.options.defaultZoom);
        this.geolocate();
      }

    },


    /**
     * Add a listener for the `moveend` event on the map, which is called
     * when a pan or zoom is completed. Bind to `publishPosition`, which
     * emits the current focus of the map and triggers off a data reload.
     */
    __initEvents: function() {
      this.map.events.register('moveend', this.map,
        _.bind(this.publishPosition, this)
      );
    },


    /**
     * Activate the hover and click controls.
     */
    activateControls: function() {
      this.hoverControl.activate();
      this.clickControl.activate();
    },


    /**
     * Deactivate the hover and click controls.
     */
    deactivateControls: function() {
      this.hoverControl.deactivate();
      this.clickControl.deactivate();
    },


    /**
     * Update the layer collections operated on by the hover and click
     * controls. Called after new data arrives and the layer set has been
     * rebuild by the `ingest` flow.
     */
    updateControls: function() {
      this.hoverControl.setLayer(this.layers);
      this.clickControl.setLayer(this.layers);
    },


    /**
     * Unselect all selected features.
     */
    unselectAll: function() {
      this.hoverControl.unselectAll();
      this.clickControl.unselectAll();
    },


    /**
     * Publish the current focus and zoom of the map via `map:move`.
     */
    publishPosition: function() {
      Neatline.vent.trigger('map:move', {
        extent: this.getExtentAsWKT(),
        zoom:   this.getZoom()
      });
    },


    /**
     * Focus the position and zoom to center around the passed model.
     *
     * - If the model has a non-null `map_focus` and `map_zoom`, set the
     *   viewport using these values.
     *
     * - Otherwise, automatically fit the viewport around the extent of
     *   the model's geometries, except when coverage is `POINT(0 0)`.
     *
     * @param {Object} model: The record model.
     */
    focusByModel: function(model) {

      // Get a layer for the model.
      var layer = this.getLayerByModel(model);
      if (!layer) layer = this.buildLayer(model);

      // Try to get a focus and zoom.
      var focus = model.get('map_focus');
      var zoom  = model.get('map_zoom');

      // If defined, apply.
      if (_.isString(focus) && _.isNumber(zoom)) {
        this.setViewport(focus, zoom);
      }

      // Otherwise, fit to viewport.
      else if (model.get('coverage')) {
        this.map.zoomToExtent(layer.getDataExtent());
      }

      Neatline.vent.trigger('map:focused');

    },


    /**
     * Set the focus and zoom of the map.
     *
     * @param {String} focus: Comma-delimited lat/lon.
     * @param {Number} zoom: The zoom value.
     */
    setViewport: function(focus, zoom) {
      this.map.setCenter(focus.split(','), zoom);
    },


    /**
     * Focus the map on the user's location.
     */
    geolocate: function() {

      // Construct the control.
      var geolocate = new OpenLayers.Control.Geolocate({
        bind: true, watch: false
      });

      // Focus.
      this.map.addControl(geolocate);
      geolocate.activate();

    },


    /**
     * The top-level point of entry when a new record collection arrives.
     * Updates the map layers to mirror the new records collection.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      this.records = records;

      // Remove layers.
      _.each(this.layers, _.bind(function(layer) {
        this.map.removeLayer(layer);
      }, this));

      this.layers = [];

      // Add layers.
      records.each(_.bind(function(record) {
        this.buildLayer(record);
      }, this));

      this.updateControls();

    },


    /**
     * Construct a vector layer and geometries for a model.
     *
     * @param {Object} record: The record model.
     * @return {Boolean}: True if the layer was added.
     */
    buildLayer: function(record) {

      // Build the layer.
      var layer = new OpenLayers.Layer.Vector(
        record.get('title'), {
          styleMap: this.getStyleMap(record),
          displayInLayerSwitcher: false
        }
      );

      // Build features.
      if (record.get('coverage')) {
        var formatWKT = new OpenLayers.Format.WKT();
        var features = formatWKT.read(record.get('coverage'));
        layer.addFeatures(features);
      }

      // Store model, id.
      layer.nId = record.get('id');
      layer.nModel = record;

      // Add to map, track.
      this.map.addLayer(layer);
      this.layers.push(layer);

      return layer;

    },


    /**
     * Construct a style map object for a vector. Used by `buildLayer` to
     * populate the `styleMap` attribute for a model's vector layer.
     *
     * @param {Object} record: The record.
     */
    getStyleMap: function(record) {

      // Ensure integers.
      var vectorOpacity = parseInt(record.get('vector_opacity'),  10);
      var imageOpacity  = parseInt(record.get('image_opacity'),   10);
      var selectOpacity = parseInt(record.get('select_opacity'),  10);
      var strokeOpacity = parseInt(record.get('stroke_opacity'),  10);
      var pointRadius   = parseInt(record.get('point_radius'),    10);
      var strokeWidth   = parseInt(record.get('stroke_width'),    10);

      // Decimal opacities.
      vectorOpacity /= 100;
      imageOpacity  /= 100;
      selectOpacity /= 100;
      strokeOpacity /= 100;

      return new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
          fillColor:        record.get('vector_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      vectorOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'select': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      selectOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'temporary': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      selectOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        })
      });

    },


    /**
     * Return the layer that corresponds the the passed model instance.
     *
     * @param {Object} model: The record model.
     * @return {Object}: The vector layer.
     */
    getLayerByModel: function(model) {
      var id = String(model.get('id'));
      return _.first(this.map.getLayersBy('nId', id));
    },


    /**
     * Get the current zoom level.
     *
     * @return {Number}: The zoom level.
     */
    getZoom: function(model) {
      return this.map.getZoom();
    },


    /**
     * Get the current map viewport bounds as a WKT polygon string.
     *
     * @return {String}: The WKT string.
     */
    getExtentAsWKT: function() {
      var format = new OpenLayers.Format.WKT();
      var extent = this.map.getExtent().toGeometry();
      var vector = new OpenLayers.Feature.Vector(extent);
      return format.write(vector);
    },


    /**
     * When a feature is selected, publish `map:select` with the model
     * instance that was used to construct the layer.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureSelect: function(feature) {
      Neatline.vent.trigger('map:select', feature.layer.nModel);
    },


    /**
     * When a feature is unselected, publish `map:unselect` with the model
     * instance that was used to construct the layer.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureUnselect: function(feature) {
      Neatline.vent.trigger('map:unselect', feature.layer.nModel);
    },


    /**
     * When a feature is highlighted, publish `map:highlight` with the
     * model instance that was used to construct the layer.
     *
     * @param {Object} evt: The highlight event.
     */
    onFeatureHighlight: function(evt) {
      Neatline.vent.trigger('map:highlight', evt.feature.layer.nModel);
    },


    /**
     * When a feature is un-highlighted, publish `map:unhighlight` with
     * the model instance that was used to construct the layer.
     *
     * @param {Object} evt: The unhighlight event.
     */
    onFeatureUnhighlight: function(evt) {
      Neatline.vent.trigger('map:unhighlight', evt.feature.layer.nModel);
    }


  });


});
