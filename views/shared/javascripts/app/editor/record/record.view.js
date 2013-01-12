
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
      'click a[name="close"]':    'close',
      'click a[name="save"]':     'save',
      'click a[name="delete2"]':  'remove',
      'shown ul.nav a':           'updateBubble',
      'change div.spatial input': 'updateMap',
      'keyup div.spatial input':  'updateMap'
    },

    selectors: {
      mode:   'input[name="mode"]',
      modify: 'input[name="modify"]'
    },

    ui: {
      tabs:         'ul.nav a',
      modal:        '#delete-modal',
      text: {
        tab:        'a[href="#record-form-text"]',
        region:     '#record-form-text'
      },
      spatial: {
        pan:        'input[value="pan"]',
        sides:      'input[name="sides"]',
        snap:       'input[name="snap"]',
        irreg:      'input[name="irreg"]'
      }
    },


    /**
     * Initialize state, render template.
     */
    initialize: function() {

      this.open   = false;  // True when the form is displayed.
      this.hash   = null;   // The `href` of the active tab.

      this.getTemplate();
      this.getUi();

      // Activate "Text" by default.
      this.__ui.text.region.addClass('active');
      this.__ui.text.tab.tab('show');

    },


    /**
     * Show the form.
     *
     * @param {Object} model: A record model.
     */
    show: function(model) {

      this.model  = model;
      this.open   = true;

      // Activate map editing, bind form data.
      Neatline.vent.trigger('editor:record:show', this.model);
      rivets.bind(this.$el, { record: model });

      this.setBubbleStatus();
      this.resetEditMode();

    },


    /**
     * Close the form.
     */
    close: function() {

      this.open = false;

      // Deactivate map editing, close/activate bubble.
      Neatline.vent.trigger('editor:record:close', this.model);
      Neatline.execute('bubble:activate');
      Neatline.execute('bubble:unselect');

      this.model = null;

    },


    /**
     * Save the record.
     */
    save: function() {
      this.model.save(null, {
        success:  _.bind(this.onSaveSuccess, this),
        error:    _.bind(this.onSaveError, this)
      });
    },


    /**
     * Delete the record.
     */
    remove: function() {
      this.model.destroy({
        success:  _.bind(this.onDeleteSuccess, this),
        error:    _.bind(this.onDeleteError, this),
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {

      // Update the route.
      Neatline.execute('editor:updateRoute',
        'records/'+this.model.get('id')
      );

      // Flash success.
      Neatline.execute('editor:notifySuccess',
        STRINGS.record.save.success
      );

    },


    /**
     * When a save fails.
     */
    onSaveError: function() {

      // Flash error.
      Neatline.execute('editor:notifyError',
        STRINGS.record.save.error
      );

    },


    /**
     * When a delete succeeds.
     */
    onDeleteSuccess: function() {

      // Delete the record's layer on the map.
      Neatline.vent.trigger('editor:record:delete', this.model);
      this.__ui.modal.modal('hide');

      // FLash success, close form.
      Neatline.execute('editor:notifySuccess',
        STRINGS.record.delete.success
      );

      this.close();

    },


    /**
     * When a delete fails.
     */
    onDeleteError: function() {

      // Flash error.
      Neatline.execute('editor:notifyError',
        STRINGS.record.delete.error
      );

    },


    /**
     * Gather and publish the current map edit settings.
     */
    updateMap: function() {
      Neatline.vent.trigger('editor:record:update', {
        mode:   this.getEditMode(),
        modify: this.getModifyOptions(),
        poly:   this.getPolyOptions()
      });
    },


    /**
     * Cache the current tab hash, (de)activate the bubble.
     *
     * @param {Object} event: The `shown` event.
     */
    updateBubble: function(event) {
      this.hash = event.target.hash;
      this.setBubbleStatus();
    },


    /**
     * Deactivate the bubble when the "Spatial" tab is active.
     */
    setBubbleStatus: function() {
      Neatline.execute(this.spatialTabActive() ?
        'bubble:deactivate' :
        'bubble:activate'
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
     * Reset the map edit mode to "Navigate".
     */
    resetEditMode: function() {
      this.__ui.spatial.pan[0].checked = true;
    },


    /**
     * Get the map edit mode.
     *
     * @return {String}: pan|point|line|poly|regPoly|modify|remove.
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
