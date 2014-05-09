
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(Exhibit) {


  Exhibit.addInitializer(function() {
    Exhibit.__controller = new Exhibit.Controller();
  });


});
