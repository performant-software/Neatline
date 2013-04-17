
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter', function(
  Presenter, Neatline, Backbone, Marionette, $, _) {


  /**
   * Highlight the record.
   *
   * @param {Object} model: The record model.
   */
  var highlight = function(model) {
    try {
      Neatline.execute(
        'PRESENTER:'+model.get('presenter')+':highlight', model
      );
    } catch (e) {}
  };
  Neatline.commands.setHandler('PRESENTER:highlight', highlight);
  Neatline.vent.on('highlight', highlight);


  /**
   * Unhighlight the record.
   *
   * @param {Object} model: The record model.
   */
  var unhighlight = function(model) {
    try {
      Neatline.execute(
        'PRESENTER:'+model.get('presenter')+':unhighlight', model
      );
    } catch(e) {}
  };
  Neatline.commands.setHandler('PRESENTER:unhighlight', unhighlight);
  Neatline.vent.on('unhighlight', unhighlight);


  /**
   * Freeze the record.
   *
   * @param {Object} model: The record model.
   */
  var select = function(model) {
    try {
      Neatline.execute(
        'PRESENTER:'+model.get('presenter')+':select', model
      );
    } catch (e) {}
  };
  Neatline.commands.setHandler('PRESENTER:select', select);
  Neatline.vent.on('select', select);


  /**
   * Unfreeze and hide the record.
   *
   * @param {Object} model: The record model.
   */
  var unselect = function(model) {
    try {
      Neatline.execute(
        'PRESENTER:'+model.get('presenter')+':unselect', model
      );
    } catch (e) {}
  };
  Neatline.commands.setHandler('PRESENTER:unselect', unselect);
  Neatline.vent.on('unselect', unselect);


});
