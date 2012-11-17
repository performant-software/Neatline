
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Exhibit module.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Modules.Exhibit = (function(Backbone, Neatline) {

  var Exhibit = {};


  /*
   * Create records collection, starting query.
   *
   * @return void.
   */
  Exhibit.init = function() {
    this.collection = new Neatline.Collections.Records();
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
    this.collection.fetch({
      data: $.param(params),
      success: function(collection) {
        Neatline.vent.trigger('exhibit:newRecords', collection);
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
    Exhibit.fetch(params);
  });


  // Export.
  Neatline.addInitializer(function() { Exhibit.init(); });
  return Exhibit;

})(Backbone, Neatline);
