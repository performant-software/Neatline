
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text) {


  Text.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:RECORD:TEXT',

    events: [{ 'EDITOR:RECORD:#text': 'activate' }],


    /**
     * Instantiate the view on the record form element.
     */
    init: function() {
      this.view = new Text.View({
        el: Neatline.request('EDITOR:RECORD:getElement')
      });
    },


    /**
     * Instantiate autocomplete and CKEditor.
     */
    activate: function() {
      this.view.buildWidgets();
    }


  });


}});
