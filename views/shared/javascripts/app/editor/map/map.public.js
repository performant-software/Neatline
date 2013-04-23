
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
  Neatline.commands.setHandler(this.ID+':startEdit', startEdit);


  /**
   * End map edit when a record form is closed.
   *
   * @param {Object} model: The record model.
   */
  var endEdit = function(model) {
    Map.__view.endEdit();
  };
  Neatline.commands.setHandler(this.ID+':endEdit', endEdit);


  /**
   * Update the map edit controls.
   *
   * @param {Object} settings: The new form settings.
   */
  var updateEdit = function(settings) {
    Map.__view.updateEdit(settings);
  };
  Neatline.commands.setHandler(this.ID+':updateEdit', updateEdit);


  /**
   * Update the WKT on the geometry handler.
   *
   * @param {String} wkt: The WKT.
   */
  var updateWKT = function(wkt) {
    Map.__view.updateWKT(wkt);
  };
  Neatline.commands.setHandler(this.ID+':updateWKT', updateWKT);


  /**
   * Update edit layer model.
   *
   * @param {Object} model: The updated model.
   */
  var updateModel = function(model) {
    Map.__view.updateModel(model);
  };
  Neatline.commands.setHandler(this.ID+':updateModel', updateModel);


  /**
   * Empty the edit layer.
   */
  var clearLayer = function() {
    Map.__view.clearEditLayer();
  };
  Neatline.commands.setHandler(this.ID+':clearEditLayer', clearLayer);


  /**
   * Raise the edit layer.
   */
  var raiseLayer = function() {
    Map.__view.raiseEditLayer();
  };
  Neatline.commands.setHandler(this.ID+':raiseEditLayer', raiseLayer);
  Neatline.vent.on('MAP:ingest', raiseLayer);


}});
