
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit defaults view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  Exhibit.View = Backbone.Neatline.View.extend({


    template:   '#exhibit-template',
    className:  'form-stacked exhibit',
    tagName:    'form',

    events: {
      'click a[name="save"]': 'save'
    },

    ui: {
      styles:   '#styles'
    },


    /**
     * Render template.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      // Create exhibit model, bind to form.
      this.exhibit = new Neatline.Editor.Shared.Exhibit.Model();
      rivets.bind(this.$el, { exhibit: this.exhibit });

      // Start CodeMirror on the stylesheet.
      this.editor = CodeMirror.fromTextArea(this.$('#styles')[0]);

    },


    /**
     * Refresh the editor.
     */
    refresh: function() {
      this.editor.refresh();
    },


    /**
     * Push the stylesheet into the model.
     */
    syncStyles: function() {
      this.editor.save();
      this.__ui.styles.trigger('change');
    },


    /**
     * Save the settings.
     */
    save: function() {
      this.syncStyles();
      this.exhibit.save(null, {
        success:  _.bind(this.onSaveSuccess, this),
        error:    _.bind(this.onSaveError, this)
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {
      Neatline.execute('editor:notifySuccess',
        STRINGS.exhibit.save.success
      );
    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('editor:notifyError',
        STRINGS.exhibit.save.error
      );
    }


  });


});
