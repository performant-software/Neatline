
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
      'styles':           'showStyleEditor'
    },


    /**
     * Alias components.
     */
    initialize: function() {
      this.vw = {
        editor:   Editor.         __view,
        menu:     Editor.Menu.    __view,
        records:  Editor.Records. __view,
        record:   Editor.Record.  __view,
        styles:   Editor.Styles.  __view
      };
      this.ui = {
        editor:   Editor.         __view.__ui.editor,
        menu:     Editor.Menu.    __view.$el,
        records:  Editor.Records. __view.$el,
        record:   Editor.Record.  __view.$el,
        styles:   Editor.Styles.  __view.$el
      };
    },


    before: function() {
      Neatline.vent.trigger('editor:router:before');
      this.ui.editor.empty();
    },


    /**
     * Show the list of records.
     */
    showRecordList: function() {
      Neatline.vent.trigger('editor:router:#records');
      this.vw.menu.showIn(this.ui.editor);
      this.vw.records.showIn(this.ui.editor);
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    showRecordForm: function(id) {
      id = parseInt(id, 10);
      Neatline.vent.trigger('editor:router:#records/:id', id);
      this.vw.record.showIn(this.ui.editor);
    },


    /**
     * Show add record form.
     */
    showNewRecordForm: function() {
      Neatline.vent.trigger('editor:router:#records/add');
      this.vw.record.showIn(this.ui.editor);
    },


    /**
     * Show the style editor.
     */
    showStyleEditor: function() {
      Neatline.vent.trigger('editor:router:#styles');
      this.vw.menu.showIn(this.ui.editor);
      this.vw.record.showIn(this.ui.styles);
    }


  });


}});
