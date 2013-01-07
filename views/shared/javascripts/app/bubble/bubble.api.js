
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


  // ======================================================================

  /**
   * Show the bubble.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    Bubble.__view.show(model);
  };

  Neatline.vent.on('map:highlight', show);


  // ======================================================================

  /**
   * Hide the bubble.
   */
  var hide = function() {
    Bubble.__view.hide();
  };

  Neatline.commands.addHandler('bubble:hide', hide);
  Neatline.vent.on('map:unhighlight', hide);


  // ======================================================================

  /**
   * Freeze the bubble.
   */
  var select = function() {
    Bubble.__view.select();
  };

  Neatline.commands.addHandler('bubble:select', select);
  Neatline.vent.on('map:select', select);


  // ======================================================================

  /**
   * Unfreeze and hide the bubble.
   */
  var unselect = function() {
    Bubble.__view.unselect();
  };

  Neatline.commands.addHandler('bubble:unselect', unselect);
  Neatline.vent.on('map:unselect', unselect);


  // ======================================================================

  /**
   * Activate the bubble.
   */
  var activate = function() {
    Bubble.__view.activate();
  };

  Neatline.commands.addHandler('bubble:activate', activate);


  // ======================================================================

  /**
   * Deactivate and close the bubble.
   */
  var deactivate = function() {
    Bubble.__view.deactivate();
    Bubble.__view.unselect();
  };

  Neatline.commands.addHandler('bubble:deactivate', deactivate);


  // ======================================================================


});
