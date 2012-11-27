
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Map editing module.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Map = (function(Backbone, Editor, Neatline) {

  var Map = {};


  /*
   * Get the exhibit map view.
   *
   * @return void.
   */
  Map.init = function() {
    this.view = Neatline.Modules.Map.view;
  };


  // -------
  // Events.
  // -------

  /*
   * Show form on map feature click.
   *
   * @param {Number} model: The record id.
   *
   * @return void.
   */
  Editor.vent.on('form:open', function(id) {

    // Freeze the id.
    Map.view.freeze(id);

    // Get model, focus and start edit.
    Neatline.Modules.Map.collection.getModel(id, function(model) {
      Map.view.focusByModel(model);
      Map.view.startEdit(model);
    });

  });

  /*
   * Close form.
   *
   * @param {Number} model: The record id.
   *
   * @return void.
   */
  Editor.vent.on('form:close', function(id) {
    Map.view.unFreeze(id);
    Map.view.endEdit();
  });

  /*
   * Update map settings.
   *
   * @param {Object} settings: Settings hash.
   *
   * @return void.
   */
  Editor.vent.on('form:updateMap', function(settings) {
    Map.view.update(settings);
  });


  // Export.
  Editor.addInitializer(function() { Map.init(); });
  return Map;

})(Backbone, Editor, Neatline);
