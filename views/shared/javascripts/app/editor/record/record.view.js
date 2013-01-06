
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
      'click a[name="delete2"]':  'delete',
      'change div.spatial input': 'sync',
      'keyup div.spatial input':  'sync'
    },

    selectors: {
      mode:   'input[name="mode"]',
      modify: 'input[name="modify"]'
    },

    ui: {
      deleteModal:  '#deleteModal',
      textTab:      'a[href="#record-form-text"]',
      textRegion:   '#record-form-text',
      spatial: {
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
     * Render template.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      // Start state.
      this.setDefaultTab();
      this.open = false;

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
      Neatline.vent.trigger('editor:record:show', model);
      rivets.bind(this.$el, { record: model });
      this.model = model;
    },


    /**
     * Close the form.
     */
    close: function() {
      this.open = false;
      Neatline.vent.trigger('editor:record:close', this.model);
      this.model = null;
    },


    /**
     * Gather and publish the current map edit settings.
     */
    sync: function() {
      Neatline.vent.trigger('editor:record:update', {
        mode:   this._mode(),
        modify: this._modify(),
        poly:   this._poly()
      });
    },


    /**
     * Get the map edit mode.
     *
     * @return {String}: pan|point|line|poly|regPoly|modify|remove.
     */
    _mode: function() {
      return $(this.selectors.mode+':checked').val();
    },


    /**
     * Get the "Modify Shape" checkboxes.
     *
     * @return {Array}: 0-3 strings: rotate|resize|drag.
     */
    _modify: function() {
      var inputs = $(this.selectors.modify+':checked');
      return _.map(inputs, function(i) { return $(i).val(); });
    },


    /**
     * Get the "Draw Regular Polygon" settings.
     *
     * @return {Object}: {sides,snap,irreg}.
     */
    _poly: function() {
      return {
        sides:  this.__ui.spatial.sides.val(),
        snap:   this.__ui.spatial.snap.val(),
        irreg:  this.__ui.spatial.irreg.is(':checked')
      };
    },


    /**
     * Save the record.
     */
    save: function() {
      this.model.save(null, {
        success: _.bind(function() {
          this._notifySuccess(STRINGS.record.save.success);
        }, this),
        error: _.bind(function() {
          this._notifyError(STRINGS.record.save.error);
        }, this)
      });
    },


    /**
     * Delete the record.
     */
    delete: function() {
      this.model.destroy({
        success: _.bind(function() {
          this._notifySuccess(STRINGS.record.delete.success);
          this.__ui.deleteModal.modal('hide');
          this.close();
        }, this),
        error: _.bind(function() {
          this._notifyError(STRINGS.record.delete.error);
        }, this)
      });
    },


    /**
     * Flash a success notification.
     *
     * @param {String} string: The message.
     */
    _notifySuccess: function(string) {
      toastr.success(string, null, this.options.toastr);
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
