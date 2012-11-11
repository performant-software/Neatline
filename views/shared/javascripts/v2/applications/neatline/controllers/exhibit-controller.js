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
   * Create records collection, starting query.
   *
   * @return void.
   */
  Exhibit.init = function() {
    this.records = new Neatline.Collections.Records();
    this.fetch();
  };

  /*
   * Query for records.
   *
   * @param {Object} params: Query parameters.
   *
   * @return void.
   */
  Exhibit.fetch = function(params) {

    params = params || {};

    // Get records.
    this.records.fetch({
      data: $.param(params),
      success: function(collection) {
        Neatline.vent.trigger('exhibit:newRecords', collection);
      }
    });

  };


  // Export.
  Neatline.addInitializer(function() { Exhibit.init(); });
  return Exhibit;

})(Backbone, Neatline);
