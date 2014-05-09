
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
      'hydrate',
      'execute',
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
    hydrate: function(query, start) {
      this.view.setQueryFromUrl(query);
      this.execute(start);
    },


    /**
     * Perform the query current search query.
     *
     * @param {Number} start: The paging offset.
     */
    execute: function(start) {

      // Apply map mirroring.
      if (this.view.mirroring) this.mirror();

      else {

        // Merge route parameters into query.
        var params = _.extend(this.view.query, {
          limit: Neatline.g.neatline.per_page, start: start || 0
        });

        // Load the list of records.
        Neatline.execute('EDITOR:EXHIBIT:RECORDS:load', params);

      }

    },


    /**
     * If mirroring is enabled, show map records in the browser.
     *
     * @param {Object} records: The records on the map.
     */
    mirror: function(records) {

      // Break if not mirroring.
      if (!this.view.mirroring) return;

      // Display the map collection in the browser.
      records = records || Neatline.request('MAP:getRecords')
      Neatline.execute('EDITOR:EXHIBIT:RECORDS:ingest', records);

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
