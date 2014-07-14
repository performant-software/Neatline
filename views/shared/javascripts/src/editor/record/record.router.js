
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(Record) {


  Record.Router = Neatline.Shared.Router.extend({


    routes: {
      'edit/add':       'edit/add',
      'edit/add/:tab':  'edit/add/:tab',
      'edit/:id':       'edit/:id',
      'edit/:id/:tab':  'edit/:id/:tab'
    },


    /**
     * Show add record form.
     */
    'edit/add': function() {
      Neatline.execute('EDITOR:display', ['EDITOR:RECORD']);
      Neatline.execute('EDITOR:RECORD:bindNewRecord', 'text');
    },


    /**
     * Show add record form with specific tab.
     *
     * @param {String} tab: The active tab.
     */
    'edit/add/:tab': function(tab) {
      Neatline.execute('EDITOR:display', ['EDITOR:RECORD']);
      Neatline.execute('EDITOR:RECORD:bindNewRecord', tab);
    },


    /**
     * Show edit record form.
     *
     * @param {String} id: The record id.
     */
    'edit/:id': function(id) {
      Neatline.execute('EDITOR:display', ['EDITOR:RECORD']);
      Neatline.execute('EDITOR:RECORD:bindSavedRecord', id, 'text');
    },


    /**
     * Show edit record form with specific tab.
     *
     * @param {String} id: The record id.
     * @param {String} tab: The active tab.
     */
    'edit/:id/:tab': function(id, tab) {
      Neatline.execute('EDITOR:display', ['EDITOR:RECORD']);
      Neatline.execute('EDITOR:RECORD:bindSavedRecord', id, tab);
    }


  });


});
