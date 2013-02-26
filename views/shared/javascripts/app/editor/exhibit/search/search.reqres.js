
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search public request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  var NS = 'editor:exhibit:search';


  /**
   * Get the current query as a route parameter (' ' replaced with '+').
   *
   * @return {String}: The query.
   */
  var getQueryForUrl = function() {
    return Search.__view.getQueryForUrl();
  };
  Neatline.reqres.addHandler(NS+':getQueryForUrl', getQueryForUrl);


});
