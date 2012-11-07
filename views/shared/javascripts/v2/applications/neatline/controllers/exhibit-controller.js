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

    // Get records.
    Exhibit.Records = new Neatline.Collections.Records();

    // Emit to widgets.
    Exhibit.Records.on('reset', function() {
      Neatline.vent.trigger('exhibit:newRecords');
    });

    // Fetch.
    Exhibit.Records.fetch();

  };


  // Export.
  Neatline.addInitializer(function() { Exhibit.init(); });
  return Exhibit;

})(Backbone, Neatline);
