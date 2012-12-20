
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bubble events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Bubble', function(
  Bubble, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show bubble on feature mouseenter.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('map:highlight', function(model) {
    Bubble.__view.show(model);
  });


  /**
   * Hide bubble on feature mouseleave.
   */
  Neatline.vent.on('map:unhighlight', function() {
    Bubble.__view.hide();
  });


  /**
   * Lock bubble on feature click on.
   */
  Neatline.vent.on('map:select', function() {
    Bubble.__view.freeze();
  });


  /**
   * Lock bubble on feature click off.
   */
  Neatline.vent.on('map:unselect', function() {
    Bubble.__view.thaw();
  });


  /**
   * Close the bubble when an edit form is closed.
   */
  Neatline.vent.on('editor:form:close', function() {
    Bubble.__view.activate();
    Bubble.__view.thaw();
  });


  /**
   * Close and deactivate the bubble when the "Spatial" tab is active.
   */
  Neatline.vent.on('editor:form:spatialSelect', function() {
    Bubble.__view.thaw();
    Bubble.__view.deactivate();
  });


  /**
   * Reactivate the bubble when the "Spatial" tab is inactive.
   */
  Neatline.vent.on('editor:form:spatialDeselect', function(model) {
    Bubble.__view.activate();
  });


});
