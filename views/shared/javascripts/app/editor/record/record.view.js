
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

    ui: {
      textTab:    'a[href="#record-form-text"]',
      textRegion: '#record-form-text'
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
      rivets.bind(this.$el, {record: model});
      this.model = model;
    }


  });


});
