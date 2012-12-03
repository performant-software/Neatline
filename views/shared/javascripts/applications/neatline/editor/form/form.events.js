
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


  /*
   * ----------------------------------------------------------------------
   * Show form on record row click.
   * ----------------------------------------------------------------------
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('editor:records:openForm', function(model) {
    Form.view.show(model, true);
  });

  /*
   * ----------------------------------------------------------------------
   * Show form on map feature click.
   * ----------------------------------------------------------------------
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('map:select', function(model) {
    Form.view.show(model, false);
  });

  /*
   * ----------------------------------------------------------------------
   * Push updated KML back into the form.
   * ----------------------------------------------------------------------
   *
   * @param {String} coverage: The new KML.
   * @return void.
   */
  Neatline.vent.on('editor:geometry:newCoverage', function(coverage) {
    Form.view.setCoverage(coverage);
  });


});
