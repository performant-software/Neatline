
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
    Neatline.vent.trigger(
      'presenter:show:'+model.get('presenter'), model
    );
  };

  Neatline.commands.addHandler('presenter:show', show);
  Neatline.vent.on('map:highlight', show);


  /**
   * Hide the record.
   *
   * @param {Object} model: The record model.
   */
  var hide = function(model) {
    Neatline.vent.trigger(
      'presenter:hide:'+model.get('presenter')
    );
  };

  Neatline.commands.addHandler('presenter:hide', hide);
  Neatline.vent.on('map:unhighlight', hide);


  /**
   * Freeze the record.
   *
   * @param {Object} model: The record model.
   */
  var select = function(model) {
    Neatline.vent.trigger(
      'presenter:select:'+model.get('presenter')
    );
  };

  Neatline.commands.addHandler('presenter:select', select);
  Neatline.vent.on('map:select', select);


  /**
   * Unfreeze and hide the record.
   *
   * @param {Object} model: The record model.
   */
  var unselect = function(model) {
    Neatline.vent.trigger(
      'presenter:unselect:'+model.get('presenter')
    );
  };

  Neatline.commands.addHandler('presenter:unselect', unselect);
  Neatline.vent.on('map:unselect', unselect);


  /**
   * Activate the record.
   */
  var activate = function() {
    Neatline.vent.trigger('presenter:activate');
  };
  Neatline.commands.addHandler('presenter:activate', activate);


  /**
   * Deactivate and close the bubble.
   */
  var deactivate = function() {
    Neatline.vent.trigger('presenter:deactivate');
  };

  Neatline.commands.addHandler('presenter:deactivate', deactivate);


});
