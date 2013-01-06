
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map, Editor, Backbone, Marionette, $, _) {


  /**
   * Start map edit when a record form is opened.
   *
   * @param {Object} model: The record model.
   */
  var startEdit = function(model) {
    Map.__view.freeze(model.get('id'));
    Map.__view.startEdit(model);
  };


  /**
   * End map edit when a record form is closed.
   *
   * @param {Object} model: The record model.
   */
  var endEdit = function(model) {
    Map.__view.unFreeze(model.get('id'));
    Map.__view.endEdit();
  };


  /**
   * Update the map edit controls.
   *
   * @param {Object} settings: The new form settings.
   */
  var update = function(settings) {
    Map.__view.update(settings);
  };


  /**
   * Updated editing settings when control inputs are changed on the form.
   *
   * @param {Object} settings: Settings hash.
   */
  // Neatline.vent.on('editor:form:updateMap', function(settings) {
  //   Map.__view.update(settings);
  // });


  /**
   * When a record is deleted, purge it from the collection and map.
   *
   * @param {Object} model: The deleted record.
   */
  // Neatline.vent.on('editor:form:delete', function(model) {
  //   Map.__collection.remove(model);
  //   Map.__view.removeLayerByModel(model);
  // });


  Neatline.vent.on('editor:record:show', startEdit);
  Neatline.vent.on('editor:record:close', endEdit);
  Neatline.vent.on('editor:record:update', update);


}});
