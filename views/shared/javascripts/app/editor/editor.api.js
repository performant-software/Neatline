
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
   * Flash a success notification.
   *
   * @param {String} message: The message.
   */
  var notifySuccess = function(message) {
    Editor.__view.notifySuccess(message);
  };

  Neatline.commands.addHandler('editor:notifySuccess', notifySuccess);


  /**
   * Flash an error notification.
   *
   * @param {String} message: The message.
   */
  var notifyError = function(message) {
    Editor.__view.notifyError(message);
  };

  Neatline.commands.addHandler('editor:notifyError', notifyError);


  /**
   * Update the route hash.
   *
   * @param {String} message: The new route.
   */
  var updateRoute = function(route) {
    Editor.__router.navigate(route, { replace: true });
  };

  Neatline.commands.addHandler('editor:updateRoute', updateRoute);


  /**
   * Open a record edit form if one is not already open.
   *
   * @param {Object} model: The record model.
   */
  var showRecordForm = function(model) {
    if (!Neatline.request('editor:record:isOpen?')) {
      Editor.__router.navigate('records/'+model.get('id'), true);
    }
  };

  Neatline.commands.addHandler('editor:showRecordForm', showRecordForm);
  Neatline.vent.on('map:select', showRecordForm);


  /**
   * Navigate to the record list.
   */
  var showRecordList = function() {
    Editor.__router.navigate('records', true);
  };

  Neatline.commands.addHandler('editor:showRecordList', showRecordList);


}});
