
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Spatial tab form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Spatial', { startWithParent: false,
  define: function(Spatial, Neatline, Backbone, Marionette, $, _) {


  Spatial.View = Backbone.Neatline.View.extend({


    events: {
      'shown ul.nav a':           'onTabChange',
      'change div.spatial input': 'onControlChange',
      'keyup div.spatial input':  'onControlChange',
      'click a[name="parse"]':    'onParseClick',
      'click a[name="clear"]':    'onClearClick'
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
      Neatline.execute('MAPEDIT:updateEdit', {
        mode:   this.getEditMode(),
        modify: this.getModifyOptions(),
        poly:   this.getPolyOptions()
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
        Neatline.execute('MAPEDIT:updateWKT', wkt);

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
      Neatline.execute('MAPEDIT:clearLayer');
    },


    /**
     * Deactivate the presenter when the "Spatial" tab is active.
     */
    setPresenterStatus: function() {
      Neatline.vent.trigger(this.spatialTabActive() ?
        'PRESENTER:deactivate' :
        'PRESENTER:activate'
      );
    },


    /**
     * Is the "Spatial" tab activated?
     *
     * @return {Boolean}: True if "Spatial" is active.
     */
    spatialTabActive: function() {
      return this.tab == '#record-spatial';
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
     * @return {String}: pan|point|line|poly|svg|regPoly|modify|remove.
     */
    getEditMode: function() {
      return $(this.selectors.mode+':checked').val();
    },


    /**
     * Get the "Modify Shape" checkboxes.
     *
     * @return {Array}: 0-3 strings: rotate|resize|drag.
     */
    getModifyOptions: function() {
      var inputs = $(this.selectors.modify+':checked');
      return _.map(inputs, function(i) { return $(i).val(); });
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
