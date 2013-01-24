
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
   * Update the search box query.
   *
   * @param {String} query: The search query.
   */
  var setQuery = function(query) {
    Search.__view.setQuery(query);
  };

  Neatline.commands.addHandler('editor:search:setQuery', setQuery);
  Neatline.vent.on('editor:router:#records', setQuery);


});
