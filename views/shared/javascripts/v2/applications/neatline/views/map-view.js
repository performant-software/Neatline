/**
 * Map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Views.Map = Backbone.View.extend({

  /*
   * Start OpenLayers.
   *
   * @return void.
   */
  initialize: function() {

    // Trackers.
    this.layers = [];

    // Instantiate OpenLayers.
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

    // Set default focus.
    // TODO: Apply default exhibit focus.
    this.geolocate();

    // Set default zoom.
    // TODO: Apply default exhibit zoom.
    this.map.zoomTo(6);

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
    this.buildLayers(records);
    this.addCursorControls();
  },

  /*
   * Ingest records.
   *
   * @param {Object} records: The records collection.
   *
   * @return void.
   */
  buildLayers: function(records) {

    // Add records to map.
    records.each(_.bind(function(record) {

      // If active on the map.
      if (record.get('map_active') == 1) {

        // Build geometry and style.
        var formatter = new OpenLayers.Format.KML();
        var geometry = formatter.read(record.get('coverage'));
        var style = this.getStyleMap(record);

        // Build the layer.
        var layer = new OpenLayers.Layer.Vector(
          record.get('title'), {
            styleMap: style, displayInLayerSwitcher: false
          }
        );

        // Add to map, track.
        layer.addFeatures(geometry);
        this.map.addLayer(layer);
        this.layers.push(layer);

      }

    }, this));

  },

  /*
   * Construct style map for a record.
   *
   * @param {Object} record: The record.
   *
   * @return void.
   */
  getStyleMap: function(record) {
    return new OpenLayers.StyleMap({
      'default': new OpenLayers.Style({
        fillColor:        record.get('vector_color'),
        fillOpacity:      record.get('vector_opacity'),
        strokeColor:      record.get('stroke_color'),
        strokeOpacity:    record.get('stroke_opacity'),
        pointRadius:      record.get('point_radius'),
        externalGraphic:  record.get('point_image'),
        graphicOpacity:   record.get('graphic_opacity'),
        strokeWidth:      record.get('stroke_width')
      }),
      'select': new OpenLayers.Style({
        fillColor:        record.get('highlight_color'),
        fillOpacity:      record.get('select_opacity'),
        strokeColor:      record.get('stroke_color'),
        strokeOpacity:    record.get('stroke_opacity'),
        pointRadius:      record.get('point_radius'),
        externalGraphic:  record.get('point_image'),
        graphicOpacity:   record.get('graphic_opacity'),
        strokeWidth:      record.get('stroke_width')
      }),
      'temporary': new OpenLayers.Style({
        fillColor:        record.get('highlight_color'),
        fillOpacity:      record.get('vector_opacity'),
        strokeColor:      record.get('stroke_color'),
        strokeOpacity:    record.get('stroke_opacity'),
        pointRadius:      record.get('point_radius'),
        externalGraphic:  record.get('point_image'),
        graphicOpacity:   record.get('graphic_opacity'),
        strokeWidth:      record.get('stroke_width')
      })
    });
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
   * When a feature is selected.
   *
   * @param {Object|OpenLayers.Feature} feature: The feature.
   *
   * @return void.
   */
  onFeatureSelect: function(feature) {
    console.log('select');
  },

  /*
   * When a feature is unselected.
   *
   * @param {Object|OpenLayers.Feature} feature: The feature.
   *
   * @return void.
   */
  onFeatureUnselect: function(feature) {
    console.log('unselect');
  },

  /*
   * When a feature is highlighted.
   *
   * @param {Object|OpenLayers.Feature} feature: The feature.
   *
   * @return void.
   */
  onFeatureHighlight: function(feature) {
    console.log('highlight');
  },

  /*
   * When a feature is un-highlighted.
   *
   * @param {Object|OpenLayers.Feature} feature: The feature.
   *
   * @return void.
   */
  onFeatureUnhighlight: function(feature) {
    console.log('unhighlight');
  }

});
