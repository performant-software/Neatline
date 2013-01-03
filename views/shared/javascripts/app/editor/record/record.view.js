
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
      'click a[name="close"]':   'close',
      'click a[name="save"]':    'save',
      'click a[name="delete"]':  'delete'
    },

    ui: {
      textTab:    'a[href="#record-form-text"]',
      textRegion: '#record-form-text',
      buttons: {
        close:    'a[name="close"]',
        save:     'a[name="save"]',
        delete:   'a[name="delete"]'
      }
    },


    /**
     * Render template.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      // Select "Text" tab by default.
      this.__ui.textRegion.addClass('active');
      this.__ui.textTab.tab('show');

    },


    /**
     * Bind model to form.
     */
    bindModel: function(model) {
      rivets.bind(this.$el, { record: model });
      this.model = model;
    },


    /**
     * Close the form.
     */
    close: function() {
      Neatline.vent.trigger('editor:record:closeRecord');
      this.model = null;
    },


    /**
     * Save the record.
     */
    save: function() {
      this._setSaving();
      this.model.save(null, {
        success: _.bind(this._setSaved, this)
      });
    },


    /**
     * Delete the record.
     */
    delete: function() {

    },


    /**
     * .
     */
    _setSaving: function() {
      this.__ui.buttons.save.addClass('disabled');
    },


    /**
     * .
     */
    _setSaved: function() {
      this.__ui.buttons.save.removeClass('disabled');
    }


  });


});
