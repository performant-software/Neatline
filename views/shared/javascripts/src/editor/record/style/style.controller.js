
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Style', {
  startWithParent: false,
  define: function(Style) {


    Style.Controller = Neatline.Shared.Controller.extend({


      slug: 'EDITOR:RECORD:STYLE',


      /**
       * Instantiate the view on the record form element.
       */
      init: function() {
        this.view = new Style.View({
          el: Neatline.request('EDITOR:RECORD:getElement')
        });
      }


    });


  }
});
