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


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Instantiate map.
   *
   * @return void.
   */
  Map.init = function() {

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
    /* TODO */ console.log(Neatline.Controllers.Exhibit.Records.models);
  });


  // Export.
  Neatline.addInitializer(function() { Map.init(); });
  return Map;

})(Backbone, Neatline);
