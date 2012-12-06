
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Editor, Backbone, Marionette, $, _) {


  /**
   * Re-render the current record collection when the form is closed.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:close', function() {

    // Render map records if mirroring is enabled.
    if (Neatline.reqres.request('editor:search:mapMirror?')) {
      Records.view.show(Neatline.Modules.Map.collection);
    }

    // Otherwise, render local collection.
    else Records.view.show(Records.collection);

  });


  /**
   * Execute search query.
   *
   * @params {Object} query: The query object.
   * @return void.
   */
  Neatline.vent.on('editor:search:query', function(query) {
    Records.collection.updateCollection(query, function(records) {
      Records.view.show(records);
    });
  });


  /**
   * Render current map collection in editor.
   *
   * @return void.
   */
  Neatline.vent.on('editor:search:mapMirror', function() {
    Records.view.show(Neatline.Map.collection);
  });


  /**
   * Render new map record collections in the editor.
   *
   * @param {Object} collection: The new map records.
   * @return void.
   */
  Neatline.vent.on('map:newRecords', function(collection) {

    // Check if map mirroring is active and if there is a form.
    var mapMirror = Neatline.reqres.request('editor:search:mapMirror?');
    var formOpen = Neatline.reqres.request('editor:form:isOpen?');

    // Block if mapMirror is disabled or a form is open.
    if (mapMirror && !formOpen) Records.view.show(collection);

  });


  /**
   * When a record is deleted, purge it from the collection.
   *
   * @param {Object} model: The deleted record.
   * @return void.
   */
  Neatline.vent.on('editor:form:delete', function(model) {
    Records.collection.remove(model);
  });


});
