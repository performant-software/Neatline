
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.Router = Backbone.Router.extend({


    routes: {
      'records/add': 'records/add',
      'records/:id': 'records/:id'
    },


    before: function() {
      Neatline.vent.trigger('editor:router:before');
      Neatline.execute('editor:empty');
    },


    /**
     * Show add record form.
     */
    'records/add': function() {
      Neatline.execute('editor:record:render');
      Neatline.execute('editor:record:showNew');
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    'records/:id': function(id) {
      Neatline.execute('editor:record:render');
      Neatline.execute('editor:record:showById', parseInt(id, 10));
    }


  });


});
