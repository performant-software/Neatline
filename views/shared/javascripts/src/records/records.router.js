
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Records', function(Records) {


  Records.Router = Neatline.Shared.Router.extend({


    routes: {
      'record/:id': 'record/:id'
    },


    /**
     * Create a shell collection to fetch records.
     */
    initialize: function() {
      this.records = new Neatline.Shared.Record.Collection();
    },


    /**
     * Select a record.
     *
     * @param {String} id: The record id.
     */
    'record/:id': function(id) {

      // Load the model.
      this.records.getOrFetch(id, function(model) {

        // Select the requested record.
        Neatline.vent.trigger('select', {
          model:  model,
          source: 'RECORDS'
        });

      });

    }


  });


});
