
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter', function(
  Presenter, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show the record.
   *
   * @param {Object} model: The record model.
   */
  var show = function(model) {
    // TODO
  };

  Neatline.commands.addHandler('presenter:show', show);
  Neatline.vent.on('map:highlight', show);


  /**
   * Hide the record.
   */
  var hide = function() {
    // TODO
  };

  Neatline.commands.addHandler('presenter:hide', hide);
  Neatline.vent.on('map:unhighlight', hide);


  /**
   * Freeze the record.
   */
  var select = function() {
    // TODO
  };

  Neatline.commands.addHandler('presenter:select', select);
  Neatline.vent.on('map:select', select);


  /**
   * Unfreeze and hide the record.
   */
  var unselect = function() {
    // TODO
  };

  Neatline.commands.addHandler('presenter:unselect', unselect);
  Neatline.vent.on('map:unselect', unselect);


  /**
   * Activate the record.
   */
  var activate = function() {
    // TODO
  };
  Neatline.commands.addHandler('presenter:activate', activate);


  /**
   * Deactivate and close the bubble.
   */
  var deactivate = function() {
    // TODO
  };

  Neatline.commands.addHandler('presenter:deactivate', deactivate);


});
