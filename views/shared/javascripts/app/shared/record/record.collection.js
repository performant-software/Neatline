
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
     * Construct the record API endpoint.
     *
     * @return {String}: The url.
     */
    url: function() {
      return Neatline.g.neatline.records_api;
    },


    /**
     * Set the envelope metadata, return records array.
     *
     * @return {Array}: The records collection.
     */
    parse: function(response) {

      this.metadata = {

        // Paging offset.
        start: Number(response.start),

        // Record count.
        numFound: Number(response.numFound),

        // Removed records.
        removed: response.removed

      };

      // Prune removed records.
      _.each(response.removed, _.bind(function(id) {
        this.remove(id);
      }, this));

      // Return the records.
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
      params.exhibit_id = Neatline.g.neatline.exhibit.id;

      // Form the default query parameters.
      var options = { data: $.param(params), success: cb };

      // If we're telling the server not to re-transmit existing records (eg,
      // the update is feeding the map), then we do NOT want to automatically
      // remove all records that aren't present in the result - just the ones
      // that the server explicitly flags as removed.

      if (_.isArray(params.existing)) options.remove = false;

      this.fetch(options);

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
     * @param {Function} cb: Called with the model.
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
