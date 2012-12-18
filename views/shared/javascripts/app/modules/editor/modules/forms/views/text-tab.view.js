
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Text" tab view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Views', function(
  Views, Forms, Backbone, Marionette, $, _) {


  Views.TextTab = Backbone.View.extend({


    /**
     * Get element markup.
     */
    initialize: function() {
      this.title =  this.$el.find('textarea[name="title"]');
      this.body =   this.$el.find('textarea[name="body"]');
    },


    /**
     * Populate input elements with model values.
     *
     * @param {Object} model: The record model.
     */
    render: function(model) {
      this.title.val(model.get('title'));
      this.body.val(model.get('body'));
    },


    /**
     * Return title and body values object.
     *
     * @param {Object}: The values.
     */
    gather: function(model) {
      return {
        title: this.title.val(),
        body: this.body.val()
      };
    }


  });


});
