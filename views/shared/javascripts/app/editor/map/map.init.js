
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map) {


  /**
   * Start the map editor after Neatline.
   */
  Neatline.on('initialize:after', function() {
    Map.start();
  });


  /**
   * Start the map controller.
   */
  Map.addInitializer(function() {
    Map.__controller = new Map.Controller();
  });


}});
