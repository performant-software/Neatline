
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map public API.
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
    Map.__view.startEdit(model);
  };
  Neatline.commands.setHandler('MAPEDIT:startEdit', startEdit);


  /**
   * End map edit when a record form is closed.
   *
   * @param {Object} model: The record model.
   */
  var endEdit = function(model) {
    Map.__view.endEdit();
  };
  Neatline.commands.setHandler('MAPEDIT:endEdit', endEdit);


  /**
   * Update the map edit controls.
   *
   * @param {Object} settings: The new form settings.
   */
  var updateEdit = function(settings) {
    Map.__view.updateEdit(settings);
  };
  Neatline.commands.setHandler('MAPEDIT:updateEdit', updateEdit);


  /**
   * Update the WKT on the geometry handler.
   *
   * @param {String} wkt: The WKT.
   */
  var updateWKT = function(wkt) {
    Map.__view.updateWKT(wkt);
  };
  Neatline.commands.setHandler('MAPEDIT:updateWKT', updateWKT);


  /**
   * Update edit layer model.
   *
   * @param {Object} model: The updated model.
   */
  var updateModel = function(model) {
    Map.__view.updateModel(model);
  };
  Neatline.commands.setHandler('MAPEDIT:updateModel', updateModel);


  /**
   * Delete all features on the edit layer.
   */
  var clearLayer = function() {
    Map.__view.clearLayer();
  };
  Neatline.commands.setHandler('MAPEDIT:clearLayer', clearLayer);


  /**
   * Remove a model's layer from the map.
   *
   * @param {Object} model: The record model.
   */
  var deleteLayer = function(model) {
    Map.__collection.remove(model);
    Map.__view.removeLayerByModel(model);
  };
  Neatline.commands.setHandler('MAPEDIT:deleteLayer', deleteLayer);


}});
