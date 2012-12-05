
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Text" tab events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.TextTab', function(
  TextTab, Form, Backbone, Marionette, $, _) {


  /**
   * Render element values when the form is opened.
   *
   * @param {Object|DOMElement} form: The form element.
   * @return void.
   */
  Neatline.vent.on('editor:form:initialize', function(form) {
    TextTab.view.getElements(form);
  });


  /**
   * Render element values when the form is opened.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('editor:form:open', function(model) {
    TextTab.view.render(model);
  });


  /**
   * Before the form is saved, broadcast the tab's data hash to be added
   * to the  aggregated hash on the form view.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:getData', function() {
    Neatline.vent.trigger('editor:form:addData',
      TextTab.view.gather()
    );
  });


});
