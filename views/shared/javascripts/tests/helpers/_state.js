
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

  // Load fixtures.
  this.setFixturesPath();
  this.loadJsonFixtures();
  loadFixtures('neatline-partial.html');
  loadStyleFixtures('neatline.css');

  // Mock the server.
  this.server = sinon.fakeServer.create();

  // Public modules.
  Neatline.Map.init();
  Neatline.Presenter.StaticBubble.init();

  // Inject fixtures, alias components.
  this.respondAll200(this.json.records.standard);
  _t.aliasNeatline();

};


/**
 * Load editor application.
 */
_t.loadEditor = function() {

  _t.resetHash();

  // Load fixtures.
  this.setFixturesPath();
  this.loadJsonFixtures();
  loadFixtures('editor-partial.html');
  loadStyleFixtures('editor.css');

  // Mock the server.
  this.server = sinon.fakeServer.create();

  // Editor modules.
  Neatline.Editor.Menu.init();
  Neatline.Editor.Search.init();
  Neatline.Editor.Record.init();
  Neatline.Editor.Records.init();
  Neatline.Editor.Exhibit.init();
  Neatline.Editor.init();

  // Public modules.
  Neatline.Map.init();
  Neatline.Presenter.StaticBubble.init();

  // Map edit module.
  Neatline.Editor.Map.init();

  // Reset history.
  Backbone.history.stop();
  Backbone.history.start();

  // Inject fixtures, alias components.
  this.respondAll200(this.json.records.standard);
  _t.aliasNeatline();
  _t.aliasEditor();

  _t.navigate('');

};


/**
 * Strip the current hash route off the window href.
 */
_t.resetHash = function() {
  window.location.hash = '';
};


/**
 * Navigate to a route, forcing refresh.
 *
 * @param {String} frag: The URL fragment.
 */
_t.navigate = function(frag) {
  Neatline.Editor.__router.navigate('RESET');
  Neatline.Editor.__router.navigate(frag, { trigger: true });
};


/**
 * Simulate a click on an element.
 *
 * @param {Object} el: The anchor element.
 */
_t.click = function(el) {
  el.click();
  this.navigate(el.attr('href'));
};


/**
 * Navigate to the record list.
 *
 * @param {Object} response: The response body.
 */
_t.showRecordList = function(response) {
  this.navigate('records');
  this.respondLast200(response);
};


/**
 * Navigate to the edit form for the first record.
 */
_t.openRecordForm = function() {
  _t.showRecordList(this.json.records.standard);
  var models = this.getRecordListModels();
  this.navigate('records/'+models[0].get('id'));
};
