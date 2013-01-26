
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
    },


    /**
     * Populate the current search query.
     *
     * @param {String} query: The search query.
     */
    setQuery: function(query) {

      // Convert '+' to spaces.
      if (_.isString(query)) query = query.replace(/\+/g, ' ');

      // Set and parse.
      this.__ui.search.val(query);
      this.parse();

    },


    /**
     * Get the current search query value.
     *
     * @return {String} query: The search query.
     */
    getQuery: function() {
      return this.__ui.search.val();
    },


    /**
     * Get a search URL derived form the current query.
     *
     * @return {String} url: The route.
     */
    getUrl: function() {
      var query = this.getQuery();
      return (query != '') ?
        'records/search/query='+query.replace(/\s/g, '+') :
        'records';
    },


    /**
     * Parse the current input value.
     */
    parse: function() {

      // Get raw query value.
      var value = this.__ui.search.val();
      this.query = {};

      // TAGS
      if (_.string.startsWith(value, 'tags:')) {
        var raw = _.string.trim(_.string.strRight(value, 'tags:'));
        this.query.tags = raw.replace(/\s/g, '').split(',');
        this.bold();
      }

      // MAP
      else if (_.string.startsWith(value, 'map:')) {
        // TODO: Activate mirroring.
        this.bold();
      }

      // QUERY
      else if (!_.isEmpty(value)) {
        this.query.query = value;
        this.unbold();
      }

      else this.unbold();

    },


    /**
     * Parse query and execute search.
     *
     * @param {Object} e: The `keyup` event.
     */
    onKeystroke: function(e) {

      this.parse();

      // Update the route.
      Neatline.execute('editor:updateRoute', this.getUrl());

      // Execute the query.
      Neatline.execute('editor:records:update', _.extend(
        Search.__view.query, {
          limit:  __editor.perPage,
          offset: 0
        }
      ));

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
