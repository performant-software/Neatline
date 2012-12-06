
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
   * @return void.
   */
  Neatline.vent.on('map:move', function(params) {
    Map.collection.getCollection(params, function(records) {
      Neatline.vent.trigger('map:newRecords', records);
      Map.view.ingest(records);
    });
  });


  /**
   * Focus the map on the data extent for a record, identified by id.
   *
   * @param {Number} id: The record id.
   * @return void.
   */
  Neatline.vent.on('map:focusById', function(id) {
    Map.collection.getModel(id, function(model) {
      Map.view.focusByModel(model);
    });
  });


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('map:focusByModel', function(model) {
    Map.view.focusByModel(model);
  });


});
