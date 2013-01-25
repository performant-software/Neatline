
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
   * Load the starting record list derived from the route parameters.
   *
   * @param {String} query:   The search query.
   * @param {Number} offset:  The limit offset.
   */
  var initialize = function(query, offset) {

    // Parse route parameters, set raw query.
    query = query || null; offset = offset || 0;
    Search.__view.setQuery(query);

    // Load the record list.
    Neatline.execute('editor:records:update', _.extend(
      Search.__view.query, {
        limit:  __editor.perPage,
        offset: offset
      }
    ));

  };

  Neatline.commands.addHandler('editor:search:initialize', initialize);
  Neatline.vent.on('editor:router:#records', initialize);


});
