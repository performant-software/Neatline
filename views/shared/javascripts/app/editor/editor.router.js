
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
     * Shortcut view components.
     */
    initialize: function() {

      this.views = {
        editor:   Editor.         __view,
        menu:     Editor.Menu.    __view,
        search:   Editor.Search.  __view,
        records:  Editor.Records. __view,
        record:   Editor.Record.  __view,
        tags:     Editor.Tags.    __view,
        tag:      Editor.Tag.     __view
      };

      this.ui = {
        editor:   Editor.         __view.__ui.editor,
        menu:     Editor.Menu.    __view.$el,
        search:   Editor.Search.  __view.$el,
        records:  Editor.Records. __view.$el,
        record:   Editor.Record.  __view.$el,
        tags:     Editor.Tags.    __view.$el,
        tag:      Editor.Tag.     __view.$el
      };

    },


    /**
     * Show the list of records.
     */
    showRecordList: function() {
      this.ui.editor.html(this.ui.menu);
      this.ui.editor.append(this.ui.search);
      this.ui.editor.append(this.ui.records);
      this.views.menu.activateTab('records');
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    showRecordForm: function(id) {
      this.ui.editor.html(this.ui.record);
    },


    /**
     * Show add record form.
     */
    showNewRecordForm: function() {
      this.ui.editor.html(this.ui.record);
    },


    /**
     * Show the list of tags.
     */
    showTagList: function() {
      this.ui.editor.html(this.ui.menu);
      this.ui.editor.append(this.ui.tags);
      this.views.menu.activateTab('tags');
    },


    /**
     * Show edit form for individual tag.
     *
     * @param {String} id: The tag id.
     */
    showTagForm: function(id) {
      this.ui.editor.html(this.ui.record);
    },


    /**
     * Show add tag form.
     */
    showNewTagForm: function() {
      this.ui.editor.html(this.ui.record);
    }


  });


}});
