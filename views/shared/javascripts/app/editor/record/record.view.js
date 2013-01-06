
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
        irregular:  'input[name="irregular"]'
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
     * Render template, compose default state.
     */
    initialize: function() {

      this.open = false;  // True when the form is displayed.
      this.hash = null;   // The `href` of the currently-selected tab.

      this.getTemplate();
      this.getUi();
      this.setDefaultTab();

    },


    /**
     * Select "Text" tab by default.
     */
    setDefaultTab: function() {
      this.__ui.textRegion.addClass('active');
      this.__ui.textTab.tab('show');
    },


    /**
     * Show the form.
     *
     * @param {Object} model: A form model.
     */
    show: function(model) {

      this.open = true;

      // Bind the model, (de)activate bubble.
      Neatline.vent.trigger('editor:record:show', model);
      rivets.bind(this.$el, { record: model });
      this.setBubbleStatus();

      // Rest the map edit mode to "Navigate".
      this._resetEditMode();
      this.model = model;

    },


    /**
     * Close the form.
     */
    close: function() {

      this.open = false;

      // Show records list, hide/activate the bubble.
      Neatline.vent.trigger('editor:record:close', this.model);
      Neatline.execute('bubble:activate');
      Neatline.execute('bubble:unselect');

      this.model = null;

    },


    /**
     * Gather and publish the current map edit settings.
     */
    updateMap: function() {
      Neatline.vent.trigger('editor:record:update', {
        mode:   this._getEditMode(),
        modify: this._getModifyOptions(),
        poly:   this._getPolyOptions()
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
      Neatline.execute(this._spatialTabActive() ?
        'bubble:deactivate' :
        'bubble:activate'
      );
    },


    /**
     * Save the record.
     */
    save: function() {

      this.model.save(null, {

        // Flash success.
        success: _.bind(function() {
          this._notifySuccess(STRINGS.record.save.success);
        }, this),

        // Flash failure.
        error: _.bind(function() {
          this._notifyError(STRINGS.record.save.error);
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
          this._notifySuccess(STRINGS.record.delete.success);
          this.__ui.deleteModal.modal('hide');
          this.close();

        }, this),

        // Flash failure.
        error: _.bind(function() {
          this._notifyError(STRINGS.record.delete.error);
        }, this)

      });

    },


    /**
     * Is the "Spatial" tab activated?
     *
     * @return {Boolean}: True if "Spatial" is active.
     */
    _spatialTabActive: function() {
      return this.hash == '#record-form-spatial';
    },


    /**
     * Reset the map edit mode to "Navigate".
     */
    _resetEditMode: function() {
      this.__ui.spatial.pan[0].checked = true;
    },


    /**
     * Get the map edit mode.
     *
     * @return {String}: pan|point|line|poly|regPoly|modify|remove.
     */
    _getEditMode: function() {
      return $(this.selectors.mode+':checked').val();
    },


    /**
     * Get the "Modify Shape" checkboxes.
     *
     * @return {Array}: 0-3 strings: rotate|resize|drag.
     */
    _getModifyOptions: function() {
      var inputs = $(this.selectors.modify+':checked');
      return _.map(inputs, function(i) { return $(i).val(); });
    },


    /**
     * Get the "Draw Regular Polygon" settings.
     *
     * @return {Object}: {sides,snap,irregular}.
     */
    _getPolyOptions: function() {
      return {
        sides:      this.__ui.spatial.sides.val(),
        snap:       this.__ui.spatial.snap.val(),
        irregular:  this.__ui.spatial.irregular.is(':checked')
      };
    },


    /**
     * Flash a success notification.
     *
     * @param {String} string: The message.
     */
    _notifySuccess: function(string) {
      toastr.info(string, null, this.options.toastr);
    },


    /**
     * Flash a failure notification.
     *
     * @param {String} string: The message.
     */
    _notifyError: function(string) {
      toastr.error(string, null, this.options.toastr);
    }


  });


});
