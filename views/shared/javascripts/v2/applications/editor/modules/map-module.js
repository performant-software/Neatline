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
    this.view.test();
  };


  // Export.
  Editor.addInitializer(function() { Map.init(); });
  return Map;

})(Backbone, Editor, Neatline);
