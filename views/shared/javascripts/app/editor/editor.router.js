
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor routes.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  Editor.Router = Backbone.Router.extend({


    routes: {
      '':                 'showRecordList',
      'records':          'showRecordList',
      'records/add':      'showNewRecordForm',
      'records/:id':      'showRecordForm',
      'tags':             'showTagList',
      'tags/add':         'showNewTagForm',
      'tags/:id':         'showTagForm'
    },


    /**
     * Show the list of records.
     */
    showRecordList: function() {
      console.log('showRecordList');
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    showRecordForm: function(id) {
      console.log('showRecordForm', id);
    },


    /**
     * Show add record form.
     */
    showNewRecordForm: function() {
      console.log('showNewRecordForm');
    },


    /**
     * Show the list of tags.
     */
    showTagList: function() {
      console.log('showTagList');
    },


    /**
     * Show edit form for individual tag.
     *
     * @param {String} id: The tag id.
     */
    showTagForm: function(id) {
      console.log('showTagForm', id);
    },


    /**
     * Show add tag form.
     */
    showNewTagForm: function() {
      console.log('showNewTagForm');
    }


  });


}});
