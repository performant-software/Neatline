
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Item', {
  startWithParent: false,
  define: function(Item) {


    Item.Controller = Neatline.Shared.Controller.extend({


      slug: 'EDITOR:RECORD:ITEM',


      /**
       * Instantiate the view on the record form element.
       */
      init: function() {
        this.view = new Item.View({
          el: Neatline.request('EDITOR:RECORD:getElement')
        });
      }


    });


  }
});
