
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
   * Show the bubble.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    Bubble.__view.show(model);
  };

  Neatline.commands.addHandler('bubble:show', show);
  Neatline.vent.on('map:highlight', show);


  /**
   * Hide the bubble.
   */
  var close = function() {
    Bubble.__view.hide();
  };

  Neatline.commands.addHandler('bubble:close', close);
  Neatline.vent.on('map:unhighlight', close);


  /**
   * Freeze the bubble.
   */
  var freeze = function() {
    Bubble.__view.freeze();
  };

  Neatline.commands.addHandler('bubble:freeze', freeze);
  Neatline.vent.on('map:select', freeze);


  /**
   * Thaw the bubble.
   */
  var thaw = function() {
    Bubble.__view.thaw();
  };

  Neatline.commands.addHandler('bubble:thaw', thaw);
  Neatline.vent.on('map:unselect', thaw);


  /**
   * Activate the bubble.
   */
  var activate = function() {
    Bubble.__view.activate();
    Bubble.__view.thaw();
  };

  Neatline.commands.addHandler('bubble:activate', activate);


  /**
   * Close and deactivate the bubble.
   */
  var deactivate = function() {
    Bubble.__view.deactivate();
    Bubble.__view.thaw();
  };

  Neatline.commands.addHandler('bubble:deactivate', deactivate);


});
