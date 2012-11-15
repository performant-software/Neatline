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
   * Show form.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Editor.vent.on('records:openForm', function(model) {
    Map.view.edit(model);
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
