
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Assert the current viewport focus.
   *
   * @param {Number} lon: The focus longitude.
   * @param {Number} lat: The focus latitude.
   */
  NL.assertMapFocus = function(lon, lat) {
    expect(this.v.map.map.getCenter().lon).toEqual(lon);
    expect(this.v.map.map.getCenter().lat).toEqual(lat);
  };


  /**
   * Assert the current viewport zoom.
   *
   * @param {Number} zoom: The zoom.
   */
  NL.assertMapZoom = function(zoom) {
    expect(NL.getMapZoom()).toEqual(zoom);
  };


  /**
   * Assert that the last query was a map extent query.
   */
  NL.assertMapDynamicQuery = function() {

    // Should trigger GET request to /records.
    this.assertLastRequestRoute(Neatline.g.neatline.record_api);
    this.assertLastRequestMethod('GET');

    // Should filter on extent and zoom.
    this.assertLastRequestHasGetParameter('extent');
    this.assertLastRequestHasGetParameter('zoom');

  };


  /**
   * Assert that the last query was a static map query.
   */
  NL.assertMapStaticQuery = function() {

    // Should trigger GET request to /records.
    this.assertLastRequestRoute(Neatline.g.neatline.record_api);
    this.assertLastRequestMethod('GET');

    // Should _not_ filter on extent and zoom.
    this.assertNotLastRequestHasGetParameter('extent');
    this.assertNotLastRequestHasGetParameter('zoom');

  };


  /**
   * Assert the number of vector layers.
   *
   * @param {Number} count: The number.
   */
  NL.assertVectorLayerCount = function(count) {
    expect(this.v.map.getVectorLayers().length).toEqual(count);
  };


  /**
   * Assert the number of WMS layers.
   *
   * @param {Number} count: The number.
   */
  NL.assertWmsLayerCount = function(count) {
    expect(this.v.map.getWmsLayers().length).toEqual(count);
  };


  /**
   * Assert that all features on a layer have the `default` intent.
   *
   * @param {OpenLayers.Layer.Vector} layer: The layer.
   */
  NL.assertDefaultIntent = function(layer) {
    _.each(layer.features, function(feature) {
      expect(feature.renderIntent).toEqual('default');
    });
  };


  /**
   * Assert that all features on a layer have the `temporary` intent.
   *
   * @param {OpenLayers.Layer.Vector} layer: The layer.
   */
  NL.assertTemporaryIntent = function(layer) {
    _.each(layer.features, function(feature) {
      expect(feature.renderIntent).toEqual('temporary');
    });
  };


  /**
   * Assert that all features on a layer have the `select` intent.
   *
   * @param {OpenLayers.Layer.Vector} layer: The layer.
   */
  NL.assertSelectIntent = function(layer) {
    _.each(layer.features, function(feature) {
      expect(feature.renderIntent).toEqual('select');
    });
  };


  return NL;


})(NL || {});
