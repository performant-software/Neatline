
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor public request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  /**
   * Return the editor container div.
   *
   * @return {Object}: The container.
   */
  var getContainer = function() {
    return Editor.__view.__ui.editor
  };
  Neatline.reqres.addHandler('editor:getContainer', getContainer);


}});
