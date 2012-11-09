/**
 * Layout controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

NeatlineEditor.Controllers.Layout = (function(Backbone, Neatline) {

  var Layout = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate the layout manager.
   *
   * @return void.
   */
  Layout.init = function() {
    Layout.Layout = new NeatlineEditor.Views.Layout();
  };


  // Export.
  NeatlineEditor.addInitializer(function() { Layout.init(); });
  return Layout;

})(Backbone, Neatline);
