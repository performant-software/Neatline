
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Collection of Neatline records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.Collection = Backbone.Neatline.SyncCollection.extend({


    model: Neatline.Shared.Record.Model,


    /**
     * Construct the API url.
     *
     * @return {String}: The url.
     */
    url: function() {
      return __exhibit.api.records;
    },


    /**
     * Cache the total count and offset, return records array.
     *
     * @return {Array}: The records collection.
     */
    parse: function(response) {
      this.offset = response.offset;
      this.count  = response.count;
      return response.records;
    }


  });


});
