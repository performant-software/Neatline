
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
     * Alias components.
     */
    initialize: function() {

      this.collections = {
        records:  Editor.Records. __collection
      };

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


    before: function() {
      this.ui.editor.empty();
    },


    /**
     * Show the list of records.
     */
    showRecordList: function() {

      // Activate "Records" tab.
      Neatline.execute('editor:menu:activateTab', 'records');

      // Show views.
      this.views.menu.showIn(this.ui.editor);
      this.views.search.showIn(this.ui.editor);
      this.views.records.showIn(this.ui.editor);

    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    showRecordForm: function(id) {

      // Get a model for the requested record.
      this.collections.records.getOrFetch(id, _.bind(function(model) {

        // Publish the model, focus the map, inject view.
        Neatline.vent.trigger('editor:router:showRecord', model);
        this.views.record.showIn(this.ui.editor);

      }, this));

    },


    /**
     * Show add record form.
     */
    showNewRecordForm: function() {
      this.views.record.showIn(this.ui.editor);
    },


    /**
     * Show the list of tags.
     */
    showTagList: function() {

      // Activate "Tags" tab.
      Neatline.execute('editor:menu:activateTab', 'tags');

      // Show views.
      this.views.menu.showIn(this.ui.editor);
      this.views.tags.showIn(this.ui.editor);

    },


    /**
     * Show edit form for individual tag.
     *
     * @param {String} id: The tag id.
     */
    showTagForm: function(id) {
      this.views.tag.showIn(this.ui.editor);
    },


    /**
     * Show add tag form.
     */
    showNewTagForm: function() {
      this.views.tag.showIn(this.ui.editor);
    }


  });


}});
