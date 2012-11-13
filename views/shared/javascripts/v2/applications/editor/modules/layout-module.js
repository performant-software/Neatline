/**
 * Layout controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Layout = (function(Backbone, Editor) {

  var Layout = {};


  /*
   * Instantiate the layout manager.
   *
   * @return void.
   */
  Layout.init = function() {
    this.view = new Editor.Views.Layout();
  };


  // Export.
  Editor.addInitializer(function() { Layout.init(); });
  return Layout;

})(Backbone, Editor);
