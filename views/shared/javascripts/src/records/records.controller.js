
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Records', function(Records) {


  Records.Controller = Neatline.Shared.Controller.extend({


    slug: 'RECORDS',


    /**
     * Spin up the core records collection.
     */
    init: function() {

      _.bindAll(this, 'ready');

      // The canonical records collection for the exhibit.
      this.records = new Neatline.Shared.Record.Collection();

      // If spatial querying is disabled, then we need to load the entire
      // collection of records at once.
      if (!Neatline.g.neatline.exhibit.spatial_querying) {
        this.records.update({}, this.ready);
      }

      else this.ready();

    },


    /**
     * Notify other modules that the records are ready to be queried.
     */
    ready: function() {
      Neatline.vent.trigger(this.slug+':ready');
    }


  });


});
