
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', function(Search) {


  Search.View = Neatline.Shared.View.extend({


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
     * Initialize state.
     */
    init: function() {
      this.mirroring = false; // True if map mirroring is enabled.
    },


    /**
     * Populate the current search query from a route parameter.
     *
     * @param {String} query: The query, with ' ' replaced with '+'.
     */
    setQueryFromUrl: function(query) {

      // Convert `+` -> ' ".
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
      var query = this.getQueryForUrl();
      return (query != '') ? 'browse/query='+query : 'browse';
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
        var body = _.string.trim(_.string.strRight(value, 'tags:'));
        this.query.tags = body.replace(/\s/g, '').split(',');
        this.bold();
      }

      // MAP
      else if (_.string.startsWith(value, 'map:')) {
        this.mirroring = true;
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

      // Update the route, execute the query.
      Neatline.execute('EDITOR:setRoute', this.getUrlFromQuery());
      Neatline.execute('EDITOR:EXHIBIT:SEARCH:execute');

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
