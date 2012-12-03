
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
   * @return void.
   */
  Neatline.vent.on('editor:records:openForm', function(model) {
    Form.view.show(model, true);
  });


  /**
   * Show the form when a map geometry is clicked.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('map:select', function(model) {
    Form.view.show(model, false);
  });


  /**
   * Updated the "Spatial Data" field on the form when the record's map
   * geometries are changed.
   *
   * @param {String} coverage: The new KML.
   * @return void.
   */
  Neatline.vent.on('editor:geometry:newCoverage', function(coverage) {
    Form.view.setCoverage(coverage);
  });


});
