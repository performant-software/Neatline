
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Style', {
  startWithParent: false,
  define: function(Style) {


    /**
     * Start the tab after the form.
     */
    Neatline.Editor.Record.on('start', function() {
      Style.start();
    });


    /**
     * Instantiate the tab view.
     */
    Style.addInitializer(function() {
      Style.__controller = new Style.Controller();
    });


  }
});
