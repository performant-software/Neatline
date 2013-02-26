
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * State management helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


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

    // Restart modules.
    Neatline.Map.init();
    Neatline.Presenter.StaticBubble.init();

    // Inject fixtures, alias components.
    this.respondAll200(this.json.records.standard);
    this.aliasNeatline();

  };


  /**
   * Load editor application.
   */
  _t.loadEditor = function() {

    // Load fixtures.
    this.setFixturesPath();
    this.loadJsonFixtures();
    loadFixtures('editor-partial.html');
    loadStyleFixtures('editor.css');

    // Mock the server.
    this.server = sinon.fakeServer.create();

    // Restart modules.
    Neatline.Editor.Menu.init();
    Neatline.Editor.Search.init();
    Neatline.Editor.Record.init();
    Neatline.Editor.Records.init();
    Neatline.Editor.Styles.init();
    Neatline.Editor.init();
    Neatline.Map.init();
    Neatline.Presenter.StaticBubble.init();
    Neatline.Editor.Map.init();

    // Reset the route.
    this.restartHistory();
    this.navigate('');

    // Inject fixtures, alias components.
    this.respondAll200(this.json.records.standard);
    this.aliasNeatline();
    this.aliasEditor();

  };


  /**
   * Reset the Backbone history.
   */
  _t.restartHistory = function() {
    window.location.hash = null;
    Backbone.history.stop();
    Backbone.history.start();
  };


  /**
   * Navigate to a route, forcing refresh.
   *
   * @param {String} fragment: The URL fragment.
   */
  _t.navigate = function(fragment) {
    Backbone.history.fragment = null;
    Backbone.history.navigate(fragment, true);
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
  _t.openFirstRecordForm = function() {
    this.showRecordList(this.json.records.standard);
    var models = this.getRecordListModels();
    this.navigate('records/'+models[0].get('id'));
  };


  return _t;


})(_t || {});
