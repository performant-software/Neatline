
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(Records) {


  Records.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:EXHIBIT:RECORDS',

    commands: [
      'display',
      'load',
      'ingest',
      'navToList'
    ],

    requests: [
      'getModel'
    ],


    /**
     * Create the router, collection, and view.
     */
    init: function() {
      this.router = new Records.Router();
      this.view = new Records.View({ slug: this.slug });
    },


    /**
     * Append the list to the editor container.
     *
     * @param {Object} container: The container element.
     */
    display: function(container) {
      this.view.showIn(container);
    },


    /**
     * Query for new records.
     *
     * @param {Object} params: The query parameters.
     */
    load: function(params) {
      this.view.load(params);
    },


    /**
     * Render a records collection in the list.
     *
     * @param {Object} records: The collection of records.
     */
    ingest: function(records) {
      this.view.ingest(records);
    },


    /**
     * Navigate to the record list.
     */
    navToList: function() {
      this.router.navigate('browse', true);
    },


    /**
     * Get a record model from the collection.
     *
     * @param {Number} id: The record id.
     * @param {Function} cb: A callback, called with the model.
     */
    getModel: function(id, cb) {
      this.view.records.getOrFetch(id, cb);
    }


  });


});
