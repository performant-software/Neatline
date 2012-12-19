
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Geometry events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Geometry', { startWithParent: false,
  define: function(Geometry, Editor, Backbone, Marionette, $, _) {


  /**
   * Graft editing functionality onto the map when a form is opened.
   *
   * @param {Object} model: The record model.
   * @param {Boolean} focus: If true, focus the map on the edit layer.
   */
  Neatline.vent.on('editor:form:open', function(model, focus) {
    Geometry.view.freeze(model.get('id'));
    Geometry.view.startEdit(model, focus);
  });


  /**
   * Strip editing functionality off the map when a form is closed.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('editor:form:close', function(model) {
    Geometry.view.unFreeze(model.get('id'));
    Geometry.view.endEdit();
  });


  /**
   * Updated editing settings when control inputs are changed on the form.
   *
   * @param {Object} settings: Settings hash.
   */
  Neatline.vent.on('editor:form:updateMap', function(settings) {
    Geometry.view.update(settings);
  });


  /**
   * When a record is deleted, purge it from the collection and map.
   *
   * @param {Object} model: The deleted record.
   */
  Neatline.vent.on('editor:form:delete', function(model) {
    Neatline.Map.collection.remove(model);
    Geometry.view.removeLayerByModel(model);
  });


}});
