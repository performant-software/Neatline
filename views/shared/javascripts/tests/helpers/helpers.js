
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Testing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


_t = (function() {
  var _t = {views:{}, collections:{}};

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * State management helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Load neatline application.
 */
_t.loadNeatline = function() {

  // Load fixtures, mock server.
  this.loadFixtures('neatline-partial.html', 'neatline.css');
  this.server = sinon.fakeServer.create();

  // Start modules.
  Neatline.Map.init();
  Neatline.Bubble.init();

  // Inject fixtures, alias components.
  this.respondAll200(this.json.collections.standard);
  _t.aliasNeatline();

};


/**
 * Load editor application.
 */
_t.loadEditor = function() {

  // Load fixtures, mock server.
  this.loadFixtures('editor-partial.html', 'neatline.css');
  this.server = sinon.fakeServer.create();

  // Start modules.
  Neatline.Editor.Menu.init();
  Neatline.Editor.Record.init();
  Neatline.Editor.Records.init();
  Neatline.Editor.Search.init();
  Neatline.Editor.Tag.init();
  Neatline.Editor.Tags.init();
  Neatline.Editor.init();
  Neatline.Map.init();
  Neatline.Bubble.init();
  Neatline.Editor.Map.init();

  // Def route.
  _t.navigate('');

  // Inject fixtures, alias components.
  this.respondAll200(this.json.collections.standard);
  _t.aliasNeatline();
  _t.aliasEditor();

};


/**
 * Navigate to the edit form for the first record.
 */
_t.openFirstRecordForm = function() {
  var models = this.getRecordModels();
  this.navigate('records/'+models[0].get('id'));
};


/**
 * Navigate to a route.
 *
 * @param {String} frag: The URL fragment.
 */
_t.navigate = function(frag) {
  Backbone.history.loadUrl(frag);
};


/**
 * Simulate a click on an element.
 *
 * @param {Object} el: The anchor element.
 */
_t.click = function(el) {
  this.navigate(el.attr('href'));
};


/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Fixture loading helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Read HTML fixtures.
 *
 * @param {String} html: The name of the HTML fixture.
 * @param {String} css: The name of the css fixture.
 */
_t.loadFixtures = function(html, css) {
  this.setFixturesPath();
  this.loadJsonFixtures();
  loadFixtures(html);
  loadStyleFixtures(css);
};


/**
 * Set the fixtures path.
 */
_t.setFixturesPath = function() {
  jasmine.getFixtures().fixturesPath = 'fixtures';
  jasmine.getStyleFixtures().fixturesPath = 'payloads/css';
};


/**
 * Read JSON fixtures.
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


/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Component aliasing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Shortcut public-facing exhibit components.
 */
_t.aliasNeatline = function() {

  this.vw = {
    map:    Neatline.Map.     __view,
    bubble: Neatline.Bubble.  __view
  };

  this.el = {
    map:    Neatline.Map.     __view.$el,
    bubble: Neatline.Bubble.  __view.$el
  };

};


/**
 * Shortcut editor components.
 */
_t.aliasEditor = function() {

  this.vw = {
    map:      Neatline.Map.             __view,
    bubble:   Neatline.Map.             __view,
    editor:   Neatline.Editor.          __view,
    menu:     Neatline.Editor.Menu.     __view,
    records:  Neatline.Editor.Records.  __view,
    record:   Neatline.Editor.Record.   __view,
    tags:     Neatline.Editor.Tags.     __view,
    tag:      Neatline.Editor.Tag.      __view,
    search:   Neatline.Editor.Search.   __view
  };

  this.el = {
    map:      Neatline.Map.             __view.$el,
    bubble:   Neatline.Map.             __view.$el,
    editor:   Neatline.Editor.          __view.__ui.editor,
    menu:     Neatline.Editor.Menu.     __view.$el,
    records:  Neatline.Editor.Records.  __view.$el,
    record:   Neatline.Editor.Record.   __view.$el,
    tags:     Neatline.Editor.Tags.     __view.$el,
    tag:      Neatline.Editor.Tag.      __view.$el,
    search:   Neatline.Editor.Search.   __view.$el
  };

};


/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Data access helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Get DOM collection of editor record listings.
 *
 * @return {Array}: The DOM collection of <li> elements.
 */
_t.getRecordRows = function() {
  return this.el.records.find('.record');
};


/**
 * Get the array of models from the record list collection.
 *
 * @return {Array}: The models.
 */
_t.getRecordModels = function() {
  return Neatline.Editor.Records.__collection.models;
};


/**
 * Get vector layers on the map.
 *
 * @return {Array}: The layers.
 */
_t.getVectorLayers = function() {

  // Filter for features.length > 0.
  return this.vw.map.map.getLayersBy('features', {
    test: function(prop) {
      return !_.isUndefined(prop) && prop.length > 0;
    }
  });

};


/**
 * Get the vector layer by record title.
 *
 * @param {String} title: The record title.
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


/**
 * Construct a record model instance from a JSON string.
 *
 * @param {String} json: The JSON string.
 * @return {Object} model: The model.
 */
_t.buildModelFromJson = function(json) {
  return new Neatline.Record.Model(JSON.parse(json));
};


/**
 * Get DOM selections for the elements on the record form.
 *
 * @return {Object}: A hash of elements.
 */
_t.getRecordFormElements = function(json) {
  return {
    lead:           _t.el.record.find('p.lead'),
    title:          _t.el.record.find('textarea[name="title"]'),
    body:           _t.el.record.find('textarea[name="body"]'),
    coverage:       _t.el.record.find('textarea[name="coverage"]'),
    vectorColor:    _t.el.record.find('input[name="vector-color"]'),
    strokeColor:    _t.el.record.find('input[name="stroke-color"]'),
    selectColor:    _t.el.record.find('input[name="select-color"]'),
    vectorOpacity:  _t.el.record.find('input[name="vector-opacity"]'),
    selectOpacity:  _t.el.record.find('input[name="select-opacity"]'),
    strokeOpacity:  _t.el.record.find('input[name="stroke-opacity"]'),
    imageOpacity:   _t.el.record.find('input[name="image-opacity"]'),
    strokeWidth:    _t.el.record.find('input[name="stroke-width"]'),
    pointRadius:    _t.el.record.find('input[name="point-radius"]'),
    minZoom:        _t.el.record.find('input[name="min-zoom"]'),
    maxZoom:        _t.el.record.find('input[name="max-zoom"]'),
    pointImage:     _t.el.record.find('input[name="point-image"]'),
    mapFocus:       _t.el.record.find('input[name="map-focus"]'),
    mapZoom:        _t.el.record.find('input[name="map-zoom"]')
  };
};


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


/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Trigger a pan/zoom event on the map.
 */
_t.triggerMapMove = function() {
  this.vw.map.map.events.triggerEvent('moveend');
};


/**
 * Trigger a mouseout event on the map.
 */
_t.triggerMapMouseout = function() {
  this.vw.map.map.events.triggerEvent('mouseout');
};


/**
 * Simulate map move event and plug in JSON fixture.
 *
 * @param {Object} response: The response body.
 */
_t.refreshMap = function(response) {
  this.triggerMapMove();
  this.respondLast200(response);
};


/**
 * Simulate a click on a map feature.
 *
 * @param {Object} layer: The feature parent layer.
 * @param {Object} feature: The feature to be clicked on.
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
  this.vw.map.map.events.triggerEvent('click', evt);

};


/**
 * Simulate a click out on a map feature.
 *
 * @param {Array} layers: All vector layers on the map.
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
  this.vw.map.map.events.triggerEvent('click', evt);

};


/**
 * Simulate a mouseenter on a map feature.
 *
 * @param {Object} layer: The feature parent layer.
 * @param {Object} feature: The feature to be clicked on.
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
  this.vw.map.map.events.triggerEvent('mousemove', evt);

};


/**
 * Simulate a mouseleave on a map feature.
 *
 * @param {Array} layers: All vector layers on the map.
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
  this.vw.map.map.events.triggerEvent('mousemove', evt);

};


/**
 * Set the map focus to a lon/lat and zoom position.
 *
 * @param {Number} lon: The longitude.
 * @param {Number} lat: The latitude.
 * @param {Number} zoom: The zoom level.
 */
_t.setMapCenter = function(lon, lat, zoom) {
  var lonlat = new OpenLayers.LonLat(lon, lat);
  this.vw.map.map.setCenter(lonlat, zoom);
};

  return _t;
})();