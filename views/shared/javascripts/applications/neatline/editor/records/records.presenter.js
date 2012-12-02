
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records presenter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Editor, Backbone, Marionette, $, _) {


  /*
   * ----------------------------------------------------------------------
   * Instantiate the records collection and view.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Records.addInitializer(function() {
    this.view = new Neatline.Editor.Views.RecordList({ el: '#content' });
    this.collection = new Neatline.Map.Collections.Records();
    this.fetch();
  });

  /*
   * ----------------------------------------------------------------------
   * Re-render the current record collection when the form is closed.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Editor.vent.on('form:close', function() {

    // Render map records if mirroring is enabled.
    if (Editor.global.mapMirror) {
      Records.view.show(Neatline.Modules.Map.collection);
    }

    // Otherwise, render local collection.
    else Records.view.show(Records.collection);

  });

  /*
   * ----------------------------------------------------------------------
   * Render current map collection in editor.
   * ----------------------------------------------------------------------
   *
   * @params {Object} query: The query object.
   *
   * @return void.
   */
  Editor.vent.on('search:query', function(query) {
    this.collection.updateCollection(query);
  });

  /*
   * ----------------------------------------------------------------------
   * Render current map collection in editor.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Editor.vent.on('search:mapMirror', function() {
    Records.view.show(Neatline.Modules.Map.collection);
  });

  /*
   * ----------------------------------------------------------------------
   * Render new map record collections in the editor.
   * ----------------------------------------------------------------------
   *
   * @param {Object} collection: The new map records.
   *
   * @return void.
   */
  Neatline.vent.on('exhibit:newRecords', function(collection) {

    // Block if mapMirror is disabled or a form is open.
    if (Editor.global.mapMirror && !Editor.global.formOpen) {
      Records.view.show(collection);
    }

  });


});
