
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


  var LIMIT = 50;


  Search.View = Backbone.Neatline.View.extend({


    template:   '#search-template',
    className:  'search',
    tagName:    'form',

    ui: {
      search:     'input',
      pagination: '.pagination'
    },


    /**
     * Compile search and pagination templates.
     */
    initialize: function() {
      this.pagination = _.template($('#pagination-template').html());
      this.getTemplate();
      this.getUi();
    },


    /**
     * Update the paginator.
     *
     * @param {Object} records: The current records collection.
     */
    paginate: function(records) {
      this.__ui.pagination.html(this.pagination({
        query:    this.__ui.search.val(),
        records:  records,
        limit:    LIMIT
      }));
    },


    /**
     * Hydrate a search route.
     *
     * @param {String} query:   The search query.
     * @param {Number} offset:  The limit offset.
     */
    hydrate: function(query, offset) {
      this.__ui.search.val(query);
      Neatline.execute('editor:records:update', {
        query: query, limit: LIMIT, offset: offset
      });
    }


  });


});
