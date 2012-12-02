
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Form presenter.
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
   * Instantiate the form view.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Form.addInitializer(function() {
    this.view = new Neatline.Editor.Form.Views.Form({ el: '#content' });
  });

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

  /*
   * ----------------------------------------------------------------------
   * Is a form currently open?
   * ----------------------------------------------------------------------
   *
   * @return {Boolean}: True if a form is open.
   */
  Neatline.reqres.addHandler('editor:form:isOpen?', function() {
    return Form.view.open;
  });


});
