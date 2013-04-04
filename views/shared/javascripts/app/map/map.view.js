
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

      this.formatWKT = new OpenLayers.Format.WKT() // Read/write WKT.
      this.vectorLayers = []; // Current vector layers.

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
        var layer = Neatline.request('LAYERS:getLayer', json);
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
        this.vectorLayers, {
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
        this.vectorLayers, {
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

      // Otherwise, geolocate.
      else {
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
      this.hoverControl.setLayer(this.vectorLayers);
      this.clickControl.setLayer(this.vectorLayers);
    },


    /**
     * Unselect all selected features.
     */
    unselectAll: function() {
      this.hoverControl.unselectAll();
      this.clickControl.unselectAll();
    },


    /**
     * Publish the current focus and zoom of the map via `MAP:move`.
     */
    publishPosition: function() {
      Neatline.vent.trigger('MAP:move', {
        extent: this.getExtentAsWKT(),
        zoom:   this.getZoom()
      });
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

      // Build layers.
      this.ingestVectorLayers(records);

      // Publish collection, update controls.
      Neatline.vent.trigger('MAP:ingest', records);
      this.updateControls();

    },


    /**
     * Rebuild the vector layers to match the new collection.
     *
     * @param {Object} records: The records collection.
     */
    ingestVectorLayers: function(records) {

      // Remove layers.
      _.each(this.vectorLayers, _.bind(function(layer) {
        this.map.removeLayer(layer);
      }, this));

      this.vectorLayers = [];

      // Add layers.
      records.each(_.bind(function(record) {
        this.buildVectorLayer(record);
      }, this));

    },


    /**
     * Construct a vector layer and geometries for a model.
     *
     * @param {Object} record: The record model.
     * @return {OpenLayers.Layer.Vector}: The layer.
     */
    buildVectorLayer: function(record) {

      // Build the layer.
      var layer = new OpenLayers.Layer.Vector(record.get('title'), {
        styleMap: this.getStyleMap(record),
        displayInLayerSwitcher: false
      });

      // Add features.
      if (record.get('coverage')) {
        layer.addFeatures(this.formatWKT.read(record.get('coverage')));
      }

      // Store model, id.
      layer.nModel = record;
      layer.nId = record.id;

      // Add to map, track.
      this.map.addLayer(layer);
      this.vectorLayers.push(layer);

      return layer;

    },


    /**
     * Construct a style map object for a vector.
     *
     * @param {Object} record: The record.
     */
    getStyleMap: function(record) {

      // Ensure integers.
      var fillOpacity   = parseInt(record.get('fill_opacity'),    10);
      var selectOpacity = parseInt(record.get('select_opacity'),  10);
      var strokeOpacity = parseInt(record.get('stroke_opacity'),  10);
      var pointRadius   = parseInt(record.get('point_radius'),    10);
      var strokeWidth   = parseInt(record.get('stroke_width'),    10);

      // Decimal opacities.
      fillOpacity   /= 100;
      selectOpacity /= 100;
      strokeOpacity /= 100;

      return new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
          fillColor:        record.get('fill_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      fillOpacity,
          graphicOpacity:   fillOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'select': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      selectOpacity,
          graphicOpacity:   selectOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'temporary': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      selectOpacity,
          graphicOpacity:   selectOpacity,
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
      return _.first(this.map.getLayersBy('nId', String(model.id)));
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
      var extent = this.map.getExtent().toGeometry();
      var vector = new OpenLayers.Feature.Vector(extent);
      return this.formatWKT.write(vector);
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
      if (!layer) layer = this.buildVectorLayer(model);

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

      Neatline.vent.trigger('MAP:focused');

    },


    /**
     * When a feature is selected, publish `MAP:select` with the model
     * instance that was used to construct the layer.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureSelect: function(feature) {
      Neatline.vent.trigger('MAP:select', feature.layer.nModel);
    },


    /**
     * When a feature is unselected, publish `MAP:unselect` with the model
     * instance that was used to construct the layer.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureUnselect: function(feature) {
      Neatline.vent.trigger('MAP:unselect', feature.layer.nModel);
    },


    /**
     * When a feature is highlighted, publish `MAP:highlight` with the
     * model instance that was used to construct the layer.
     *
     * @param {Object} evt: The highlight event.
     */
    onFeatureHighlight: function(evt) {
      Neatline.vent.trigger('MAP:highlight', evt.feature.layer.nModel);
    },


    /**
     * When a feature is un-highlighted, publish `MAP:unhighlight` with
     * the model instance that was used to construct the layer.
     *
     * @param {Object} evt: The unhighlight event.
     */
    onFeatureUnhighlight: function(evt) {
      Neatline.vent.trigger('MAP:unhighlight', evt.feature.layer.nModel);
    }


  });


});
