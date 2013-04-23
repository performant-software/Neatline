
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Map', { startWithParent: false,
  define: function(Map, Neatline, Backbone, Marionette, $, _) {


  this.View = Backbone.Neatline.View.extend({


    events: {
      'shown ul.nav a':         'onTabChange',
      'change div.map input':   'onControlChange',
      'keyup div.map input':    'onControlChange',
      'click a[name="parse"]':  'onParseClick',
      'click a[name="clear"]':  'onClearClick'
    },

    selectors: {
      mode:       'input[name="mode"]',
      modify:     'input[name="modify"]'
    },

    ui: {
      pan:      'input[value="pan"]',
      sides:    'input[name="sides"]',
      snap:     'input[name="snap"]',
      irreg:    'input[name="irreg"]',
      svg:      'textarea[name="svg"]',
      density:  'input[name="density"]',
      modal:    '#svg-modal'
    },


    /**
     * Initialize state.
     */
    init: function() {
      this.tab = null;  // The hash of the active tab.
    },


    /**
     * Cache the current tab, (de)activate the presenter.
     *
     * @param {Object} event: The `shown` event.
     */
    onTabChange: function(event) {
      this.tab = event.target.hash;
      this.setPresenterStatus();
      this.resetEditMode();
    },


    /**
     * Publish the current edit control configuration.
     */
    onControlChange: function() {
      Neatline.execute('EDITOR:MAP:updateEdit', {
        mode: this.getEditMode(),
        poly: this.getPolyOptions()
      });
    },


    /**
     * Convert new SVG to WKT and update the map handler.
     */
    onParseClick: function() {

      var val = this.__ui.svg.val();

      try {

        // Set density.
        SVGtoWKT.DENSITY = parseFloat(
          this.__ui.density.val()
        );

        // Covnert SVG, update handler.
        var wkt = SVGtoWKT.convert(val);
        Neatline.execute('EDITOR:MAP:updateWKT', wkt);

        // Flash success.
        Neatline.execute('EDITOR:notifySuccess',
          STRINGS.svg.parse.success
        );

        // Close the modal.
        this.__ui.modal.modal('hide');

      } catch (e) {
        Neatline.execute('EDITOR:notifyError',
          STRINGS.svg.parse.error
        );
      }

    },


    /**
     * Clear all features on the edit layer.
     */
    onClearClick: function() {
      Neatline.execute('EDITOR:MAP:clearEditLayer');
    },


    /**
     * Deactivate the presenter when "Map" is active.
     */
    setPresenterStatus: function() {
      Neatline.vent.trigger(this.mapTabActive() ?
        'PRESENTER:deactivate' :
        'PRESENTER:activate'
      );
    },


    /**
     * Is the "Map" tab activated?
     *
     * @return {Boolean}: True if "Map" is active.
     */
    mapTabActive: function() {
      return this.tab == '#record-map';
    },


    /**
     * Reset the map edit mode to "Navigate".
     */
    resetEditMode: function() {
      this.__ui.pan[0].checked = true;
      this.__ui.pan.trigger('change');
    },


    /**
     * Get the map edit mode.
     *
     * @return {String}: The mode slug.
     */
    getEditMode: function() {
      return $(this.selectors.mode+':checked').val();
    },


    /**
     * Get the "Draw Regular Polygon" settings.
     *
     * @return {Object}: {sides,snap,irreg}.
     */
    getPolyOptions: function() {
      return {
        sides:  this.__ui.sides.val(),
        snap:   this.__ui.snap.val(),
        irreg:  this.__ui.irreg.is(':checked')
      };
    }


  });


}});
