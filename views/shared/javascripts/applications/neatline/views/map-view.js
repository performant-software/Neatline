
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Views.Map = Backbone.View.extend({

  options: {
    defaultZoom: 6
  },

  /*
   * Start OpenLayers.
   *
   * @return void.
   */
  initialize: function() {
    this.layers = [];
    this.frozen = [];
    this.initializeOpenLayers();
  },

  /*
   * Construct map.
   *
   * @return void.
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
    // TODO: Manage multiple base layers.
    this.osm = new OpenLayers.Layer.OSM();
    this.map.addLayer(this.osm);
    this.map.setBaseLayer(this.osm);

    // Startup routines.
    this.addCursorControls();
    this.setDefaultViewport();
    this.registerMapEvents();

  },

  /*
   * Listen for hover and click on geometries.
   *
   * @return void.
   */
  addCursorControls: function() {

    // Build the hover control, bind callbacks.
    this.hoverControl = new OpenLayers.Control.SelectFeature(
      this.layers, {
        hover: true,
        highlightOnly: true,
        renderIntent: 'temporary',
        eventListeners: {
          featurehighlighted: this.onFeatureHighlight,
          featureunhighlighted: this.onFeatureUnhighlight
        }
      }
    );

    // Build the click control, bind callbacks.
    this.clickControl = new OpenLayers.Control.SelectFeature(
      this.layers, {
        onSelect: this.onFeatureSelect,
        onUnselect: this.onFeatureUnselect
      }
    );

    // Add to map, activate.
    this.map.addControls([this.hoverControl, this.clickControl]);
    this.hoverControl.activate();
    this.clickControl.activate();

  },

  /*
   * Set default focus and zoom.
   *
   * @return void.
   */
  setDefaultViewport: function() {

    // If defaults are defined.
    if (!_.isNull(__exhibit.mapFocus)) {
      this.setViewport(__exhibit.mapFocus, __exhibit.mapZoom);
    }

    else {
      this.map.zoomTo(this.options.defaultZoom);
      this.geolocate();
    }

  },

  /*
   * Listen for move and zoom.
   *
   * @return void.
   */
  registerMapEvents: function() {

    // Register for `moveend`.
    this.map.events.register('moveend', this.map, _.bind(function() {

      // Publish.
      Neatline.vent.trigger('map:move', {
        extent: this.getExtentAsWKT(),
        zoom: this.getZoom()
      });

    }, this));
  },

  /*
   * Focus on a record model.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  focusByModel: function(model) {

    // Try to get a map focus..
    var mapFocus = model.get('map_focus');

    // If defined, apply.
    if (!_.isNull(mapFocus)) {
      this.setViewport(mapFocus, model.get('map_zoom'));
    }

    else {
      var layer = this.getLayerByModel(model);
      this.map.zoomToExtent(layer.getDataExtent());
    }

  },

  /*
   * Set custom focus and zoom.
   *
   * @param {String} focus: Comma-delimited lat/lon.
   * @param {Number} zoom: The zoom value.
   *
   * @return void.
   */
  setViewport: function(focus, zoom) {

    // Get focus lat/lon.
    focus = focus.split(',');
    var latlon = new OpenLayers.LonLat(focus[0], focus[1]);

    // Set center.
    this.map.setCenter(latlon, zoom);

  },

  /*
   * Focus map on user's location.
   *
   * @return void.
   */
  geolocate: function() {

    // Construct the control.
    var geolocate = new OpenLayers.Control.Geolocate({
      bind: true, watch: false });

    // Focus.
    this.map.addControl(geolocate);
    geolocate.activate();

  },

  /*
   * Ingest records.
   *
   * @param {Object} records: The records collection.
   *
   * @return void.
   */
  ingest: function(records) {

    var layers = [];
    console.log(records.length);


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

      // Build if map active and unfrozen.
      if (!_.contains(this.frozen, record.get('id'))) {
          this.buildLayer(record);
      }

    }, this));

    // Update controls with new layers.
    this.hoverControl.setLayer(this.layers);
    this.clickControl.setLayer(this.layers);


  },

  /*
   * Ingest records.
   *
   * @param {Object} record: The record model.
   *
   * @return void.
   */
  buildLayer: function(record) {

    if (record.get('map_active') == 1) {

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

    }

  },

  /*
   * Construct style map for a record.
   *
   * @param {Object} record: The record.
   *
   * @return void.
   */
  getStyleMap: function(record) {

    // Compute decimal opacities.
    var fillOpacity = record.get('vector_opacity')/100;
    var graphicOpacity = record.get('graphic_opacity')/100;
    var selectOpacity = record.get('select_opacity')/100;
    var strokeOpacity = record.get('stroke_opacity')/100;

    return new OpenLayers.StyleMap({
      'default': new OpenLayers.Style({
        fillColor:        record.get('vector_color'),
        strokeColor:      record.get('stroke_color'),
        pointRadius:      record.get('point_radius'),
        externalGraphic:  record.get('point_image'),
        strokeWidth:      record.get('stroke_width'),
        fillOpacity:      fillOpacity,
        graphicOpacity:   graphicOpacity,
        strokeOpacity:    strokeOpacity
      }),
      'select': new OpenLayers.Style({
        fillColor:        record.get('select_color'),
        strokeColor:      record.get('stroke_color'),
        pointRadius:      record.get('point_radius'),
        externalGraphic:  record.get('point_image'),
        strokeWidth:      record.get('stroke_width'),
        fillOpacity:      selectOpacity,
        graphicOpacity:   graphicOpacity,
        strokeOpacity:    strokeOpacity
      }),
      'temporary': new OpenLayers.Style({
        fillColor:        record.get('select_color'),
        strokeColor:      record.get('stroke_color'),
        pointRadius:      record.get('point_radius'),
        externalGraphic:  record.get('point_image'),
        strokeWidth:      record.get('stroke_width'),
        fillOpacity:      fillOpacity,
        graphicOpacity:   graphicOpacity,
        strokeOpacity:    strokeOpacity
      })
    });
  },

  /*
   * Get the map vector layer for the passed record model.
   *
   * @param {Object} model: The record model.
   *
   * @return {Object|OpenLayers.Layer.Vector} The vector layer.
   */
  getLayerByModel: function(model) {
    return _.first(this.map.getLayersBy('nId', model.get('id')));
  },

  /*
   * Get the current zoom level.
   *
   * @return {Number}: The zoom level.
   */
  getZoom: function(model) {
    return this.map.getZoom();
  },

  /*
   * Get the current map viewport as a WKT polygon string.
   *
   * @return {String}: The WKT string.
   */
  getExtentAsWKT: function() {
    var formatWKT = new OpenLayers.Format.WKT();
    var extent = this.map.getExtent().toGeometry();
    var feature = new OpenLayers.Feature.Vector(extent);
    return formatWKT.write(feature);
  },

  /*
   * When a feature is selected.
   *
   * @param {Object|OpenLayers.Feature} feature: The feature.
   *
   * @return void.
   */
  onFeatureSelect: function(feature) {
    Neatline.vent.trigger('map:select', feature.layer.nModel);
  },

  /*
   * When a feature is unselected.
   *
   * @param {Object|OpenLayers.Feature} feature: The feature.
   *
   * @return void.
   */
  onFeatureUnselect: function(feature) {
    Neatline.vent.trigger('map:unselect', feature.layer.nModel);
  },

  /*
   * When a feature is highlighted.
   *
   * @param {Object} evt: The highlight event.
   *
   * @return void.
   */
  onFeatureHighlight: function(evt) {
    Neatline.vent.trigger('map:highlight', evt.feature.layer.nModel);
  },

  /*
   * When a feature is un-highlighted.
   *
   * @param {Object} evt: The unhighlight event.
   *
   * @return void.
   */
  onFeatureUnhighlight: function(evt) {
    Neatline.vent.trigger('map:unhighlight', evt.feature.layer.nModel);
  }

});
