
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

  /*
   * Get components, bind events.
   *
   * @return void.
   */
  initialize: function() {

    // UX.
    this.input = this.$el.find('input');
    this.button = this.$el.find('button');

  }

});
