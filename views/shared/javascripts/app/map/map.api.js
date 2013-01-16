
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Update map layers.
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   */
  var update = function(params) {
    Map.__collection.update(params, function(records) {
      Neatline.vent.trigger('map:update', records);
      Map.__view.ingest(records);
    });
  };

  Neatline.commands.addHandler('map:update', update);
  Neatline.vent.on('map:move', update);


  /**
   * Reload map data for current focus/zoom.
   */
  var refresh = function() {
    Map.__view.publishPosition();
  };

  Neatline.commands.addHandler('map:refresh', refresh);


  /**
   * Focus the map on the data extent for a record, identified by id.
   *
   * @param {Number} id: The record id.
   */
  var focusById = function(id) {
    Map.__collection.getOrFetch(id, function(model) {
      Map.__view.focusByModel(model);
    });
  };

  Neatline.commands.addHandler('map:focusById', focusById);


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: The record model.
   */
  var focusByModel = function(model) {
    Map.__view.focusByModel(model);
  };

  Neatline.commands.addHandler('map:focusByModel', focusByModel);


});
