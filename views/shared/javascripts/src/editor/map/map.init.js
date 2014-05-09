
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', {
  startWithParent: false,
  define: function(Map) {


    /**
     * Start the map editor after Neatline.
     */
    Neatline.Map.on('start', function() {
      Map.start();
    });


    /**
     * Start the map controller.
     */
    Map.addInitializer(function() {
      Map.__controller = new Map.Controller();
    });


  }
});
