
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
      'records/add':  'records/add',
      'records/:id':  'records/:id',
      'styles':       'styles'
    },


    before: function() {
      Neatline.vent.trigger('editor:router:before');
      Editor.__view.__ui.editor.empty();
    },


    /**
     * Show add record form.
     */
    'records/add': function() {
      Neatline.execute('editor:record:show');
      Neatline.execute('editor:record:showNew');
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    'records/:id': function(id) {
      Neatline.execute('editor:record:show');
      Neatline.execute('editor:record:showById', parseInt(id, 10));
    },


    /**
     * Show the exhibit defaults form.
     */
    'styles': function() {
      Neatline.execute('editor:menu:show');
      Neatline.execute('editor:styles:show');
      Neatline.execute('editor:menu:update', 'styles');
    }


  });


}});
