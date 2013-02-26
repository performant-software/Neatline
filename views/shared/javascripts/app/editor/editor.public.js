
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  Editor.NS = 'editor';


  /**
   * Flash a success notification.
   *
   * @param {String} message: The message.
   */
  var notifySuccess = function(message) {
    Editor.__view.notifySuccess(message);
  };
  Neatline.commands.addHandler(Editor.NS+':notifySuccess', notifySuccess);


  /**
   * Flash an error notification.
   *
   * @param {String} message: The message.
   */
  var notifyError = function(message) {
    Editor.__view.notifyError(message);
  };
  Neatline.commands.addHandler(Editor.NS+':notifyError', notifyError);


  /**
   * Return the editor container div.
   *
   * @return {Object}: The container.
   */
  var getContainer = function() {
    return Editor.__view.__ui.editor
  };
  Neatline.reqres.addHandler(Editor.NS+':getContainer', getContainer);


}});
