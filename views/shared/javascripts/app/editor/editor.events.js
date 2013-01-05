
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  /**
   * Open a record edit form if one is not already open.
   *
   * @param {Object} model: The record model.
   */
  var showRecordForm = function(model) {
    if (!Backbone.history.fragment.match(/records\/\d+/)) {
      Editor.__router.navigate('records/'+model.get('id'), true);
    }
  };


  /**
   * Navigate to the record list.
   */
  var showRecordList = function() {
    Editor.__router.navigate('records', true);
  };


  Neatline.vent.on('editor:record:close', showRecordList);
  Neatline.vent.on('map:select', showRecordForm);


}});
