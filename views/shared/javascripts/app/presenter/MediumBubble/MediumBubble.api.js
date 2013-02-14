
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Small bubble events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.MediumBubble', function(
  MediumBubble, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show the bubble.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    MediumBubble.__view.show(model);
  };

  Neatline.commands.addHandler(
    'presenter:MediumBubble:show', show
  );


  /**
   * Hide the bubble.
   */
  var hide = function() {
    MediumBubble.__view.hide();
  };

  Neatline.commands.addHandler(
    'presenter:MediumBubble:hide', hide
  );


  /**
   * Freeze the bubble.
   */
  var select = function() {
    MediumBubble.__view.select();
  };

  Neatline.commands.addHandler(
    'presenter:MediumBubble:select', select
  );


  /**
   * Unfreeze and hide the bubble.
   */
  var unselect = function() {
    MediumBubble.__view.unselect();
  };

  Neatline.commands.addHandler(
    'presenter:MediumBubble:unselect', unselect
  );


  /**
   * Activate the bubble.
   */
  var activate = function() {
    MediumBubble.__view.activate();
  };

  Neatline.vent.on(
    'presenter:activate', activate
  );


  /**
   * Deactivate and close the bubble.
   */
  var deactivate = function() {
    MediumBubble.__view.deactivate();
    MediumBubble.__view.unselect();
  };

  Neatline.vent.on(
    'presenter:deactivate', deactivate
  );


});
