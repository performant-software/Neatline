
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  Search.View = Backbone.Neatline.View.extend({


    template:   '#search-template',
    className:  'search',
    tagName:    'form',

    ui: {
      pagination: '.pagination'
    },


    /**
     * Compile search and pagination templates.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      // Compile the pagination template, render defaults.
      this.pagination = _.template($('#pagination-template').html());

    },


    /**
     * Update the paginator.
     *
     * @param {Object} locals: {
     *    prev:   The link to the previous page.
     *    next:   The link to the next page.
     *    start:  The starting record offset.
     *    end:    The ending record offset.
     *    total:  The total number of records.
     *  }
     */
    updatePagination: function(locals) {
      this.__ui.pagination.html(this.pagination(locals));
    }


  });


});
