
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
   * Assert the number of vector layers.
   *
   * @param {Number} count: The number.
   */
  _t.assertVectorLayerCount = function(count) {
    expect(this.vw.MAP.getVectorLayers().length).toEqual(count);
  };


  /**
   * Assert the number of WMS layers.
   *
   * @param {Number} count: The number.
   */
  _t.assertWmsLayerCount = function(count) {
    expect(this.vw.MAP.getWmsLayers().length).toEqual(count);
  };


  return _t;


})(_t || {});
