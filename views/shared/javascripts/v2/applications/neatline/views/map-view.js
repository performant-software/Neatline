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

        // Build geometry.
        var formatter = new OpenLayers.Format.KML();
        var geometry = formatter.read(record.get('coverage'));

        // Build the layer.
        var layer = new OpenLayers.Layer.Vector(record.get('title'));
        layer.addFeatures(geometry);

        // Add to map, track.
        this.map.addLayer(layer);
        this.layers.push(layer);

      }

    }, this));

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
        overFeature: this.onFeatureHighlight,
        outFeature: this.onFeatureUnhighlight
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
