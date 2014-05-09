
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', {
  startWithParent: false,
  define: function(Text) {


    /**
     * Start the tab after the form.
     */
    Neatline.Editor.Record.on('start', function() {
      Text.start();
    });


    /**
     * Instantiate the tab view.
     */
    Text.addInitializer(function() {
      Text.__controller = new Text.Controller();
    });


  }
});
