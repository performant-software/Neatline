
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search event handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  /**
   * Update the search view with a query and, execute the search.
   *
   * @param {String} query:   The search query.
   * @param {Number} offset:  The limit offset.
   */
  var hydrate = function(query, offset) {
    query = query || null; offset = offset || 0;
    Search.__view.hydrate(query, offset);
  };

  Neatline.commands.addHandler('editor:search:hydrate', hydrate);
  Neatline.vent.on('editor:router:#records', hydrate);


  /**
   * Update the pagination to mirror the current record collection.
   *
   * @param {Object} records: The records collection.
   */
  var paginate = function(records) {
    Search.__view.updatePagination(records);
  };

  Neatline.commands.addHandler('editor:search:paginate', paginate);
  Neatline.vent.on('editor:records:update', paginate);


});
