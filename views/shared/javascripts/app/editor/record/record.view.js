
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.View = Backbone.Neatline.View.extend({


    template:   '#record-form-template',
    className:  'form-stacked record',
    tagName:    'form',

    events: {

      // Save/Close/Delete.
      'click a[name="close"]':          'onCloseClick',
      'click a[name="save"]':           'onSaveClick',
      'click a[name="delete2"]':        'onDeleteClick',

      // Change map edit mode.
      'change div.spatial input':       'onControlChange',
      'keyup div.spatial input':        'onControlChange',

      // Parse SVG geometry.
      'click a[name="parse"]':          'onParseClick',

      // Clear all geometries.
      'click a[name="clear"]':          'onClearClick',

      // Tab changes.
      'shown ul.nav a':                 'onTabChange'

    },

    selectors: {
      mode:       'input[name="mode"]',
      modify:     'input[name="modify"]'
    },

    ui: {

      // "Text" tab.
      text: {
        tab:      'a[href="#record-form-text"]',
        region:   '#record-form-text'
      },

      // "Spatial" tab.
      spatial: {
        pan:      'input[value="pan"]',
        sides:    'input[name="sides"]',
        snap:     'input[name="snap"]',
        irreg:    'input[name="irreg"]',
        svg:      'textarea[name="svg"]',
        density:  'input[name="density"]',
        modal:    '#svg-modal'
      },

      // Delete.
      remove: {
        modal:    '#delete-modal'
      }

    },


    /**
     * Initialize state, render template.
     */
    initialize: function() {

      this.open = false;  // True when the form is displayed.
      this.hash = null;   // The `href` of the active tab.

      this.getTemplate();
      this.getUi();
      this.resetTabs();

    },


    /**
     * Show the form.
     *
     * @param {Object} model: A record model.
     */
    show: function(model) {

      // Activate map editing, bind model to form.
      Neatline.execute('MAPEDIT:startEdit', model);
      rivets.bind(this.$el, { record: model });

      // Update map on model change.
      model.bind('change', function() {
        Neatline.execute('MAPEDIT:updateModel', model);
      });

      this.setPresenterStatus();
      this.resetEditMode();

      this.model = model;
      this.open  = true;

    },


    /**
     * End the map edit session, reset the presenter.
     */
    deactivate: function() {

      // Deactivate map editing.
      Neatline.execute('MAPEDIT:endEdit', this.model);

      // Activate and close the presenter.
      Neatline.vent.trigger('PRESENTER:activate');
      Neatline.execute('PRESENTER:unselect', this.model);

      this.model = null;
      this.open  = false;

    },


    /**
     * Close the form.
     */
    onCloseClick: function() {
      Neatline.execute('RECORDS:navToList');
      this.deactivate();
    },


    /**
     * Save the record.
     */
    onSaveClick: function() {
      this.model.save(null, {
        success:  _.bind(this.onSaveSuccess, this),
        error:    _.bind(this.onSaveError, this)
      });
    },


    /**
     * Delete the record.
     */
    onDeleteClick: function() {
      this.model.destroy({
        success:  _.bind(this.onDeleteSuccess, this),
        error:    _.bind(this.onDeleteError, this)
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {

      // Refresh the map.
      Neatline.execute('MAP:refresh');

      // Update the route.
      Neatline.execute('RECORD:updateRoute',
        'records/'+this.model.get('id')
      );

      // Flash success.
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.record.save.success
      );

    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.record.save.error
      );
    },


    /**
     * When a delete succeeds.
     */
    onDeleteSuccess: function() {

      // Delete the record's layer on the map.
      Neatline.execute('MAPEDIT:deleteLayer', this.model);
      this.__ui.remove.modal.modal('hide');

      // FLash success.
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.record.remove.success
      );

      this.onCloseClick();

    },


    /**
     * When a delete fails.
     */
    onDeleteError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.record.remove.error
      );
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

      var val = this.__ui.spatial.svg.val();

      try {

        // Set density.
        SVGtoWKT.DENSITY = parseFloat(
          this.__ui.spatial.density.val()
        );

        // Covnert SVG, update handler.
        var wkt = SVGtoWKT.convert(val);
        Neatline.execute('MAPEDIT:updateWKT', wkt);

        // Flash success.
        Neatline.execute('EDITOR:notifySuccess',
          STRINGS.svg.parse.success
        );

        // Close the modal.
        this.__ui.spatial.modal.modal('hide');

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
     * Cache the current tab hash, (de)activate the presenter.
     *
     * @param {Object} event: The `shown` event.
     */
    onTabChange: function(event) {
      this.hash = event.target.hash;
      this.setPresenterStatus();
      this.resetEditMode();
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
      return this.hash == '#record-form-spatial';
    },


    /**
     * Activate the "Text" tab.
     */
    resetTabs: function() {
      this.__ui.text.region.addClass('active');
      this.__ui.text.tab.tab('show');
    },


    /**
     * Reset the map edit mode to "Navigate".
     */
    resetEditMode: function() {
      this.__ui.spatial.pan[0].checked = true;
      this.__ui.spatial.pan.trigger('change');
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
        sides:  this.__ui.spatial.sides.val(),
        snap:   this.__ui.spatial.snap.val(),
        irreg:  this.__ui.spatial.irreg.is(':checked')
      };
    }


  });


});
