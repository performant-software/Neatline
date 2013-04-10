
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

    // Start the application.
    this.server = sinon.fakeServer.create();
    this.startApplication();
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

    // Start the application.
    this.server = sinon.fakeServer.create();
    this.startApplication();
    this.navigate('');

    // Respond with default records collection.
    this.respondAll200(this.json.records.standard);
    this.aliasEditor();

  };


  /**
   * (Re)start the application.
   */
  _t.startApplication = function() {

    // Reset the history.
    window.location.hash = null;
    Backbone.history.stop();

    // Start Neatline.
    this.stopApplication();
    Neatline.start();

  };


  /**
   * Recursively stop all modules.
   */
  _t.stopApplication = function() {
    _.each(Neatline.submodules, function(m) { m.stop(); });
    Neatline._initCallbacks.reset();
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
  _t.showRecordForm = function() {
    this.navigate('record/'+JSON.parse(_t.json.record.standard).id);
    _t.respondLast200(_t.json.record.standard);
  };


  /**
   * Navigate to the exhibit styles form.
   */
  _t.showStyles = function() {
    _t.navigate('styles');
    _t.respondLast200(_t.json.exhibit);
  };


  return _t;


})(_t || {});
