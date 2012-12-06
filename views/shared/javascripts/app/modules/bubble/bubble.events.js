
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
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('map:unhighlight', function(model) {
    Bubble.view.hide(model);
  });


  /**
   * Lock bubble on feature click on.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('map:select', function(model) {
    Bubble.view.lock(model);
  });


  /**
   * Lock bubble on feature click off.
   *
   * @param {Object} model: The record model.
   * @return void.
   */
  Neatline.vent.on('map:unselect', function(model) {
    Bubble.view.hide(model);
  });


});
