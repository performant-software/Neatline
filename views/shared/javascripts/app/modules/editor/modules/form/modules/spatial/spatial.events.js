
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Text" tab events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.SpatialTab', function(
  SpatialTab, Form, Backbone, Marionette, $, _) {


  /**
   * Render element values when the form is opened.
   *
   * @param {Object|DOMElement} form: The form element.
   * @return void.
   */
  Neatline.vent.on('editor:form:initialize', function(form) {
    SpatialTab.view.getElements(form);
  });


  /**
   * Render element values when the form is opened.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('editor:form:open', function(model) {
    SpatialTab.view.render(model);
  });


  /**
   * Before the form is saved, broadcast the tab's data hash to be added
   * to the  aggregated hash on the form view.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:getData', function() {
    Neatline.vent.trigger('editor:form:addData',
      SpatialTab.view.gather()
    );
  });


  /**
   * Updated the "Spatial Data" field when the record's map geometries are
   * changed.
   *
   * @param {String} coverage: The new KML.
   * @return void.
   */
  Neatline.vent.on('editor:geometry:newCoverage', function(coverage) {
    SpatialTab.view.setCoverage(coverage);
  });


});
