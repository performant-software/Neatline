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
    Map.Map = new Neatline.Views.Map({ el: '#neatline-map' });
  };


  // -------
  // Events.
  // -------

  /*
   * Consume records.
   *
   * @return void.
   */
  Neatline.vent.on('exhibit:newRecords', function() {
    Map.Map.ingest();
  });


  // Export.
  Neatline.addInitializer(function() { Map.init(); });
  return Map;

})(Backbone, Neatline);
