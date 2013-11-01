
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', function(Search) {


  Search.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:EXHIBIT:SEARCH',

    events: [
      { 'MAP:ingest': 'mirror' }
    ],

    commands: [
      'display',
      'search',
      'mirror'
    ],

    requests: [
      'getQueryForUrl'
    ],


    /**
     * Create the view.
     */
    init: function() {
      this.view = new Search.View();
    },


    /**
     * Append the form to the editor container.
     *
     * @param {Object} container: The container element.
     */
    display: function(container) {
      this.view.showIn(container);
    },


    /**
     * Populate the record list from route parameters.
     *
     * @param {String} query: The search query.
     * @param {Number} start: The paging offset.
     */
    search: function(query, start) {

      query = query || null;
      start = start || 0;

      // Set the search query.
      this.view.setQueryFromUrl(query);

      // Break if map mirroring.
      if (!this.view.mirroring) {

        // Merge route parameters into query.
        var params = _.extend(this.view.query, {
          limit:  Neatline.g.neatline.per_page,
          offset: start
        });

        // Query for records.
        Neatline.execute('EDITOR:EXHIBIT:RECORDS:load', params);

      }

    },


    /**
     * If mirroring is enabled, show map records in the browser.
     *
     * @param {Object} records: The records on the map.
     */
    mirror: function(records) {

      // Get the record collection on the map.
      records = records || Neatline.request('MAP:getRecords');

      // Render in the record browser.
      if (records && this.view.mirroring) {
        Neatline.execute('EDITOR:EXHIBIT:RECORDS:ingest', records);
      }

    },


    /**
     * Get the current query as a route parameter.
     *
     * @return {String}: The query.
     */
    getQueryForUrl: function() {
      return this.view.getQueryForUrl();
    }


  });


});
