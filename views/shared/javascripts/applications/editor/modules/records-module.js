
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Records controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Records = (function(Backbone, Editor, Neatline) {

  var Records = {};


  /*
   * Instantiate the records collection and view.
   *
   * @return void.
   */
  Records.init = function() {
    this.view = new Editor.Views.Records({ el: '#content' });
    this.collection = new Neatline.Collections.Records();
    this.fetch();
  };

  /*
   * Query for records.
   *
   * @param {Object} params: Query parameters.
   *
   * @return void.
   */
  Records.fetch = function(params) {

    params = params || {};
    params.id = __exhibit.id;

    // Get records.
    this.collection.fetch({
      data: $.param(params),
      success: _.bind(function(collection) {
        this.view.show(collection);
      }, this)
    });

  };


  // -------
  // Events.
  // -------

  /*
   * Show form.
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
   * Render current map collection in editor.
   *
   * @params {Object} query: The query object.
   *
   * @return void.
   */
  Editor.vent.on('search:query', function(query) {
    Records.fetch(query);
  });

  /*
   * Render current map collection in editor.
   *
   * @return void.
   */
  Editor.vent.on('search:mapMirror', function() {
    Records.view.show(Neatline.Modules.Map.collection);
  });

  /*
   * Render new map record collections in the editor.
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


  // Export.
  Editor.addInitializer(function() { Records.init(); });
  return Records;

})(Backbone, Editor, Neatline);
