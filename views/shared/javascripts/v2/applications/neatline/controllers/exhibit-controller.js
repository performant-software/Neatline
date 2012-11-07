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
    Exhibit.Records.url = __exhibit.data;
    Exhibit.Records.fetch();

    // Emit to widgets.
    Neatline.vent.trigger('exhibit:newRecords');

  };


  // Export.
  Neatline.addInitializer(function() { Exhibit.init(); });
  return Exhibit;

})(Backbone, Neatline);
