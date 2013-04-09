
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map assertions.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


  /**
   * Assert that the last request was a map refresh.
   */
  _t.assertMapExtentQuery = function() {

    // Should issue GET request to records API.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Request should include map focus.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

  };


  /**
   * Assert that the vector layers were refreshed.
   */
  _t.assertMapRefreshed = function() {

    // Should query by extent.
    _t.assertMapExtentQuery();

    // Respond with updated collection.
    this.respondLast200(this.json.records.vector.changed);

    // Record2 point should be changed.
    var record2Layer = _t.getVectorLayerByTitle('title2');
    expect(record2Layer.features[0].geometry.x).toEqual(7);
    expect(record2Layer.features[0].geometry.y).toEqual(8);

    // Record3 point should be removed.
    expect(this.getVectorLayerByTitle('title3')).toBeUndefined();

  };


  /**
   * Assert the current viewport zoom and focus.
   *
   * @param {Number} lon: The focus longitude.
   * @param {Number} lat: The focus latitude.
   * @param {Number} zoom: The zoom.
   */
  _t.assertMapViewport = function(lon, lat, zoom) {
    expect(this.vw.MAP.map.getCenter().lon).toEqual(lon);
    expect(this.vw.MAP.map.getCenter().lat).toEqual(lat);
    expect(this.vw.MAP.map.getZoom()).toEqual(zoom);
  };


  /**
   * Assert the current viewport zoom and focus.
   *
   * @param {Number} lon: The focus longitude.
   * @param {Number} lat: The focus latitude.
   * @param {Number} zoom: The zoom.
   */
  _t.assertVectorLayerCount = function(count) {
    expect(this.vw.MAP.getVectorLayers().length).toEqual(count);
  };


  return _t;


})(_t || {});
