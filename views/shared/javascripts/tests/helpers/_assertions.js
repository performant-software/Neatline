
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
_t.assertLastRequestHasGetParameter = function(key, val) {
  var request = _t.getLastRequest();
  if (val) expect(request.url).toContain(key+'='+val);
  else expect(request.url).toContain(key);
};


/**
 * Assert that the pagination is empty.
 */
_t.assertPaginationEmpty = function() {
  var pag = _t.el.records.find('.pagination');
  expect($(pag[0]).text().match(/^\s+$/)).toBeTruthy();
  expect($(pag[1]).text().match(/^\s+$/)).toBeTruthy();
};


/**
 * Assert that the pagination is not empty.
 */
_t.assertPaginationNotEmpty = function() {
  var pag = _t.el.records.find('.pagination');
  expect($(pag[0]).text().match(/^\s+$/)).not.toBeTruthy();
  expect($(pag[1]).text().match(/^\s+$/)).not.toBeTruthy();
};


/**
 * Assert that the pagination `<<` link is enabled.
 */
_t.assertPaginationPrevEnabled = function() {
  var prev = _t.el.records.find('.pagination .prev');
  expect($(prev[0]).parent('li')).not.toHaveClass('disabled');
  expect($(prev[1]).parent('li')).not.toHaveClass('disabled');
};


/**
 * Assert that the pagination `<<` link is disabled.
 */
_t.assertPaginationPrevDisabled = function() {
  var prev = _t.el.records.find('.pagination .prev');
  expect($(prev[0]).parent('li')).toHaveClass('disabled');
  expect($(prev[1]).parent('li')).toHaveClass('disabled');
};


/**
 * Assert that the pagination `>>` link is enabled.
 */
_t.assertPaginationNextEnabled = function() {
  var next = _t.el.records.find('.pagination .next');
  expect($(next[0]).parent('li')).not.toHaveClass('disabled');
  expect($(next[1]).parent('li')).not.toHaveClass('disabled');
};


/**
 * Assert that the pagination `>>` link is disabled.
 */
_t.assertPaginationNextDisabled = function() {
  var next = _t.el.records.find('.pagination .next');
  expect($(next[0]).parent('li')).toHaveClass('disabled');
  expect($(next[1]).parent('li')).toHaveClass('disabled');
};


/**
 * Assert the `href` attribute on the pagination `<<` link.
 *
 * @param {String} route: The hash.
 */
_t.assertPaginationPrevRoute = function(route) {
  var prev = _t.el.records.find('.pagination .prev');
  expect($(prev[0])).toHaveAttr('href', route);
  expect($(prev[1])).toHaveAttr('href', route);
};


/**
 * Assert the `href` attribute on the pagination `>>` link.
 *
 * @param {String} route: The hash.
 */
_t.assertPaginationNextRoute = function(route) {
  var next = _t.el.records.find('.pagination .next');
  expect($(next[0])).toHaveAttr('href', route);
  expect($(next[1])).toHaveAttr('href', route);
};
