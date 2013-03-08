
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Style tab form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Style', { startWithParent: false,
  define: function(Style, Neatline, Backbone, Marionette, $, _) {


  Style.View = Backbone.Neatline.View.extend({

    events: {

      // Tab change.
      'shown ul.nav a':               'onTabChange',

      // Set map-derived styles.
      'click a[name="set-min-zoom"]': 'onSetMinZoom',
      'click a[name="set-max-zoom"]': 'onSetMaxZoom',
      'click a[name="set-focus"]':    'onSetFocus',

      // Preview styles.
      'keyup input.preview':          'onStyleKeyup'

    },

    ui: {
      minZoom:  'input[name="min-zoom"]',
      maxZoom:  'input[name="max-zoom"]',
      mapFocus: 'input[name="map-focus"]',
      mapZoom:  'input[name="map-zoom"]'
    },


    /**
     * Instantiate color pickers and draggers.
     */
    onTabChange: function() {

      // INTEGERS
      this.$('input.integer').draggableInput({
        type: 'integer', min: 0, max: 1000
      });

      // OPACITIES
      this.$('input.opacity').draggableInput({
        type: 'integer', min: 0, max: 100
      });

    },


    /**
     * Populate "Min Zoom" with current map value.
     */
    onSetMinZoom: function() {
      var zoom = Neatline.request('MAP:getZoom');
      this.__ui.minZoom.val(zoom).change();
    },


    /**
     * Populate "Max Zoom" with current map value.
     */
    onSetMaxZoom: function() {
      var zoom = Neatline.request('MAP:getZoom');
      this.__ui.maxZoom.val(zoom).change();
    },


    /**
     * Populate default focus and zoom with current map center.
     */
    onSetFocus: function() {
      var center  = Neatline.request('MAP:getCenter');
      var zoom    = Neatline.request('MAP:getZoom');
      this.__ui.mapFocus.val(center.lon+','+center.lat).change();
      this.__ui.mapZoom.val(zoom).change();
    },


    /**
     * Forward `keyup` events to `change` to trigger a model bind.
     *
     * @param {Object} e: The keyup event.
     */
    onStyleKeyup: function(e) {
      $(e.target).trigger('change');
    }


  });


}});
