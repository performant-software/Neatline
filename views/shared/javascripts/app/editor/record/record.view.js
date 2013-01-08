
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
      deleteModal:  '#deleteModal',
      textTab:      'a[href="#record-form-text"]',
      textRegion:   '#record-form-text',
      spatial: {
        pan:        'input[value="pan"]',
        sides:      'input[name="sides"]',
        snap:       'input[name="snap"]',
        irreg:      'input[name="irreg"]'
      }
    },

    options: {
      toastr: {
        timeOut:  1500,
        fadeIn:   200,
        fadeOut:  200
      }
    },


    /**
     * Initialize state, render template.
     */
    initialize: function() {
      this.open = false;
      this.hash = null;
      this.getTemplate();
      this.getUi();
      this.setDefaultTab();
    },


    /**
     * Show the form.
     *
     * @param {Object} model: A form model.
     */
    show: function(model) {
      this.open = true;
      Neatline.vent.trigger('editor:record:show', model);
      rivets.bind(this.$el, { record: model });
      this.setBubbleStatus();
      this.resetEditMode();
      this.model = model;
    },


    /**
     * Close the form.
     */
    close: function() {
      this.open = false;
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

        // Flash success.
        success: _.bind(function() {
          this.notifySuccess(STRINGS.record.save.success);
        }, this),

        // Flash failure.
        error: _.bind(function() {
          this.notifyError(STRINGS.record.save.error);
        }, this)

      });

    },


    /**
     * Delete the record.
     */
    remove: function() {

      this.model.destroy({

        success: _.bind(function() {

          // Delete the record's layer on the map.
          Neatline.vent.trigger('editor:record:delete', this.model);

          // FLash success, close modal and form.
          this.notifySuccess(STRINGS.record.delete.success);
          this.__ui.deleteModal.modal('hide');
          this.close();

        }, this),

        // Flash failure.
        error: _.bind(function() {
          this.notifyError(STRINGS.record.delete.error);
        }, this)

      });

    },


    /**
     * Select "Text" tab by default.
     */
    setDefaultTab: function() {
      this.__ui.textRegion.addClass('active');
      this.__ui.textTab.tab('show');
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
    },


    /**
     * Flash a success notification.
     *
     * @param {String} string: The message.
     */
    notifySuccess: function(string) {
      toastr.info(string, null, this.options.toastr);
    },


    /**
     * Flash a failure notification.
     *
     * @param {String} string: The message.
     */
    notifyError: function(string) {
      toastr.error(string, null, this.options.toastr);
    }


  });


});
