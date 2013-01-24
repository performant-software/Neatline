
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
      search: 'input'
    },


    /**
     * Compile search and pagination templates.
     */
    initialize: function() {
      this.getTemplate();
      this.getUi();
    },


    /**
     * Populate the current search query.
     *
     * @param {String} query: The search query.
     */
    setQuery: function(query) {
      this.__ui.search.val(query);
      // TODO: parse.
    },


    /**
     * Return the current search query.
     *
     * @return {String} query: The search query.
     */
    getQuery: function() {
      return this.__ui.search.val();
    }


  });


});
