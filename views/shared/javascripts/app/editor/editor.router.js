
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor controller.
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

      // Show the browser menu.
      Editor.__view.editor.html(Editor.Menu.__view.$el);
      Editor.Menu.__view.activateRecords();

      // Show the search form and records list.
      Editor.__view.editor.append(Editor.Search.__view.$el);
      Editor.__view.editor.append(Editor.Records.__view.$el);

    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    showRecordForm: function(id) {
      Editor.__view.editor.html(Editor.Record.__view.$el);
    },


    /**
     * Show add record form.
     */
    showNewRecordForm: function() {
      Editor.__view.editor.html(Editor.Record.__view.$el);
    },


    /**
     * Show the list of tags.
     */
    showTagList: function() {

      // Show the browser menu.
      Editor.__view.editor.html(Editor.Menu.__view.$el);
      Editor.Menu.__view.activateTags();

      // Show the tags list.
      Editor.__view.editor.append(Editor.Tags.__view.$el);

    },


    /**
     * Show edit form for individual tag.
     *
     * @param {String} id: The tag id.
     */
    showTagForm: function(id) {
      Editor.__view.editor.html(Editor.Tag.__view.$el);
    },


    /**
     * Show add tag form.
     */
    showNewTagForm: function() {
      Editor.__view.editor.html(Editor.Tag.__view.$el);
    }


  });


}});
