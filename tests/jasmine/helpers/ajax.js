
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Ajax mocking helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Get the most recent request.
   *
   * @return {Object} request: The sinon request.
   */
  NL.getLastRequest = function() {
    return _.last(this.server.requests);
  };


  /**
   * Get the parameters from the most recent request.
   *
   * @return {Object} params: The parameters.
   */
  NL.getLastRequestParams = function() {
    return $.parseJSON(this.getLastRequest().requestBody);
  };


  /**
   * Inject AJAX mock into a sinon request.
   *
   * @param {Object} request: The sinon request.
   * @param {Object} response: The response body.
   * @param {String} type: The content type.
   */
  NL.respond200 = function(request, response, type) {
    request.respond(
      200, { 'Content-Type': type || 'application/json' }, response
    );
  };


  /**
   * Respond to all queued AJAX calls with a single response.
   *
   * @param {Object} response: The response body.
   */
  NL.respondAll200 = function(response) {
    _.each(this.server.requests, _.bind(function(request) {
      this.respond200(request, response);
    }, this));
  };


  /**
   * Respond 200 to the last AJAX call.
   *
   * @param {Object} response: The response body.
   * @return {Object} response: The last request.
   */
  NL.respondLast200 = function(response) {
    var request = this.getLastRequest();
    this.respond200(request, response);
    return request;
  };


  /**
   * Respond 200 to the last AJAX call with XML.
   *
   * @param {Object} response: The response body.
   * @return {Object} response: The last request.
   */
  NL.respondXmlLast200 = function(response) {
    var request = this.getLastRequest();
    this.respond200(request, response, 'text/xml');
    return request;
  };


  /**
   * Respond 200 to a map collection request.
   *
   * @param {Object} response: The response body.
   */
  NL.respondMap200 = function(response) {
    _.each(this.server.requests, _.bind(function(request) {
      var extent = _.str.include(request.url, 'extent');
      var zoom   = _.str.include(request.url, 'zoom');
      if (extent && zoom) this.respond200(request, response);
    }, this));
  };


  /**
   * Respond 200 to a record list collection request.
   *
   * @param {Object} response: The response body.
   */
  NL.respondRecordList200 = function(response) {
    _.each(this.server.requests, _.bind(function(request) {
      var offset = _.str.include(request.url, 'offset');
      var limit  = _.str.include(request.url, 'limit');
      if (offset && limit) this.respond200(request, response);
    }, this));
  };


  /**
   * Respond 500 to a sinon request.
   *
   * @param {Object} request: The sinon request.
   */
  NL.respond500 = function(request) {
    request.respond(500);
  };


  /**
   * Respond 500 to the last AJAX call.
   *
   * @return {Object} response: The last request.
   */
  NL.respondLast500 = function() {
    var request = this.getLastRequest();
    this.respond500(request);
    return request;
  };


  return NL;


})(NL || {});
