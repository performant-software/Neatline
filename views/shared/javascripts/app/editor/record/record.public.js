
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the form to the editor container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Record.__view.showIn(container);
  };
  Neatline.commands.addHandler('RECORD:display', display);


  /**
   * Show form for an existing record.
   *
   * @param {Number|String} id: The record id.
   * @param {String} tab: The active tab.
   */
  var bindId = function(id, tab) {
    id = parseInt(id, 10);
    Neatline.request('RECORDS:getModel', id, function(record) {
      Record.__view.bind(record);
      Record.__view.activateTab(tab);
    });
  };
  Neatline.commands.addHandler('RECORD:bindId', bindId);


  /**
   * Show form for a new record.
   *
   * @param {String} tab: The active tab.
   */
  var bindNew = function(tab) {
    var record = new Neatline.Shared.Record.Model();
    Record.__view.bind(record);
    Record.__view.activateTab(tab);
  };
  Neatline.commands.addHandler('RECORD:bindNew', bindNew);


  /**
   * Unbind the form.
   */
  var unbind = function() {
    if (Record.__view.open) Record.__view.unbind();
  };
  Neatline.commands.addHandler('RECORD:unbind', unbind);
  Neatline.vent.on('editor:router:before', unbind);


  /**
   * Open a record edit form if one is not already open.
   *
   * @param {Object} model: The record model.
   */
  var navToForm = function(model) {
    if (!Record.__view.open) {
      Record.__router.navigate('record/'+model.get('id'), true);
    }
  };
  Neatline.commands.addHandler('RECORD:navToForm', navToForm);
  Neatline.vent.on('MAP:select', navToForm);


  /**
   * Update the route hash.
   *
   * @param {String} message: The new route.
   */
  var updateRoute = function(route) {
    Record.__router.navigate(route, { replace: true });
  };
  Neatline.commands.addHandler('RECORD:updateRoute', updateRoute);


  /**
   * Update coverage textarea.
   *
   * @param {String} coverage: The new WKT.
   */
  var setCoverage = function(coverage) {
    Record.__view.model.set('coverage', coverage);
  };
  Neatline.commands.addHandler('RECORD:setCoverage', setCoverage);


  /**
   * Return the form element.
   */
  var getElement = function() {
    return Record.__view.$el;
  };
  Neatline.reqres.addHandler('RECORD:getElement', getElement);


  /**
   * Return the form model.
   */
  var getModel = function() {
    return Record.__view.model;
  };
  Neatline.reqres.addHandler('RECORD:getModel', getModel);


});
