
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

  // Load partials.
  _t.setFixturesPath();
  loadFixtures('neatline-partial.html');
  loadStyleFixtures('neatline.css');
  this.loadJsonFixtures();

  // Mock server.
  this.server = sinon.fakeServer.create();

  // Load modules.
  this.loadMapModule();
  this.loadBubbleModule();

  // Shortcut components.
  _t.shortcutNeatlineComponents();

};


/**
 * Load the Neatline `Map` module.
 */
_t.loadMapModule = function() {

  // Restart module.
  Neatline.Map.stop();
  Neatline.Map.start();

  // Inject fixtures.
  this.respondAll200(this.json.collections.standard);

};


/**
 * Load the Neatline `Bubble` module.
 *
 * @return void.
 */
_t.loadBubbleModule = function() {
  Neatline.Bubble.stop();
  Neatline.Bubble.start();
};


/**
 * Load editor application.
 */
_t.loadEditor = function() {

  // Load partials.
  _t.setFixturesPath();
  loadFixtures('editor-partial.html');
  loadStyleFixtures('neatline.css');
  this.loadJsonFixtures();

  // Mock server.
  this.server = sinon.fakeServer.create();

  // Load editor.
  this.loadEditorModule();

  // Shortcut components.
  _t.shortcutNeatlineComponents();
  _t.shortcutEditorComponents();

};


/**
 * Load the `Editor` module.
 */
_t.loadEditorModule = function() {

  // Restart Neatline.
  Neatline.initCallbacks.reset();
  Neatline.start();

  // Inject fixtures.
  this.respondAll200(this.json.collections.standard);

};


/**
 * Navigate to a route.
 *
 * @param {String} frag: The URL fragment.
 */
_t.navigate = function(frag) {
  Neatline.Editor.__router.navigate(frag, { trigger: true });
};


/**
 * Simulate a click on an element.
 *
 * @param {Object} el: The anchor element.
 */
_t.click = function(el) {
  this.navigate(el.attr('href'));
};
