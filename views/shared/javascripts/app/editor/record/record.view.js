
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
      'click a[name="delete2"]':  'delete'
    },

    ui: {
      deleteModal:  '#deleteModal',
      textTab:      'a[href="#record-form-text"]',
      textRegion:   '#record-form-text'
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

      // Initialize state.
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
