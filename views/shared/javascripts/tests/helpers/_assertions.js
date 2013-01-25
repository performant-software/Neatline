
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Custom assertions.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Assert the method of the last request.
 *
 * @param {String} method: The method.
 */
_t.assertLastRequestMethod = function(method) {
  var request = _t.getLastRequest();
  expect(request.method).toEqual(method);
};


/**
 * Assert the route of the last request.
 *
 * @param {String} route: The route.
 */
_t.assertLastRequestRoute = function(route) {
  var request = _t.getLastRequest();
  expect(_.string.startsWith(request.url, route)).toBeTruthy();
};


/**
 * Assert that the last request has a GET key/value.
 *
 * @param {String} key: The key.
 * @param {String} val: The value.
 */
_t.assertLastRequestHasParameter = function(key, val) {
  var request = _t.getLastRequest();
  if (val) expect(request.url).toContain(key+'='+val);
  else expect(request.url).toContain(key);
};
