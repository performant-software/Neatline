
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.WMS', function(WMS) {


  WMS.addInitializer(function() {
    WMS.__controller = new WMS.Controller();
  });


});
