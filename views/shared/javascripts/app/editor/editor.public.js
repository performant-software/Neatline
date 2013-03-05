
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


  /**
   * Display a list of views inthe editor container.
   *
   * @param {Array} views: A list of views.
   */
  var display = function(views) {

    // Clear the editor container.
    Editor.__view.__ui.editor.children().detach();

    // Show each of the views.
    _.each(views, function(v) {
      Neatline.execute(v+':display', Editor.__view.__ui.editor);
    });

  };
  Neatline.commands.addHandler('EDITOR:display', display);


  /**
   * Flash a success notification.
   *
   * @param {String} message: The message.
   */
  var notifySuccess = function(message) {
    Editor.__view.notifySuccess(message);
  };
  Neatline.commands.addHandler('EDITOR:notifySuccess', notifySuccess);


  /**
   * Flash an error notification.
   *
   * @param {String} message: The message.
   */
  var notifyError = function(message) {
    Editor.__view.notifyError(message);
  };
  Neatline.commands.addHandler('EDITOR:notifyError', notifyError);


  /**
   * Update the route hash without adding to the history.
   *
   * @param {String} route: The new route.
   */
  var setRoute = function(route) {
    Backbone.history.navigate(route, { replace: true });
  };
  Neatline.commands.addHandler('EDITOR:setRoute', setRoute);


  /**
   * Return the editor container div.
   *
   * @return {Object}: The container.
   */
  var getContainer = function() {
    return Editor.__view.__ui.editor
  };
  Neatline.reqres.addHandler('EDITOR:getContainer', getContainer);


}});
