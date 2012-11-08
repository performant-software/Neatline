/**
 * Exhibit controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Controllers.Exhibit = (function(Backbone, Neatline) {

  var Exhibit = {};


  // ---------------
  // Initialization.
  // ---------------

  /*
   * Populate records collection.
   *
   * @return void.
   */
  Exhibit.init = function() {

    // Create records collection.
    var records = new Neatline.Collections.Records();

    // Listen for new records.
    records.on('reset', function() {
      Neatline.vent.trigger('exhibit:newRecords', records);
    });

    // Fetch.
    records.fetch();

  };


  // Export.
  Neatline.addInitializer(function() { Exhibit.init(); });
  return Exhibit;

})(Backbone, Neatline);
