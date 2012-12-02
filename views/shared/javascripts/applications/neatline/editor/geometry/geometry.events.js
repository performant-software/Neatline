
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


  /*
   * ----------------------------------------------------------------------
   * Show form on map feature click.
   * ----------------------------------------------------------------------
   *
   * @param {Object} model: The record model.
   * @param {Boolean} focus: If true, focus the map on the edit layer.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:open', function(model, focus) {
    Geometry.view.freeze(model.get('id'));
    Geometry.view.startEdit(model, focus);
  });

  /*
   * ----------------------------------------------------------------------
   * Close form.
   * ----------------------------------------------------------------------
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:close', function(model) {
    Geometry.view.unFreeze(model.get('id'));
    Geometry.view.endEdit();
  });

  /*
   * ----------------------------------------------------------------------
   * Update map settings.
   * ----------------------------------------------------------------------
   *
   * @param {Object} settings: Settings hash.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:updateMap', function(settings) {
    Geometry.view.update(settings);
  });


}});
