
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor) {


  /**
   * Start the editor before Neatline.
   */
  Neatline.on('initialize:before', function() {
    Editor.start();
  });


  /**
   * Start recording history once Neatline is running.
   */
  Neatline.on('initialize:after', function() {
    Backbone.history.start();
  });


  /**
   * Spin up the editor controller.
   */
  Editor.addInitializer(function() {
    Editor.__controller = new Editor.Controller();
  });


}});
