
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Assert the method of the last request.
   *
   * @param {String} method: The method.
   */
  NL.assertLastRequestMethod = function(method) {
    var request = this.getLastRequest();
    expect(request.method).toEqual(method);
  };


  /**
   * Assert the route of the last request.
   *
   * @param {String} route: The route.
   */
  NL.assertLastRequestRoute = function(route) {
    var request = this.getLastRequest();
    expect(URI(request.url).path()).toEqual(route);
  };


  /**
   * Assert that the last request has a GET key/value.
   *
   * @param {String} key: The key.
   * @param {String} val: The value.
   */
  NL.assertLastRequestHasGetParameter = function(key, val) {

    var request = this.getLastRequest();

    // If value passed, check for key and value.
    if (val) expect(URI(request.url).hasQuery(key, val)).toBeTruthy();

    // Otherwise, just check for the existence of the key.
    else expect(URI(request.url).hasQuery(key, true)).toBeTruthy();

  };


  /**
   * Assert that the last request has a GET key/value.
   *
   * @param {String} key: The key.
   * @param {String} val: The value.
   */
  NL.assertNotLastRequestHasGetParameter = function(key, val) {
    var request = this.getLastRequest();
    expect(URI(request.url).hasQuery(key, false)).toBeTruthy();
  };


  return NL;


})(NL || {});
