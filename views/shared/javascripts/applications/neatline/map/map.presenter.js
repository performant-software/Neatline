
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map presenter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /*
   * ----------------------------------------------------------------------
   * Instantiate the map view and records collection.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Map.addInitializer(function() {
    this.collection = new Neatline.Map.Collections.Records();
    this.view = new Neatline.Map.Views.Map({ el: '#neatline-map' });
  });

  /*
   * ----------------------------------------------------------------------
   * Get new map data on pan/zoom.
   * ----------------------------------------------------------------------
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   * @return void.
   */
  Neatline.vent.on('map:move', function(params) {
    Map.collection.updateCollection(params);
  });

  /*
   * ----------------------------------------------------------------------
   * Push new record data onto the map.
   * ----------------------------------------------------------------------
   *
   * @param {Object} records: The new collection.
   * @return void.
   */
  Neatline.vent.on('records:newRecords', function(records) {
    Map.view.ingest(records);
  });

  /*
   * ----------------------------------------------------------------------
   * Focus the map on a record, identified by id.
   * ----------------------------------------------------------------------
   *
   * @param {Number} id: The record id.
   * @return void.
   */
  Neatline.vent.on('map:focusById', function(id) {
    Map.collection.getModel(id, function(model) {
      Map.view.focusByModel(model);
    });
  });

  /*
   * ----------------------------------------------------------------------
   * Focus the map on a record, identified by model.
   * ----------------------------------------------------------------------
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Neatline.vent.on('map:focusByModel', function(model) {
    Map.view.focusByModel(model);
  });


});
