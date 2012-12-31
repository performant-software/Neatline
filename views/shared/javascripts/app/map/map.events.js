
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Query for updated spatial data when the map is panned or zoomed.
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   */
  Neatline.vent.on('map:move', function(params) {
    Map.__collection.update(params, function(records) {
      Neatline.vent.trigger('map:newRecords', records);
      Map.__view.ingest(records);
    });
  });


});
