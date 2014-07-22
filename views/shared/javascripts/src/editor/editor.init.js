
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', {
  startWithParent: false,
  define: function(Editor) {


    /**
     * Start the editor before Neatline.
     */
    Neatline.on('initialize:before', function() {
      Editor.start();
    });


    /**
     * Spin up the editor controller.
     */
    Editor.addInitializer(function() {
      Editor.__controller = new Editor.Controller();
    });


  }
});
