
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


/*
 * ------------------------------------------------------------------------
 * Load neatline application.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
_t.loadNeatline = function() {

  this.reset();

  // Load partials, mock server.
  loadFixtures('neatline-partial.html');
  this.loadJsonFixtures();
  this.server = sinon.fakeServer.create();

  // Load map.
  this.loadMapModule();

  // Shortcut components.
  this.mapView = Neatline.Map.view;
  this.recordsColl = Neatline.Map.collection;

};


/*
 * ------------------------------------------------------------------------
 * Load editor application.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
_t.loadEditor = function() {

  // Load partials, mock server.
  loadFixtures('editor-partial.html');
  this.loadJsonFixtures();
  this.server = sinon.fakeServer.create();

  // Restart application.
  Neatline.initCallbacks.reset();
  Neatline.start();

  // Respond to data loads.
  this.respondAll200(this.json.collections.standard);

  // Shortcut components
  this.layoutView = Neatline.Editor.Layout.view;
  this.recordsView = Neatline.Editor.Records.view;
  this.formView = Neatline.Editor.Form.view;
  this.searchView = Neatline.Editor.Search.view;
  this.mapView = Neatline.Map.view;
  this.recordsColl = Neatline.Editor.Records.collection;
  this.mapColl = Neatline.Map.collection;

};


/*
 * ------------------------------------------------------------------------
 * Strip all bindings off the application event aggregator.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
_t.reset = function() {
  Neatline.vent.unbindAll();
};


/*
 * ------------------------------------------------------------------------
 * Load the Neatline `Map` module.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
_t.loadMapModule = function() {

  // Restart module.
  Neatline.Map.stop();
  Neatline.Map.start();

  // Inject fixtures.
  this.respondAll200(this.json.collections.standard);

};


/*
 * ------------------------------------------------------------------------
 * Get DOM collection of editor record listings.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
_t.loadJsonFixtures = function() {
  this.json = {
    collections: {
      standard: readFixtures('coll.default.json'),
      changed:  readFixtures('coll.changed.json'),
      removed:  readFixtures('coll.removed.json')
    },
    records: {
      standard: readFixtures('record.default.json'),
      inactive: readFixtures('record.inactive.json')
    }
  };
};


/*
 * ------------------------------------------------------------------------
 * Get DOM collection of editor record listings.
 * ------------------------------------------------------------------------
 *
 * @return {Array}: The DOM collection of <li> elements.
 */
_t.getRecordRows = function() {
  return this.recordsView.$el.find('.record-row');
};


/*
 * ------------------------------------------------------------------------
 * Get vector layers on the map.
 * ------------------------------------------------------------------------
 *
 * @return {Array}: The layers.
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
 * ------------------------------------------------------------------------
 * Get the vector layer by record title.
 * ------------------------------------------------------------------------
 *
 * @param {String} title: The record title.
 *
 * @return {Object}: The layer.
 */
_t.getVectorLayerByTitle = function(title) {

  // Get map layers.
  var layers = this.getVectorLayers();

  // Search layers for title.
  return _.find(layers, function(layer) {
    return layer.name == title;
  });

};


/*
 * ------------------------------------------------------------------------
 * Construct a record model instance from a JSON string.
 * ------------------------------------------------------------------------
 *
 * @param {String} json: The JSON string.
 *
 * @return {Object} model: The model.
 */
_t.buildModelFromJson = function(json) {
  return new Neatline.Map.Models.Record(JSON.parse(json));
};


/*
 * ------------------------------------------------------------------------
 * Return the most recent sinon-wrapped AJAX request.
 * ------------------------------------------------------------------------
 *
 * @return {Object} request: The sinon request.
 */
_t.getLastRequest = function() {
  return _.last(this.server.requests);
};


/*
 * ------------------------------------------------------------------------
 * Inject AJAX mock into sinon-wrapped a request.
 * ------------------------------------------------------------------------
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
 * ------------------------------------------------------------------------
 e Respond to all queued AJAX calls with a single response.
 * ------------------------------------------------------------------------
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
 * ------------------------------------------------------------------------
 * Respond to the last AJAX call.
 * ------------------------------------------------------------------------
 *
 * @param {Object} response: The response body.
 *
 * @return {Object} response: The last request.
 */
_t.respondLast200 = function(response) {
  var request = _.last(this.server.requests);
  this.respond200(request, response);
  return request;
};


/*
 * ------------------------------------------------------------------------
 * Trigger a pan/zoom event on the map.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
_t.triggerMapMove = function() {
  this.mapView.map.events.triggerEvent('moveend');
};


/*
 * ------------------------------------------------------------------------
 * Simulate map move event and plug in JSON fixture.
 * ------------------------------------------------------------------------
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
 * ------------------------------------------------------------------------
 * Simulate a click on a map feature.
 * ------------------------------------------------------------------------
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
    xy: new OpenLayers.Pixel(1,2),
    type: 'click'
  };

  // Trigger click.
  this.mapView.map.events.triggerEvent('click', evt);

};


/*
 * ------------------------------------------------------------------------
 * Simulate a click out on a map feature.
 * ------------------------------------------------------------------------
 *
 * @param {Array} layers: All vector layers on the map.
 *
 * @return void.
 */
_t.clickOffMapFeature = function(layers) {

  // Mock getFeaturesFromEvent().
  _.each(layers, function(layer) {
    layer.getFeatureFromEvent = function(evt) {
      return null;
    };
  });

  // Mock cursor event.
  var evt = {
    xy: new OpenLayers.Pixel(1,2),
    type: 'click'
  };

  // Trigger click.
  this.mapView.map.events.triggerEvent('click', evt);

};


/*
 * ------------------------------------------------------------------------
 * Simulate a mouseenter on a map feature.
 * ------------------------------------------------------------------------
 *
 * @param {Object} layer: The feature parent layer.
 * @param {Object} feature: The feature to be clicked on.
 *
 * @return void.
 */
_t.hoverOnMapFeature = function(layer, feature) {

  // Mock getFeaturesFromEvent().
  layer.getFeatureFromEvent = function(evt) {
    return feature;
  };

  // Mock cursor event.
  var evt = {
    xy: new OpenLayers.Pixel(1,2),
    type: 'mousemove'
  };

  // Trigger click.
  this.mapView.map.events.triggerEvent('mousemove', evt);

};


/*
 * ------------------------------------------------------------------------
 * Simulate a mouseleave on a map feature.
 * ------------------------------------------------------------------------
 *
 * @param {Array} layers: All vector layers on the map.
 *
 * @return void.
 */
_t.unHoverOnMapFeature = function(layers) {

  // Mock getFeaturesFromEvent().
  _.each(layers, function(layer) {
    layer.getFeatureFromEvent = function(evt) {
      return null;
    };
  });

  // Mock cursor event.
  var evt = {
    xy: new OpenLayers.Pixel(1,2),
    type: 'mousemove'
  };

  // Trigger click.
  this.mapView.map.events.triggerEvent('mousemove', evt);

};


/*
 * ------------------------------------------------------------------------
 * Set the map focus to a lon/lat and zoom position.
 * ------------------------------------------------------------------------
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
