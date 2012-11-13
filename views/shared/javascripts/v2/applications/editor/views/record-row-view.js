/**
 * Record row view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Views.RecordRow = Backbone.View.extend({

  tagName: 'li',
  className: 'record-row',

  template: function() {
    return _.template($('#record-listing').html());
  },

  events: {
    'mousedown': 'openForm'
  },

  /*
   * Set instance model.
   *
   * @return void.
   */
  initialize: function() {

    // Store model.
    this.model = this.options.model;

    // Render template.
    this.$el.append($(this.template()({
      title: this.model.get('title')
    })));

  },

  /*
   * Open the edit form for the record.
   *
   * @return void.
   */
  openForm: function() {
    Editor.vent.trigger('records:openForm', this.model);
  }

});
