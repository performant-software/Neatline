
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


  Collections.Record = Backbone.Collection.extend({


    url: function() { return __exhibit.api; },
    model: Neatline.Models.Record,


    /**
     * When any instance of the `Record` model changes, check to see if a
     * model with the same id is in the collection and, if so, update it.
     */
    initialize: function() {
      this.model.prototype.bind('change', _.bind(function(model) {
        this.updateModel(model.toJSON());
      }, this));
    },


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
     * @param {Object} json: The new data.
     */
    updateModel: function(json) {
      var model = this.get(json.id);
      if (model) model.set(json, { silent: true });
    }


  });


});
