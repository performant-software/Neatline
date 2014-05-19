
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(Styles) {


  Styles.View = Neatline.Shared.View.extend({


    template:   '#exhibit-styles-template',
    className:  'form-stacked styles',
    tagName:    'form',

    events: {
      'click a[name="set-focus"]':  'onSetFocus',
      'click a[name="set-restricted-extent"]':  'onSetRestrictedExtent',
      'click a[name="set-min-zoom"]':  'onSetMinZoom',
      'click a[name="set-max-zoom"]':  'onSetMaxZoom',
      'click a[name="save"]':       'save'
    },

    ui: {
      styles:   '#styles',
      mapFocus: 'input[name="map-focus"]',
      mapZoom:  'input[name="map-zoom"]',
      minMapZoom:  'input[name="map-min-zoom"]',
      maxMapZoom:  'input[name="map-max-zoom"]',
      restrictedExtent: 'input[name="restricted-extent"]'
    },


    /**
     * Construct the exhibit model and bind to form.
     */
    init: function() {
      this.model = new Neatline.Shared.Exhibit.Model();
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

      // Clobber weird Ace warning: http://stackoverflow.com/q/28936479
      // TODO: Is this actually a problem?
      this.styles.$blockScrolling = Infinity;

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
      var minZoom = Neatline.request('MAP:getMinZoom');
      this.__ui.mapFocus.val(center.lon+','+center.lat).change();
      this.__ui.mapZoom.val(zoom + minZoom).change();
    },


    onSetMinZoom: function() {
        var zoom = Neatline.request('MAP:getZoom');
        this.__ui.minMapZoom.val(zoom).change();
    },


    onSetMaxZoom: function() {
        var zoom = Neatline.request('MAP:getZoom');
        this.__ui.maxMapZoom.val(zoom).change();
    },


    /**
     * Populate "Restricted Map Extent" with current map bounds.
     */
    onSetRestrictedExtent: function() {
      var extent  = Neatline.request('MAP:getExtent');
      this.__ui.restrictedExtent.val(extent).change();
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

      // Refresh the exhibit.
      Neatline.vent.trigger('refresh', {
        source: Styles.ID
      });

      // Flash success message.
      Neatline.execute('EDITOR:notifySuccess',
        Neatline.g.neatline.strings.exhibit.save.success
      );

    },


    /**
     * When a save fails.
     */
    onSaveError: function(model, response) {
      console.log(response);

      // Flash error message.
      Neatline.execute('EDITOR:notifyError',
        Neatline.g.neatline.strings.exhibit.save.error
      );

    }


  });


});
