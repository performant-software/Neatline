
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * ------------------------------------------------------------------------
 * Map records collection. Serves as the canonical data source for vectors
 * on the map at any given point in time. Updated in real-time in response
 * to pan and zoom events on the map.
 * ------------------------------------------------------------------------
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Collections', function(
  Collections, Neatline, Backbone, Marionette, $, _) {


  Collections.Records = Backbone.Collection.extend({

    url: (function() { return __exhibit.api; }),
    model: Neatline.Map.Models.Record,

    /*
     * --------------------------------------------------------------------
     * Update the collection.
     * --------------------------------------------------------------------
     *
     * @param {Object} params: Query parameters for the records API:
     *
     *  - `extent`: The current map viewport extent, as a WKT polygon.
     *  - `zoom`: The current zoom level of the map, as an integer.
     *  - `keywords` (optional): A raw-text search query.
     *  - `tags` (optional): A comma-delimited list of tags.
     *
     * @unittest
     * @return void.
     */
    updateCollection: function(params) {

      params = params || {};
      params.id = __exhibit.id;

      // Get records.
      this.fetch({
        data: $.param(params),
        success: function(records) {
          Neatline.Map.vent.trigger('records:newRecords', records);
        }
      });

    },

    /*
     * --------------------------------------------------------------------
     * Get a model by id.
     *
     * - If the model is already present in the collection, pass it to the
     *   callback immediately.
     *
     * - If the model is absent, create a new model on the fly, fetch data
     *   from the server, and pass the populated model to the callback.
     * --------------------------------------------------------------------
     *
     * @param {Number} id: The model id.
     * @param {Function} cb: Callback, called with the model.
     *
     * @unittest
     * @return void.
     */
    getModel: function(id, cb) {

      cb = cb || function() {};

      // Try to get existing model.
      // --------------------------

      var model = this.get(id);
      if (model) cb(model);

      // If absent, create and fetch it.
      // -------------------------------

      else {

        // Create new model.
        model = new this.model({ id: id });

        // Fetch data.
        model.fetch({ success: function() {
          cb(model);
        }});

      }

    }

  });


});
