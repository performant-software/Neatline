
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Testing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


_t = {};


// --------------------
// Application loaders.
// --------------------

/*
 * Load neatline application.
 *
 * @return void.
 */
_t.loadNeatline = function() {

  // Restart application.
  Neatline.initCallbacks.reset();
  Neatline.start();

  // Shortcut components
  this.map = Neatline.Modules.Map.view;
  this.records = Neatline.Modules.Map.collection;

};

/*
 * Load editor application.
 *
 * @return void.
 */
_t.loadEditor = function() {

  // Load partial and JSON fixture.
  loadFixtures('editor-partial.html');
  var json = readFixtures('records.json');

  // Mock the server.
  this.server = sinon.fakeServer.create();

  // Restart application.
  Neatline.initCallbacks.reset();
  Editor.initCallbacks.reset();
  Editor.start();

  // Inject default records fixtures.
  this.respondAll200(json);

  // Views.
  this.layoutView =   Editor.Modules.Layout.view;
  this.recordsView =  Editor.Modules.Records.view;
  this.formView =     Editor.Modules.Form.view;
  this.searchView =   Editor.Modules.Search.view;
  this.mapView =      Neatline.Modules.Map.view;

  // Collections.
  this.recordsColl =  Editor.Modules.Records.collection;
  this.mapColl =      Neatline.Modules.Map.collection;

};


// --------
// Helpers.
// --------

/*
 * Get DOM collection of editor record listings.
 *
 * @return void.
 */
_t.getRecordRows = function() {
  return this.recordsView.$el.find('.record-row');
};

/*
 * Get vector layers on the map.
 *
 * @return void.
 */
_t.getVectorLayers = function() {

  // Filter for features.length > 0.
  return this.mapView.map.getLayersBy('features', {
    test: function(prop) {
      return !_.isUndefined(prop) && prop.length > 0;
    }
  });

};

/*
 * Return the most recent sinon-wrapped AJAX request.
 *
 * @return {Object} request: The sinon request.
 */
_t.getLastRequest = function() {
  return _.last(this.server.requests);
};

/*
 * Inject AJAX mock into sinon-wrapped a request.
 *
 * @param {Object} request: The sinon request.
 * @param {Object} response: The response body.
 *
 * @return void.
 */
_t.respond200 = function(request, response) {
  var contentType = { 'Content-Type':'application/json' };
  request.respond(200, contentType, response);
};

/*
 * Respond to all queued AJAX calls with a single response.
 *
 * @param {Object} response: The response body.
 *
 * @return void.
 */
_t.respondAll200 = function(response) {
  _.each(this.server.requests, _.bind(function(r) {
    this.respond200(r, response);
  }, this));
};

/*
 * Respond to the last AJAX call.
 *
 * @param {Object} response: The response body.
 *
 * @return void.
 */
_t.respondLast200 = function(response) {
  this.respond200(_.last(this.server.requests), response);
};

/*
 * Trigger a pan/zoom event on the map.
 *
 * @return void.
 */
_t.triggerMapMove = function() {
  this.mapView.map.events.triggerEvent('moveend');
};

/*
 * Simulate map move event and plug in JSON fixture.
 *
 * @param {Object} response: The response body.
 *
 * @return void.
 */
_t.refreshMap = function(response) {
  this.triggerMapMove();
  this.respondLast200(response);
};

/*
 * Simulate a click on a map feature.
 *
 * @param {Object} layer: The feature parent layer.
 * @param {Object} feature: The feature to be clicked on.
 *
 * @return void.
 */
_t.clickOnMapFeature = function(layer, feature) {

  // Mock getFeaturesFromEvent().
  layer.getFeatureFromEvent = function(evt) {
    return feature;
  };

  // Mock cursor event.
  var evt = {
    xy: new OpenLayers.Pixel(Math.random(), Math.random()),
    type: 'click'
  };

  // Trigger click.
  this.mapView.map.events.triggerEvent('click', evt);

};

/*
 * Set the map focus to a lon/lat and zoom position.
 *
 * @param {Number} lon: The longitude.
 * @param {Number} lat: The latitude.
 * @param {Number} zoom: The zoom level.
 *
 * @return void.
 */
_t.setMapCenter = function(lon, lat, zoom) {
  var lonlat = new OpenLayers.LonLat(lon, lat);
  this.mapView.map.setCenter(lonlat, zoom);
};
