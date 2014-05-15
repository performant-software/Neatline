
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Map', {
  startWithParent: false,
  define: function(Map) {


    Map.View = Neatline.Shared.View.extend({


      events: {

        // Toggle the presenter.
        'shown.bs.tab ul.nav a':  'onTabChange',

        // Apply settings changes.
        'change div.map input':   'onControlChange',
        'keyup div.map input':    'onControlChange',
        'click a[name="clear"]':  'onClearClick',

        // Manifest new coverages.
        'keyup textarea[name="coverage"]': 'onCoverageKeyup'

      },

      selectors: {
        mode:   'input[name="mode"]',
        modify: 'input[name="modify"]'
      },

      ui: {
        pan:    'input[value="pan"]',
        sides:  'input[name="sides"]',
        snap:   'input[name="snap"]',
        irreg:  'input[name="irreg"]'
      },


      /**
       * Initialize state.
       */
      init: function() {
        this.tab = null; // The hash of the active tab.
        this._initSvgModal();
      },


      /**
       * Cache the SVG modal, listen for parse attempts.
       */
      _initSvgModal: function() {

        // Cache the element.
        this.svgModal = $('#svg-modal');

        // Cache the SVG inputs.
        this.svgContent = this.svgModal.find('textarea[name="svg"]');
        this.svgDensity = this.svgModal.find('input[name="density"]');

        // Listen for "Parse" clicks.
        this.svgModal.find('a[name="parse"]').click(
          _.bind(this.onParseClick, this)
        );

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

        var val = this.svgContent.val();

        try {

          // Set density.
          SVGtoWKT.DENSITY = parseFloat(
            this.svgDensity.val()
          );

          // Convert SVG, update handler.
          var wkt = SVGtoWKT.convert(val);
          Neatline.execute('EDITOR:MAP:updateSvgWkt', wkt);

          // Close the modal.
          this.svgModal.modal('hide');

          // Flash success.
          Neatline.execute('EDITOR:notifySuccess',
            Neatline.g.neatline.strings.svg.parse.success
          );

        } catch (e) {
          Neatline.execute('EDITOR:notifyError',
            Neatline.g.neatline.strings.svg.parse.error
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
       * Forward `keyup` events on the "Coverage" input to `change`, which
       * will trigger a model update and render the new coverage.
       *
       * @param {Object} e: The keyup event.
       */
      onCoverageKeyup: function(e) {
        $(e.target).trigger('change');
      },


      /**
       * Deactivate the presenter when "Map" is active.
       */
      setPresenterStatus: function() {
        Neatline.vent.trigger(this.mapTabActive() ?
          'deactivatePresenter' : 'activatePresenter'
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


  }
});
