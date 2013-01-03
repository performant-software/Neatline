
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
   * When a map feature is clicked, open the corresponding edit form if
   * one is not already open.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('map:select', function(model) {
    if (!Backbone.history.fragment.match(/records\/\d+/)) {
      Editor.__router.navigate('records/'+model.get('id'), true);
    }
  });


  /**
   * When the "X" button on a record form is clicked, close the form and
   * display the records list.
   */
  Neatline.vent.on('editor:record:closeRecord', function() {
    Editor.__router.navigate('records', true);
  });


}});
