
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Collection of Neatline records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.Collection = Backbone.Neatline.SyncCollection.extend({


    url: function() { return __exhibit.api; },
    model: Neatline.Record.Model,


    /**
     * Fetch a subset of the collection from the server.
     *
     * @param {Object} params: Query parameters for the records API.
     *
     *  - `extent`: The current map viewport extent, as a WKT polygon.
     *  - `zoom`: The current zoom level of the map, as an integer.
     *
     * @param {Function} cb: Called when `fetch` completes.
     */
    getCollection: function(params, cb) {
      var data = $.param(_.extend({ id: __exhibit.id }, params));
      this.fetch({ data: data, success: cb });
    }


  });


});
