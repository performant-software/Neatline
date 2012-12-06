
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Text" tab view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.TextTab.Views', function(
  Views, TextTab, Backbone, Marionette, $, _) {


  Views.Tab = Backbone.View.extend({


    /**
     * Get element markup.
     *
     * @param {Object|DOMElement} form: The form element.
     * @return void.
     */
    getElements: function(form) {
      this.title = form.find('textarea[name="title"]');
      this.body = form.find('textarea[name="body"]');
    },


    /**
     * Populate input elements with model values.
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    render: function(model) {
      this.title.val(model.get('title'));
      this.body.val(model.get('description'));
    },


    /**
     * Return title and body values object.
     *
     * @param {Object}: The values.
     * @return void.
     */
    gather: function(model) {
      return {
        title: this.title.val(),
        description: this.body.val()
      };
    }


  });


});
