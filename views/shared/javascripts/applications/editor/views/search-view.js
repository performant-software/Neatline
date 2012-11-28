
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Views.Search = Backbone.View.extend({

  events: {
    'keyup input': 'keystroke',
    'click button': 'search'
  },

  /*
   * Get components.
   *
   * @return void.
   */
  initialize: function() {
    this.input = this.$el.find('input');
    this.button = this.$el.find('button');
  },

  /*
   * Check for `Enter` keystroke.
   *
   * @param {Object} e: The keyup event.
   *
   * @return void.
   */
  keystroke: function(e) {
    console.log('keystroke', e);
  },

  /*
   * Execute search.
   *
   * @return void.
   */
  search: function() {
    console.log('search');
  }

});
