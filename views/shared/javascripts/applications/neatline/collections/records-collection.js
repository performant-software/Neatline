
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Records collection.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Collections.Records = Backbone.Collection.extend({

  url: (function() { return __exhibit.api; }),
  model: Neatline.Models.Record,

  /*
   * Query the collection by id. If the model is present, return it.
   * If not, create it and fetch data from the server. Call the cb()
   * with the populated model.
   *
   * @param {Number} id: The model id.
   * @param {Function} cb: Callback, called with the model.
   *
   * @unittest
   * @return void.
   */
  getModel: function(id, cb) {

    // Query for model.
    var model = this.get(id);
    if (model) cb(model);

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
