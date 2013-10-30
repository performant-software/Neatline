
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', function(Search) {


  Search.ID = 'EDITOR:EXHIBIT:SEARCH';


  Search.addInitializer(function() {


    Search.__view = new Search.View();


    /**
     * Append the form to the editor container.
     *
     * @param {Object} container: The container element.
     */
    var display = function(container) {
      Search.__view.showIn(container);
    };
    Neatline.commands.setHandler(Search.ID+':display', display);


    /**
     * Initialize the record list from route parameters.
     *
     * @param {String} query: The search query.
     * @param {Number} start: The paging offset.
     */
    var init = function(query, start) {

      query = query || null;
      start = start || 0;

      // Set the search query.
      Search.__view.setQueryFromUrl(query);

      // Break if map mirroring.
      if (!Search.__view.mirroring) {

        // Merge route parameters into query.
        var params = _.extend(Search.__view.query, {
          limit:  Neatline.g.neatline.per_page,
          offset: start
        });

        // Query for records.
        Neatline.execute('EDITOR:EXHIBIT:RECORDS:load', params);

      }

    };
    Neatline.commands.setHandler(Search.ID+':initialize', init);


    /**
     * If mirroring is enabled, show map records in the browser.
     *
     * @param {Object} records: The records on the map.
     */
    var mirror = function(records) {

      // Get the record collection on the map.
      records = records || Neatline.request('MAP:getRecords');

      // Render in the record browser.
      if (records && Search.__view.mirroring) {
        Neatline.execute('EDITOR:EXHIBIT:RECORDS:ingest', records);
      }

    };
    Neatline.commands.setHandler(Search.ID+':mirrorMap', mirror);
    Neatline.vent.on('MAP:ingest', mirror);


    /**
     * Get the current query as a route parameter.
     *
     * @return {String}: The query.
     */
    var query = function() {
      return Search.__view.getQueryForUrl();
    };
    Neatline.reqres.setHandler(Search.ID+':getQueryForUrl', query);


  });


});
