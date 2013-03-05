
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  Search.View = Backbone.Neatline.View.extend({


    template:   '#search-template',
    className:  'search',
    tagName:    'form',

    events: {
      'keyup input': 'onKeystroke',
    },

    ui: {
      search: 'input'
    },


    /**
     * Compile search and pagination templates.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      this.mirroring = false; // True if map mirroring is enabled.

    },


    /**
     * Populate the current search query from a route parameter.
     *
     * @param {String} query: The query, with '+' replaced with ' '.
     */
    setQueryFromUrl: function(query) {

      // Convert `+`'s to spaces.
      if (_.isString(query)) query = query.replace(/\+/g, ' ');

      // Set the value and parse.
      this.__ui.search.val(query);
      this.parse();

    },


    /**
     * Get the current search query value for a route parameter.
     *
     * @return {String} query: The query, with ' ' replaced with '+'.
     */
    getQueryForUrl: function() {
      return this.__ui.search.val().replace(/\s/g, '+');
    },


    /**
     * Get a search URL derived form the current query.
     *
     * @return {String} url: The route.
     */
    getUrlFromQuery: function() {
      var q = this.getQueryForUrl();
      return (q != '') ? 'records/search/query='+q : 'records';
    },


    /**
     * Parse the current input value.
     */
    parse: function() {

      this.query = {};

      // Get raw query value.
      var value = this.__ui.search.val();

      // Reset mirroring.
      this.mirroring = false;

      // TAGS
      if (_.string.startsWith(value, 'tags:')) {
        var raw = _.string.trim(_.string.strRight(value, 'tags:'));
        this.query.tags = raw.replace(/\s/g, '').split(',');
        this.bold();
      }

      // MAP
      else if (_.string.startsWith(value, 'map:')) {
        this.mirroring = true;
        Neatline.execute('SEARCH:mirrorMap');
        this.bold();
      }

      // QUERY
      else if (!_.isEmpty(value)) {
        this.query.query = value;
        this.unbold();
      }

      else {
        this.unbold();
      }

    },


    /**
     * Parse query and execute search.
     *
     * @param {Object} e: The `keyup` event.
     */
    onKeystroke: function(e) {

      this.parse();

      // Update the route.
      Backbone.history.navigate(this.getUrlFromQuery());

      // Build parameters object.
      var params = _.extend(this.query, {
        limit: Neatline.global.page_length,
        offset: 0
      });

      // Load records.
      if (!this.mirroring) {
        Neatline.execute('RECORDS:load', params);
      }

    },


    /**
     * Bold the search query.
     */
    bold: function() {
      this.__ui.search.addClass('bold');
    },


    /**
     * Unbold the search query.
     */
    unbold: function() {
      this.__ui.search.removeClass('bold');
    }


  });


});
