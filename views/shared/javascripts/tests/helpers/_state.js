
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
  this.respondAll200(this.json.records.standard);
  _t.aliasNeatline();

};


/**
 * Load editor application.
 */
_t.loadEditor = function() {

  _t.resetHash();

  // Load fixtures, mock server.
  this.loadFixtures('editor-partial.html', 'neatline.css');
  this.server = sinon.fakeServer.create();

  // Start modules.
  Neatline.Editor.Menu.init();
  Neatline.Editor.Search.init();
  Neatline.Editor.Record.init();
  Neatline.Editor.Records.init();
  Neatline.Editor.Styles.init();
  Neatline.Editor.init();
  Neatline.Map.init();
  Neatline.Bubble.init();
  Neatline.Editor.Map.init();

  // Reset history.
  Backbone.history.stop();
  Backbone.history.start();

  // Inject fixtures, alias components.
  this.respondAll200(this.json.records.standard);
  _t.aliasNeatline();
  _t.aliasEditor();

  // Def route.
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
