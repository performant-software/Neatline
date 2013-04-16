
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
      this.model = new Neatline.Editor.Exhibit.Model();
      rivets.bind(this.$el, { exhibit: this.model });
    },


    /**
     * Instantiate the ACE editor on the stylesheet.
     */
    buildEditor: function() {

      // Create Ace.
      this.styles = ace.edit('styles');
      this.styles.getSession().setUseWorker(false);
      this.styles.getSession().setMode('ace/mode/css');

      // Configure Ace.
      this.styles.renderer.setShowGutter(false);
      this.styles.setHighlightActiveLine(false);
      this.styles.getSession().setTabSize(2);

      // Populate stylesheet value.
      this.setStyles(this.model.get('styles'));

      // Update model when the editor changes.
      this.styles.on('change', _.bind(function() {
        this.model.set('styles', this.getStyles());
      }, this));

    },


    /**
     * Get the current stylesheet value.
     *
     * @return {String} val: The value.
     */
    getStyles: function() {
      return this.styles.getSession().getValue();
    },


    /**
     * Get the current stylesheet value.
     *
     * @param {String} val: The value.
     */
    setStyles: function(val) {
      this.styles.getSession().setValue(val);
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
      this.model.save(null, {
        success:  _.bind(this.onSaveSuccess, this),
        error:    _.bind(this.onSaveError, this)
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {
      Neatline.vent.trigger('refresh');
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
