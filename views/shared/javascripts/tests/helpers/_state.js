
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
  console.log('loadEditor start');

  // Load fixtures, mock server.
  this.loadFixtures('editor-partial.html', 'neatline.css');
  this.server = sinon.fakeServer.create();
  console.log('s1');

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
  console.log('s2');

  // Def route.
  _t.navigate('');
  console.log('s3');

  // Inject fixtures, alias components.
  this.respondAll200(this.json.collections.standard);
  _t.aliasNeatline();
  _t.aliasEditor();

  console.log('loadEditor end');
};


/**
 * Navigate to the edit form for the first record.
 */
_t.openRecordForm = function() {
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
