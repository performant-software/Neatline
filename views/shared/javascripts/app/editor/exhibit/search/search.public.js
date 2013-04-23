
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the form to the editor container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Search.__view.showIn(container);
  };
  Neatline.commands.setHandler('E:EXHIBIT:SEARCH:display', display);


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
        limit:  Neatline.global.page_length,
        offset: start
      });

      // Query for records.
      Neatline.execute('E:EXHIBIT:RECORDS:load', params);

    }

  };
  Neatline.commands.setHandler('E:EXHIBIT:SEARCH:initialize', init);


  /**
   * If mirroring is enabled, render the map collection in the browser.
   */
  var mirror = function(records) {

    // Get the record collection on the map.
    records = records || Neatline.request('MAP:getRecords');

    // Render in the record browser.
    if (records && Search.__view.mirroring) {
      Neatline.execute('E:EXHIBIT:RECORDS:ingest', records);
    }

  };
  Neatline.commands.setHandler('E:EXHIBIT:SEARCH:mirrorMap', mirror);
  Neatline.vent.on('MAP:ingest', mirror);


  /**
   * Get the current query as a route parameter.
   *
   * @return {String}: The query.
   */
  var query = function() {
    return Search.__view.getQueryForUrl();
  };
  Neatline.reqres.setHandler('E:EXHIBIT:SEARCH:getQueryForUrl', query);


});
