/**
 * Editor controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Controllers.Editor = (function(Backbone, NeatlineEditor) {

  var Editor = {};


  /*
   * Create records collection, starting query.
   *
   * @return void.
   */
  Editor.init = function() {
    this.records = new NeatlineEditor.Collections.Records();
    this.fetch();
  };

  /*
   * Query for records.
   *
   * @param {Object} params: Query parameters.
   *
   * @return void.
   */
  Editor.fetch = function(params) {

    params = params || {};

    // Get records.
    this.records.fetch({
      data: $.param(params),
      success: function(collection) {
        NeatlineEditor.vent.trigger('exhibit:newRecords', collection);
      }
    });

  };


  // Export.
  NeatlineEditor.addInitializer(function() { Editor.init(); });
  return Editor;

})(Backbone, NeatlineEditor);
