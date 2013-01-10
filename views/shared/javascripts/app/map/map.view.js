
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
     * Initialize state variables, run the top-level start-up routine, and
     * publish initial request for data.
     */
    initialize: function() {

      // Trackers.
      this.layers = [];   // Array of all current vector layers.
      this.frozen = [];   // Array of layers that should not be updated.

      // Startup.
      this.initializeOpenLayers();
      this.publishPosition();

    },


    /**
     * Construct the OpenLayers Map instance, set the default base layer
     * and call component start-up routines that add cursor controls, set
     * the default focus/zoom, and listen for movement events.
     */
    initializeOpenLayers: function() {

      // Global attributes.
      OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

      // widgets.
      var options = {
        controls: [
          new OpenLayers.Control.MousePosition(),
          new OpenLayers.Control.PanZoomBar(),
          new OpenLayers.Control.Navigation({ documentDrag: true }),
          new OpenLayers.Control.LayerSwitcher()
        ],
        theme: null
      };

      // Instantiate map.
      this.map = new OpenLayers.Map(this.el, options);

      // Get OSM base layer.
      this.osm = new OpenLayers.Layer.OSM();
      this.map.addLayer(this.osm);
      this.map.setBaseLayer(this.osm);

      // Startup routines.
      this.addControls();
      this.setDefaultViewport();
      this.registerMapEvents();

    },


    /**
     * Construct, add, and activate hover and click controls to the map.
     * `hoverControl` handles highlighting, `clickControl` handles clicks.
     */
    addControls: function() {

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
     * Set the starting focus and zoom. If `mapFocus` is non-null on the
     * global __exhibit object, then we know that a default focus and zoom
     * has been set for the exhibit and should be manifested. If no
     * default exists, apply the default zoom and geolocate the focus.
     */
    setDefaultViewport: function() {

      // If defaults are defined.
      if (!_.isNull(__exhibit.map.focus)) {
        this.setViewport(__exhibit.map.focus, __exhibit.map.zoom);
      }

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
    registerMapEvents: function() {

      // Register for `moveend`.
      this.map.events.register('moveend', this.map,
        _.bind(this.publishPosition, this)
      );

    },


    /**
     * Publish the current focus and zoom of the map via `map:move`.
     */
    publishPosition: function() {

      // Trigger out.
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
     *   the model's geometries.
     *
     * @param {Object} model: The record model.
     */
    focusByModel: function(model) {

      // Get / build the layer for the model.
      var layer = this.getLayerByModel(model);
      if (!layer) layer = this.buildLayer(model);

      // Try to get a focus and zoom.
      var mapFocus = model.get('map_focus');

      // If defined, apply.
      if (!_.isNull(mapFocus)) {
        this.setViewport(mapFocus, model.get('map_zoom'));
      }

      else {
        // Otherwise, fit to viewport.
        this.map.zoomToExtent(layer.getDataExtent());
      }

      // Publish complete.
      Neatline.vent.trigger('map:focused');

    },


    /**
     * Set the focus and zoom of the map.
     *
     * @param {String} focus: Comma-delimited lat/lon.
     * @param {Number} zoom: The zoom value.
     */
    setViewport: function(focus, zoom) {

      // Get focus lat/lon.
      focus = focus.split(',');
      var lonlat = new OpenLayers.LonLat(focus[0], focus[1]);

      // Set center.
      this.map.setCenter(lonlat, zoom);

    },


    /**
     * Focus the map on the user's location.
     */
    geolocate: function() {

      // Construct the control.
      var geolocate = new OpenLayers.Control.Geolocate({
        bind: true, watch: false });

      // Focus.
      this.map.addControl(geolocate);
      geolocate.activate();

    },


    /**
     * The top-level point of entry when a new record collection arrives.
     * Updates the map layers to mirror the new records collection.
     *
     * - Remove all records that are not included in the `frozen` array.
     *
     * - Then walk the new collection and construct new layers for models
     *   that are not in the `frozen` array.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      var layers = [];


      // Clear layers.
      // -------------

      _.each(this.layers, _.bind(function(layer) {

        // If unfrozen, remove from map.
        if (!_.contains(this.frozen, layer.nId)) {
          this.map.removeLayer(layer);
        }

        // Else, add to new tracker.
        else layers.push(layer);

      }, this));

      this.layers = layers;


      // Add layers.
      // -----------

      records.each(_.bind(function(record) {

        // Build if not frozen.
        if (!_.contains(this.frozen, record.get('id'))) {
          this.buildLayer(record);
        }

      }, this));


      // Register layers.
      this.updateControls();

    },


    /**
     * Construct a vector layer and geometries for a model.
     *
     * @param {Object} record: The record model.
     * @return {Boolean}: True if the layer was added.
     */
    buildLayer: function(record) {

      // Build geometry and style.
      var formatWKT = new OpenLayers.Format.WKT();
      var features = formatWKT.read(record.get('coverage'));
      var style = this.getStyleMap(record);

      // Build the layer.
      var layer = new OpenLayers.Layer.Vector(
        record.get('title'), {
          styleMap: style, displayInLayerSwitcher: false
        }
      );

      // Add to map, track.
      layer.addFeatures(features);
      this.map.addLayer(layer);

      // Store model, id.
      layer.nModel = record;
      layer.nId = record.get('id');

      // Track layer.
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

      // Compute decimal opacities.
      var vectorOpacity = record.get('vector_opacity')/100;
      var imageOpacity  = record.get('image_opacity')/100;
      var selectOpacity = record.get('select_opacity')/100;
      var strokeOpacity = record.get('stroke_opacity')/100;

      return new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
          fillColor:        record.get('vector_color'),
          strokeColor:      record.get('stroke_color'),
          pointRadius:      record.get('point_radius'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      record.get('stroke_width'),
          fillOpacity:      vectorOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'select': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          pointRadius:      record.get('point_radius'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      record.get('stroke_width'),
          fillOpacity:      selectOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'temporary': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          pointRadius:      record.get('point_radius'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      record.get('stroke_width'),
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
     * @return {Object|OpenLayers.Layer.Vector} The vector layer.
     */
    getLayerByModel: function(model) {
      return _.first(this.map.getLayersBy('nId', model.get('id')));
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
      var formatWKT = new OpenLayers.Format.WKT();
      var extent = this.map.getExtent().toGeometry();
      var feature = new OpenLayers.Feature.Vector(extent);
      return formatWKT.write(feature);
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
    },


    /**
     * Add the passed record id to the `frozen` array.
     *
     * @param {Number} id: The id to freeze.
     */
    freeze: function(id) {
      this.frozen.push(id);
    },


    /**
     * Remove the passed record id to the `frozen` array.
     *
     * @param {Number} id: The id to unfreeze.
     */
    unFreeze: function(id) {
      this.frozen = _.reject(this.frozen, function(fid) {
        return fid == id;
      });
    }


  });


});
