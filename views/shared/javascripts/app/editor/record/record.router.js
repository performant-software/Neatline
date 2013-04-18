
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


  Record.Router = Neatline.Editor.Router.extend({


    routes: {
      'record/add':      'record/add',
      'record/add/:tab': 'record/add/:tab',
      'record/:id':      'record/:id',
      'record/:id/:tab': 'record/:id/:tab'
    },


    /**
     * Show add record form.
     */
    'record/add': function() {
      Neatline.execute('EDITOR:display', ['RECORD']);
      Neatline.execute('RECORD:bindNew', 'text');
    },


    /**
     * Show add record form with specific tab.
     *
     * @param {String} tab: The active tab.
     */
    'record/add/:tab': function(tab) {
      Neatline.execute('EDITOR:display', ['RECORD']);
      Neatline.execute('RECORD:bindNew', tab);
    },


    /**
     * Show edit record form.
     *
     * @param {String} id: The record id.
     */
    'record/:id': function(id) {
      Neatline.execute('EDITOR:display', ['RECORD']);
      Neatline.execute('RECORD:bindId', id, 'text');
    },


    /**
     * Show edit record form with specific tab.
     *
     * @param {String} id: The record id.
     * @param {String} tab: The active tab.
     */
    'record/:id/:tab': function(id, tab) {
      Neatline.execute('EDITOR:display', ['RECORD']);
      Neatline.execute('RECORD:bindId', id, tab);
    }


  });


});
