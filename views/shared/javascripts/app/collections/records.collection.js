
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Collection of Neatline records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Collections', function(
  Collections, Neatline, Backbone, Marionette, $, _) {


  Collections.Records = Backbone.Collection.extend({


    url: function() {
      return __exhibit.api;
    },


    model: Backbone.Model.extend({
      url: function() { return __exhibit.api+'/'+this.get('id'); }
    }),


    /**
     * Fetch a subset of the collection from the server.
     *
     * @param {Object} params: Query parameters for the records API.
     *
     *  - `extent`: The current map viewport extent, as a WKT polygon.
     *  - `zoom`: The current zoom level of the map, as an integer.
     *
     * @param {Function} cb: Called when the fetch() completes.
     * @return void.
     */
    getCollection: function(params, cb) {
      var data = $.param(_.extend({ id: __exhibit.id }, params));
      this.fetch({ data: data, success: cb });
    },


    /**
     * Get a model by id.
     *
     * - If the model is already present in the collection, pass it to the
     *   callback immediately.
     *
     * - If the model is absent, create a new model on the fly, fetch data
     *   from the server, and pass the populated model to the callback.
     *
     * @param {Number} id: The model id.
     * @param {Function} cb: Callback, called with the model.
     * @return void.
     */
    getModel: function(id, cb) {

      // Get existing model.
      var model = this.get(id);
      if (model) cb(model);

      else {

        // Create new model, populate.
        model = new this.model({ id: id });
        model.fetch({ success: function() {
          cb(model);
        }});

      }

    },


    /**
     * Update the data for a model with the passed id.
     *
     * @param {Number} id: The model id.
     * @param {Object} data: The new data.
     * @return void.
     */
    updateModel: function(id, data) {
      var model = this.get(id);
      if (model) model.set(data);
    }


  });


});
