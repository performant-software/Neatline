
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  Styles.View = Backbone.Neatline.View.extend({


    template:   '#styles-template',
    className:  'form-stacked styles',
    tagName:    'form',

    events: {
      'click a[name="set-focus"]':  'onSetFocus',
      'click a[name="save"]':       'save'
    },

    ui: {
      styles:   '#styles',
      mapFocus: 'input[name="map-focus"]',
      mapZoom:  'input[name="map-zoom"]'
    },


    /**
     * Render template.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      // Create exhibit model, bind to form.
      this.exhibit = new Neatline.Editor.Shared.Exhibit.Model();
      this.buildUi();

      // Create CodeMirror YAML editor for styles.
      this.editor = CodeMirror.fromTextArea(this.__ui.styles[0]);

    },


    /**
     * Bind the exhibit to the form.
     */
    buildUi: function() {
      rivets.bind(this.$el, { exhibit: this.exhibit });
    },


    /**
     * Populate "Default Focus" with current map center.
     */
    onSetFocus: function() {
      var center  = Neatline.request('MAP:getCenter');
      var zoom    = Neatline.request('MAP:getZoom');
      this.__ui.mapFocus.val(center.lon+','+center.lat).change();
      this.__ui.mapZoom.val(zoom).change();
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
      this.__ui.styles.change();
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
      Neatline.execute('MAP:refresh');
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.exhibit.save.success
      );
    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.exhibit.save.error
      );
    }


  });


});
