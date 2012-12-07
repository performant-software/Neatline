
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
   * @return void.
   */
  Neatline.vent.on('map:highlight', function(model) {
    Bubble.view.show(model);
  });


  /**
   * Hide bubble on feature mouseleave.
   *
   * @return void.
   */
  Neatline.vent.on('map:unhighlight', function() {
    Bubble.view.hide();
  });


  /**
   * Hide bubble when the mouse leaves the map.
   *
   * @return void.
   */
  Neatline.vent.on('map:mouseout', function() {
    Bubble.view.hide();
  });


  /**
   * Lock bubble on feature click on.
   *
   * @return void.
   */
  Neatline.vent.on('map:select', function() {
    Bubble.view.freeze();
  });


  /**
   * Lock bubble on feature click off.
   *
   * @return void.
   */
  Neatline.vent.on('map:unselect', function() {
    Bubble.view.thaw();
  });


  /**
   * Close the bubble when an edit form is closed.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:close', function() {
    Bubble.view.thaw();
  });


  /**
   * Close and deactivate the bubble when the "Spatial" tab is active.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:spatialSelect', function() {
    Bubble.view.thaw();
    Bubble.view.deactivate();
  });


  /**
   * Reactivate the bubble when the "Spatial" tab is inactive.
   *
   * @return void.
   */
  Neatline.vent.on('editor:form:spatialDeselect', function(model) {
    Bubble.view.activate();
  });


});
