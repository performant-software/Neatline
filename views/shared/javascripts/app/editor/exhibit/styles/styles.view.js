
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


    template:   '#exhibit-styles-template',
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
     * Construct the exhibit model and bind to form.
     */
    init: function() {
      this.exhibit = new Neatline.Editor.Exhibit.Model();
      rivets.bind(this.$el, { exhibit: this.exhibit });
    },


    /**
     * Instantiate the ACE editor on the stylesheet.
     */
    buildEditor: function() {

      // Create editor.
      this.editor = ace.edit('styles');

      // Disable syntax checking, set CSS mode.
      this.editor.getSession().setUseWorker(false);
      this.editor.getSession().setMode('ace/mode/css');

      // Disable gutter and line highlighing.
      this.editor.renderer.setShowGutter(false);
      this.editor.setHighlightActiveLine(false);

      // Populate value.
      this.editor.getSession().setValue(this.exhibit.get('styles'));

      // Update model on change.
      this.editor.on('change', _.bind(function() {
        this.exhibit.set('styles', this.editor.getSession().getValue());
      }, this));

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
     * Save the settings.
     */
    save: function() {
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
