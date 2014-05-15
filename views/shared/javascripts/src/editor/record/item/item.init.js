
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Item', {
  startWithParent: false,
  define: function(Item) {


    /**
     * Start the tab after the form.
     */
    Neatline.Editor.Record.on('start', function() {
      Item.start();
    });


    /**
     * Instantiate the tab view.
     */
    Item.addInitializer(function() {
      Item.__controller = new Item.Controller();
    });


  }
});
