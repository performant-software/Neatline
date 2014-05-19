
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Style', {
  startWithParent: false,
  define: function(Style) {


    Style.View = Neatline.Shared.View.extend({


      events: {

        // Build the UI widgets when the tab is shown.
        'shown.bs.tab a[data-slug="style"]': 'activate',

        // Set map-derived styles.
        'click a[name="set-min-zoom"]':   'onSetMinZoom',
        'click a[name="set-max-zoom"]':   'onSetMaxZoom',
        'click a[name="set-map-focus"]':  'onSetMapFocus',
        'click a[name="set-map-zoom"]':   'onSetMapZoom',
        'click a[name="set-focus"]':      'onSetFocus',

        // Preview styles.
        'keyup input.preview': 'onStyleKeyup'

      },

      ui: {
        widgets:  'select[name="widgets"]',
        minZoom:  'input[name="min-zoom"]',
        maxZoom:  'input[name="max-zoom"]',
        mapFocus: 'input[name="map-focus"]',
        mapZoom:  'input[name="map-zoom"]'
      },


      /**
       * Instantiate color pickers and draggers.
       */
      activate: function() {

        // SELECT2
        this.__ui.widgets.select2();

        // COLORS
        this.$('input.color').spectrum({

          move: function(color) {
            $(this).val(color.toHexString()).trigger('change');
          },

          showButtons: false,
          clickoutFiresChange: true,
          showInput: true

        });

        // OPACITIES
        this.$('input.opacity').draggableInput({
          type: 'float', min: 0, max: 1, scrollPrecision: 0.002
        });

        // INTEGERS
        this.$('input.integer').draggableInput({
          type: 'integer', min: 0, max: 1000
        });

      },


      /**
       * Populate "Min Zoom" with current map value.
       */
      onSetMinZoom: function() {
        this._setCurrentZoom(this.__ui.minZoom);
      },


      /**
       * Populate "Max Zoom" with current map value.
       */
      onSetMaxZoom: function() {
        this._setCurrentZoom(this.__ui.maxZoom);
      },


      /**
       * Populate "Default Focus" with current map value.
       */
      onSetMapFocus: function() {
        this._setCurrentFocus(this.__ui.mapFocus);
      },


      /**
       * Populate "Default Zoom" with current map value.
       */
      onSetMapZoom: function(e) {
        this._setCurrentZoom(this.__ui.mapZoom);
      },


      /**
       * Populate default focus and zoom with current map center.
       */
      onSetFocus: function() {
        this.onSetMapFocus();
        this.onSetMapZoom();
      },


      /**
       * Forward `keyup` events to `change` to trigger a model bind.
       *
       * @param {Object} e: The keyup event.
       */
      onStyleKeyup: function(e) {
        $(e.target).trigger('change');
      },


      /**
       * Set the current map focus as the value of an input.
       *
       * @param {Object} element: The element.
       */
      _setCurrentFocus: function(element) {
        var center = Neatline.request('MAP:getCenter');
        element.val(center.lon+','+center.lat).change();
      },


      /**
       * Set the current map zoom as the value of an input.
       *
       * @param {Object} element: The element.
       */
      _setCurrentZoom: function(element) {
        var zoom = Neatline.request('MAP:getZoom');
        var minZoom = Neatline.request('MAP:getMinZoom');
        element.val(minZoom + zoom).change();
      }


    });


  }
});
