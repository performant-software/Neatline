
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.StaticBubble', function(
  StaticBubble, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show the bubble.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    StaticBubble.__view.show(model);
  };
  Neatline.commands.setHandler(
    'PRESENTER:StaticBubble:show', show
  );


  /**
   * Hide the bubble.
   */
  var hide = function() {
    StaticBubble.__view.hide();
  };
  Neatline.commands.setHandler(
    'PRESENTER:StaticBubble:hide', hide
  );


  /**
   * Select the bubble.
   *
   * @param {Object} model: The record model.
   */
  var select = function(model) {
    StaticBubble.__view.select(model);
  };
  Neatline.commands.setHandler(
    'PRESENTER:StaticBubble:select', select
  );


  /**
   * Unselect the bubble.
   */
  var unselect = function() {
    StaticBubble.__view.unselect();
  };
  Neatline.commands.setHandler(
    'PRESENTER:StaticBubble:unselect', unselect
  );


  /**
   * Activate the bubble.
   */
  var activate = function() {
    StaticBubble.__view.activate();
  };
  Neatline.vent.on(
    'PRESENTER:activate', activate
  );


  /**
   * Deactivate and close the bubble.
   */
  var deactivate = function() {
    StaticBubble.__view.deactivate();
    StaticBubble.__view.unselect();
  };
  Neatline.vent.on(
    'PRESENTER:deactivate', deactivate
  );


});
