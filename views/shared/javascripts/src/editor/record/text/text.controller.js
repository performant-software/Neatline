
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', {
  startWithParent: false,
  define: function(Text) {


    Text.Controller = Neatline.Shared.Controller.extend({


      slug: 'EDITOR:RECORD:TEXT',


      /**
       * Instantiate the view on the record form element.
       */
      init: function() {
        this.view = new Text.View({
          el: Neatline.request('EDITOR:RECORD:getElement')
        });
      }


    });


  }
});
