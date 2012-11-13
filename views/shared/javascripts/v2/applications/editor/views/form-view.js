/**
 * Form view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Views.Form = Backbone.View.extend({

  tagName: 'div',
  className: 'form',

  template: function() {
    return _.template($('#edit-form').html());
  },

  /*
   * Construct the form template.
   *
   * @return void.
   */
  initialize: function() {
    this.form = $(this.template()());
  },

  /*
   * Show the form.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  show: function(model) {
    this.$el.html(this.form);
  }

});
