
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map, Editor, Backbone, Marionette, $, _) {


  Map.ID = 'EDITOR:MAP';


  /**
   * Start the map editor after Neatline.
   */
  Neatline.on('initialize:after', function() {
    Map.start();
  });


  Map.addInitializer(function() {


    Map.__collection  = Neatline.Map.__collection;
    Map.__view        = Neatline.Map.__view;


    /**
     * Start map edit when a record form is opened.
     *
     * @param {Object} model: The record model.
     */
    var startEdit = function(model) {
      Map.__view.startEdit(model);
    };
    Neatline.commands.setHandler(Map.ID+':startEdit', startEdit);


    /**
     * End map edit when a record form is closed.
     *
     * @param {Object} model: The record model.
     */
    var endEdit = function(model) {
      Map.__view.endEdit();
    };
    Neatline.commands.setHandler(Map.ID+':endEdit', endEdit);


    /**
     * Update the map edit controls.
     *
     * @param {Object} settings: The new form settings.
     */
    var updateEdit = function(settings) {
      Map.__view.updateEdit(settings);
    };
    Neatline.commands.setHandler(Map.ID+':updateEdit', updateEdit);


    /**
     * Update the WKT on the geometry handler.
     *
     * @param {String} wkt: The WKT.
     */
    var updateWKT = function(wkt) {
      Map.__view.updateWKT(wkt);
    };
    Neatline.commands.setHandler(Map.ID+':updateWKT', updateWKT);


    /**
     * Update edit layer model.
     *
     * @param {Object} model: The updated model.
     */
    var updateModel = function(model) {
      Map.__view.updateModel(model);
    };
    Neatline.commands.setHandler(Map.ID+':updateModel', updateModel);


    /**
     * Empty the edit layer.
     */
    var clearLayer = function() {
      Map.__view.clearEditLayer();
    };
    Neatline.commands.setHandler(Map.ID+':clearEditLayer', clearLayer);


  });


}});
