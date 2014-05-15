
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Map', {
  startWithParent: false,
  define: function(Map) {


    /**
     * Start the tab after the form.
     */
    Neatline.Editor.Record.on('start', function() {
      Map.start();
    });


    /**
     * Instantiate the tab view.
     */
    Map.addInitializer(function() {
      Map.__controller = new Map.Controller();
    });


  }
});
