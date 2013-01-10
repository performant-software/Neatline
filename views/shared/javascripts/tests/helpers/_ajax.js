
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Ajax mocking helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Return the most recent sinon request.
 *
 * @return {Object} request: The sinon request.
 */
_t.getLastRequest = function() {
  return _.last(this.server.requests);
};


/**
 * Inject AJAX mock into a sinon request.
 *
 * @param {Object} request: The sinon request.
 * @param {Object} response: The response body.
 */
_t.respond200 = function(request, response) {
  var contentType = { 'Content-Type':'application/json' };
  request.respond(200, contentType, response);
};


/**
 * Respond 500 to a sinon request.
 *
 * @param {Object} request: The sinon request.
 */
_t.respond500 = function(request) {
  request.respond(500);
};


/**
 * Respond to all queued AJAX calls with a single response.
 *
 * @param {Object} response: The response body.
 */
_t.respondAll200 = function(response) {
  _.each(this.server.requests, _.bind(function(r) {
    this.respond200(r, response);
  }, this));
};


/**
 * Respond 200 to the last AJAX call.
 *
 * @param {Object} response: The response body.
 * @return {Object} response: The last request.
 */
_t.respondLast200 = function(response) {
  var request = this.getLastRequest();
  this.respond200(request, response);
  return request;
};


/**
 * Respond 500 to the last AJAX call.
 *
 * @return {Object} response: The last request.
 */
_t.respondLast500 = function() {
  var request = this.getLastRequest();
  this.respond500(request);
  return request;
};


/**
 * Respond 200 with the default record collection.
 */
_t.respondRecords = function() {
  this.respondLast200(this.json.records.standard);
};


/**
 * Respond 200 with the new record JSON.
 */
_t.respondNewRecord = function() {
  this.respondLast200(this.json.record.add);
};
