
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the form to the editor container.
   */
  var display = function() {
    Search.__view.showIn(Neatline.request('editor:getContainer'));
  };
  Neatline.commands.addHandler('editor:search:display', display);


  /**
   * Initialize the record list from route parameters.
   *
   * @param {String} query: The search query.
   * @param {Number} start: The paging offset.
   */
  var initialize = function(query, start) {

    query = query || null;
    start = start || 0;

    // Set the search query.
    Search.__view.setQueryFromUrl(query);

    // Load the record list.
    Neatline.execute('editor:records:load', _.extend(
      Search.__view.query, {
        limit:  Neatline.global.page_length,
        offset: start
      }
    ));

  };
  Neatline.commands.addHandler('editor:search:initialize', initialize);


  /**
   * Render the current map record collection in the browser.
   */
  var syncWithMap = function() {
    var records = Neatline.request('map:getRecords');
    if (records)  Neatline.execute('editor:records:ingest', records);
  };
  Neatline.commands.addHandler('editor:search:syncWithMap', syncWithMap);


  /**
   * Propagate new map records to the browser if mirroring is enabled.
   *
   * @param {Object} records: The collection or records.
   */
  var mirror = function(records) {
    if (Search.__view.mirroring) {
      Neatline.execute('editor:records:ingest', records);
    }
  };
  Neatline.commands.addHandler('editor:search:mirror', mirror);
  Neatline.vent.on('map:ingest', mirror);


});
