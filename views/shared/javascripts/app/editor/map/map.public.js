
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
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
  Neatline.commands.setHandler('E:MAP:startEdit', startEdit);


  /**
   * End map edit when a record form is closed.
   *
   * @param {Object} model: The record model.
   */
  var endEdit = function(model) {
    Map.__view.endEdit();
  };
  Neatline.commands.setHandler('E:MAP:endEdit', endEdit);


  /**
   * Update the map edit controls.
   *
   * @param {Object} settings: The new form settings.
   */
  var updateEdit = function(settings) {
    Map.__view.updateEdit(settings);
  };
  Neatline.commands.setHandler('E:MAP:updateEdit', updateEdit);


  /**
   * Update the WKT on the geometry handler.
   *
   * @param {String} wkt: The WKT.
   */
  var updateWKT = function(wkt) {
    Map.__view.updateWKT(wkt);
  };
  Neatline.commands.setHandler('E:MAP:updateWKT', updateWKT);


  /**
   * Update edit layer model.
   *
   * @param {Object} model: The updated model.
   */
  var updateModel = function(model) {
    Map.__view.updateModel(model);
  };
  Neatline.commands.setHandler('E:MAP:updateModel', updateModel);


  /**
   * Empty the edit layer.
   */
  var clearEditLayer = function() {
    Map.__view.clearEditLayer();
  };
  Neatline.commands.setHandler('E:MAP:clearEditLayer', clearEditLayer);


  /**
   * Raise the edit layer.
   */
  var raiseEditLayer = function() {
    Map.__view.raiseEditLayer();
  };
  Neatline.commands.setHandler('E:MAP:raiseEditLayer', raiseEditLayer);
  Neatline.vent.on('MAP:ingest', raiseEditLayer);


}});
