
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Form events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form', function(
  Form, Editor, Backbone, Marionette, $, _) {


  /**
   * Show the form when the listing for a record is clicked.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('editor:records:openForm', function(model) {
    Form.view.show(model, true);
  });


  /**
   * Show the form when a map geometry is clicked.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('map:select', function(model) {
    Form.view.show(model, false);
  });


  /**
   * Merge tab data onto the aggregate hash on the form view.
   *
   * @param {Object} data: The data hash.
   */
  Neatline.vent.on('editor:form:addData', function(data) {
    _.extend(Form.view.data, data);
  });


});
