
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
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Editor.vent.on('form:open', function(model) {
    Map.view.freeze(model.get('id'));
    Map.view.startEdit(model);
  });

  /*
   * Close form.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Editor.vent.on('form:close', function(model) {
    Map.view.endEdit(model);
    Map.view.unFreeze(model.get('id'));
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
