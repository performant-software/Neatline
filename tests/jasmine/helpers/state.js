
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Load neatline application.
   *
   * @param {String} fixture: The application HTML fixture.
   */
  NL.loadNeatline = function(fixture) {
    if (this.server) this.server.restore();
    loadFixtures(fixture || 'SharedHtml.exhibit.html');
    loadStyleFixtures('neatline-public.css');
    this.__initNeatline();
  };


  /**
   * Load editor application.
   *
   * @param {String} fixture: The application HTML fixture.
   */
  NL.loadEditor = function(fixture) {
    if (this.server) this.server.restore();
    loadFixtures(fixture || 'SharedHtml.editor.html');
    loadStyleFixtures('neatline-editor.css');
    this.__initEditor();
  };


  /**
   * Mock the server, start Neatline.
   */
  NL.__initNeatline = function() {
    this.server = sinon.fakeServer.create();
    this.startApplication();
    this.aliasNeatline();
  };


  /**
   * Mock the server, start the editor.
   */
  NL.__initEditor = function() {
    this.server = sinon.fakeServer.create();
    this.startApplication();
    this.aliasEditor();
    this.navigate('');
  };


  /**
   * (Re)start the application.
   */
  NL.startApplication = function() {
    window.location.hash = null;
    Backbone.history.stop();
    this.stopApplication();
    Neatline.start();
  };


  /**
   * Recursively stop all modules and remove all event bindings.
   */
  NL.stopApplication = function() {

    // Stop the modules.
    _.each(Neatline.submodules, function(m) { m.stop(); });
    Neatline._initCallbacks.reset();

    // Clear the event channels.
    Neatline.commands.removeAllHandlers();
    Neatline.reqres.removeAllHandlers();
    Neatline.vent._events = {};

  };


  /**
   * Navigate to a route, forcing refresh.
   *
   * @param {String} fragment: The URL fragment.
   */
  NL.navigate = function(fragment) {
    Backbone.history.fragment = null;
    Backbone.history.navigate(fragment, true);
  };


  /**
   * Simulate a click on an element.
   *
   * @param {Object} el: The anchor element.
   */
  NL.click = function(el) {
    el.click();
    this.navigate(el.attr('href'));
  };


  /**
   * Navigate to the record list.
   *
   * @param {Object} response: The response body.
   */
  NL.showRecordList = function(response) {
    this.navigate('records');
    this.respondLast200(response);
  };


  /**
   * Navigate to the edit form for the first record.
   *
   * @param {Object} response: The response body.
   */
  NL.showRecordForm = function(response) {
    this.navigate('record/'+JSON.parse(response).id);
    this.respondLast200(response);
  };


  /**
   * Navigate to the exhibit styles form.
   *
   * @param {Object} response: The response body.
   */
  NL.showStyles = function(response) {
    this.navigate('styles');
    this.respondLast200(response);
  };


  return NL;


})(NL || {});
