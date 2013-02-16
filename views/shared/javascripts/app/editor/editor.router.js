
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
      '':                                       'records',
      'records(/search)(/query=:q)(/start=:s)': 'records',
      'records/add':                            'records/add',
      'records/:id':                            'records/:id',
      'styles':                                 'styles',
      'exhibit':                                'exhibit'
    },


    /**
     * Alias components.
     */
    initialize: function() {

      this.editor = Editor.__view.__ui.editor;

      this.views = {
        menu:     Editor.Menu.    __view,
        search:   Editor.Search.  __view,
        records:  Editor.Records. __view,
        record:   Editor.Record.  __view,
        styles:   Editor.Styles.  __view,
        exhibit:  Editor.Exhibit. __view
      };

    },


    before: function() {
      Neatline.vent.trigger('editor:router:before');
      this.editor.empty();
    },


    /**
     * Show the list of records.
     */
    'records': function(query, offset) {
      if (_.isString(offset)) offset = parseInt(offset, 10);
      this.views.menu.    showIn(this.editor);
      this.views.search.  showIn(this.editor);
      this.views.records. showIn(this.editor);
      Neatline.vent.trigger('editor:router:#records', query, offset);
    },


    /**
     * Show add record form.
     */
    'records/add': function() {
      this.views.record.  showIn(this.editor);
      Neatline.vent.trigger('editor:router:#records/add');
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    'records/:id': function(id) {
      id = parseInt(id, 10);
      this.views.record.  showIn(this.editor);
      Neatline.vent.trigger('editor:router:#records/:id', id);
    },


    /*
     * Show the stylesheet editor.
     */
    'styles': function() {
      this.views.menu.showIn(this.editor);
      this.views.styles.  showIn(this.editor);
      Neatline.vent.trigger('editor:router:#styles');
    },


    /**
     * Show the exhibit defaults form.
     */
    'exhibit': function() {
      this.views.menu.    showIn(this.editor);
      this.views.exhibit. showIn(this.editor);
      Neatline.vent.trigger('editor:router:#exhibit');
    }


  });


}});
