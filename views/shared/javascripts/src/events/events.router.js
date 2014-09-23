
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Events', function(Events) {


  Events.Router = Neatline.Shared.Router.extend({


    slug: 'EVENTS',

    routes: {
      'records/:id': 'records/:id'
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
    'records/:id': function(id) {

      // Load the model.
      this.records.getOrFetch(id, _.bind(function(model) {

        // Select the requested record.
        Neatline.vent.trigger('select', {
          model: model, source: this.slug
        });

      }, this));

    }


  });


});
