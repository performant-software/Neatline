
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Text tab controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', function(
  Text, Neatline, Backbone, Marionette, $, _) {


  Text.Router = Neatline.Editor.Router.extend({


    routes: {
      'records/add/text': 'records/add/text',
      'records/:id/text': 'records/:id/text'
    },


    /**
     * Show text tab for new record.
     */
    'records/add/text': function() {
      Neatline.execute('EDITOR:display', ['TEXT']);
      // TODO
    },


    /**
     * Show text tab for existing record.
     *
     * @param {String} id: The record id.
     */
    'records/:id/text': function(id) {
      // TODO
    }


  });


});
