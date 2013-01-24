
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  /**
   * Return the current search query.
   *
   * @return {String}: The query.
   */
  Neatline.reqres.addHandler('editor:search:getQuery', function() {
    return Search.__view.getQuery();
  });


});
