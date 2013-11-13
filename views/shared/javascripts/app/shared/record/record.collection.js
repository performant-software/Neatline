
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Record', function(Record) {


  Record.Collection = Backbone.Collection.extend({


    model: Neatline.Shared.Record.Model,


    /**
     * Set default metadata attributes.
     */
    initialize: function() {
      this.metadata = { start: 0, numFound: 0, removed: [] };
    },


    /**
     * Construct the record API endpoint.
     *
     * @return {String}: The url.
     */
    url: function() {
      return Neatline.g.neatline.records_api;
    },


    /**
     * TODO|dev
     * Set the envelope metadata, return records array.
     *
     * @return {Array}: The records collection.
     */
    parse: function(response) {

      // Paging offset.
      if (_.has(response, 'start')) {
        this.metadata.start = Number(response.start);
      }

      // Record count.
      if (_.has(response, 'numFound')) {
        this.metadata.numFound = Number(response.numFound);
      }

      // Removed records.
      if (_.has(response, 'removed')) {
        this.metadata.removed = _.isArray(response.removed) ?
          response.removed : [response.removed];
      }

      // Store the records.
      return response.records;

    },


    /**
     * Fetch a subset of the collection from the server.
     *
     * @param {Object} params: Query parameters.
     * @param {Function} cb: Called when `fetch` completes.
     */
    update: function(params, cb) {

      // Merge the exhibit id.
      params = _.extend(params, {
        exhibit_id: Neatline.g.neatline.exhibit.id
      });

      // Query for records, pass result to callback.
      this.fetch({ reset: true, data: $.param(params), success: cb });

    },


    /**
     * Get a model by id.
     *
     * - If the model is already present in the collection, pass it to the
     *   callback immediately.
     *
     * - If the model is absent, create a new model with the passed id, fetch
     *   data from the server, and pass the populated model to the callback.
     *
     * @param {Number} id: The model id.
     * @param {Function} cb: Callback, called with the model.
     */
    getOrFetch: function(id, cb) {

      // Get existing model.
      var model = this.get(id);
      if (model) cb(model);

      else {

        // Or, fetch the model.
        model = new this.model({ id: id });
        model.fetch({ success: function() { cb(model); }});

      }

    }


  });


});
