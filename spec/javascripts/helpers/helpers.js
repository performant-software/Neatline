
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

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

  // Shortcut editor components
  this.layout = Editor.Modules.Layout.view;
  this.records = Editor.Modules.Records.view;
  this.form = Editor.Modules.Form.view;
  this.search = Editor.Modules.Search.view;

  // Shortcut application components
  this.map = Neatline.Modules.Map.view;

};


// --------
// Helpers.
// --------

/*
 * Get vector layers on the map.
 *
 * @return void.
 */
_t.getVectorLayers = function() {

  // Filter for features.length > 0.
  return this.map.map.getLayersBy('features', {
    test: function(prop) {
      return !_.isUndefined(prop) && prop.length > 0;
    }
  });

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
