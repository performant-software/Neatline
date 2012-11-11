/**
 * Map controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Controllers.Map = (function(Backbone, Neatline) {

  var Map = {};


  /*
   * Instantiate map.
   *
   * @return void.
   */
  Map.init = function() {
    Map.Map = new Neatline.Views.Map({ el: '#neatline-map' });
  };


  // -------
  // Events.
  // -------

  /*
   * Consume records.
   *
   * @param {Object} records: The records collection.
   *
   * @return void.
   */
  Neatline.vent.on('exhibit:newRecords', function(records) {
    Map.Map.ingest(records);
  });


  // Export.
  Neatline.addInitializer(function() { Map.init(); });
  return Map;

})(Backbone, Neatline);
