
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Small bubble events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.SmallBubble', function(
  SmallBubble, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show the bubble.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    SmallBubble.__view.show(model);
  };

  Neatline.commands.addHandler(
    'presenter:SmallBubble:show', show
  );


  /**
   * Hide the bubble.
   */
  var hide = function() {
    SmallBubble.__view.hide();
  };

  Neatline.commands.addHandler(
    'presenter:SmallBubble:hide', hide
  );


  /**
   * Freeze the bubble.
   */
  var select = function() {
    SmallBubble.__view.select();
  };

  Neatline.commands.addHandler(
    'presenter:SmallBubble:select', select
  );


  /**
   * Unfreeze and hide the bubble.
   */
  var unselect = function() {
    SmallBubble.__view.unselect();
  };

  Neatline.commands.addHandler(
    'presenter:SmallBubble:unselect', select
  );


  /**
   * Activate the bubble.
   */
  var activate = function() {
    SmallBubble.__view.activate();
  };

  Neatline.commands.addHandler('presenter:activate', activate);


  /**
   * Deactivate and close the bubble.
   */
  var deactivate = function() {
    SmallBubble.__view.deactivate();
    SmallBubble.__view.unselect();
  };

  Neatline.commands.addHandler('presenter:deactivate', deactivate);


});
