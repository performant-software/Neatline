
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.ID = 'EDITOR:EXHIBIT:RECORDS';


  Records.addInitializer(function() {


    Records.__router =      new Records.Router();
    Records.__collection =  new Neatline.Shared.Record.Collection();
    Records.__view =        new Records.View();


    /**
     * Append the list to the editor container.
     *
     * @param {Object} container: The container element.
     */
    var display = function(container) {
      Records.__view.showIn(container);
    };
    Neatline.commands.setHandler(Records.ID+':display', display);


    /**
     * Query for new records.
     *
     * @param {Object} params: The query parameters.
     */
    var load = function(params) {
      Records.__collection.update(params, function(records) {
        ingest(records);
      });
    };
    Neatline.commands.setHandler(Records.ID+':load', load);


    /**
     * Render a records collection in the list.
     *
     * @param {Object} records: The collection of records.
     */
    var ingest = function(records) {
      Records.__view.ingest(records);
    };
    Neatline.commands.setHandler(Records.ID+':ingest', ingest);


    /**
     * Navigate to the record list.
     */
    var navToList = function() {
      Records.__router.navigate('records', true);
    };
    Neatline.commands.setHandler(Records.ID+':navToList', navToList);


    /**
     * Get a record model from the collection.
     *
     * @param {Number} id: The record id.
     * @param {Function} cb: A callback, called with the model.
     */
    var getModel = function(id, cb) {
      Records.__collection.getOrFetch(id, cb);
    };
    Neatline.reqres.setHandler(Records.ID+':getModel', getModel);


  });


});
