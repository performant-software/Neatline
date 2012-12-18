
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form "Style" tab events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Record.Style', function(
  Style, Record, Backbone, Marionette, $, _) {


  /**
   * Render element values when the form is opened.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('editor:form:open', function(model) {
    Style.view.render(model);
  });


  /**
   * Before the form is saved, broadcast the tab's data hash to be added
   * to the aggregated hash on the form view.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:getData', function() {
    Neatline.vent.trigger('editor:form:addData',
      Style.view.gather()
    );
  });


});
