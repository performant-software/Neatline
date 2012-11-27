
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Map module.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Modules.Map = (function(Backbone, Neatline) {

  var Map = {};


  /*
   * Instantiate map.
   *
   * @return void.
   */
  Map.init = function() {
    this.collection = new Neatline.Collections.Records();
    this.view = new Neatline.Views.Map({ el: '#neatline-map' });
  };

  /*
   * Query for records.
   *
   * @param {Object} params: Query parameters.
   *
   * @return void.
   */
  Map.fetch = function(params) {

    params = params || {};
    params.id = __exhibit.id;

    // Get records.
    this.collection.fetch({
      data: $.param(params),
      success: function(records) {

        // Ingest, publish.
        Map.view.ingest(records);
        Neatline.vent.trigger('exhibit:newRecords', records);

      }
    });

  };


  // -------
  // Events.
  // -------

  /*
   * Get new map data on pan/zoom.
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   *
   * @return void.
   */
  Neatline.vent.on('map:move', function(params) {
    Map.fetch(params);
  });

  /*
   * Focus the map for a record.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Neatline.vent.on('map:focus', function(model) {
    Map.view.focusByModel(model);
  });


  // Export.
  Neatline.addInitializer(function() { Map.init(); });
  return Map;

})(Backbone, Neatline);
