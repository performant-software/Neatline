
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
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
   * @param {String} type: The content type.
   * @return {Object} request: The last request.
   */
  NL.respondLast200 = function(response, type) {
    var request = this.getLastRequest();
    this.respond200(request, response, type);
    return request;
  };


  /**
   * Respond 200 to a map collection request.
   *
   * @param {Object} response: The response body.
   */
  NL.respondMap200 = function(response) {
    _.each(this.server.requests, _.bind(function(request) {

      // Check for `extent` and `zoom` params
      var route   = URI(request.url);
      var extent  = route.hasQuery('extent', true);
      var zoom    = route.hasQuery('zoom', true);

      // If both exist, inject the response.
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

      // Check for `extent` and `zoom` params
      var route   = URI(request.url);
      var limit   = route.hasQuery('limit', true);
      var start   = route.hasQuery('start', true);

      // If both exist, inject the response.
      if (limit && start) this.respond200(request, response);

    }, this));
  };


  /**
   * TODO|dev
   * Respond 200 to a item search request.
   *
   * @param {Object} response: The response body.
   */
  NL.respondItemSearch200 = function(response) {
    _.each(this.server.requests, _.bind(function(request) {

      // Check the route path.
      var path = URI(request.url).path();

      // If requesting items, inject the response.
      if (path == Neatline.g.neatline.item_search_api) {
        this.respond200(request, response);
      }

    }, this));
  };


  /**
   * Have Omeka item search results been requested?
   *
   * @return {Boolean} True if items have been requested.
   */
  NL.itemsHaveBeenRequested = function() {
    return _.any(_.pluck(NL.server.requests, 'url'), function(u) {
      return URI(u).path() == Neatline.g.neatline.item_search_api
    });
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
