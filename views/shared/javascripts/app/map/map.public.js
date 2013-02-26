
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Load map layers.
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   */
  var load = function(params) {
    Map.__collection.update(params, function(records) {
      Map.__view.ingest(records);
    });
  };
  Neatline.commands.addHandler('map:load', load);
  Neatline.vent.on('map:move', load);


  /**
   * Reload map data for current focus/zoom.
   */
  var refresh = function() {
    Map.__view.publishPosition();
  };
  Neatline.commands.addHandler('map:refresh', refresh);


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: The record model.
   */
  var focusByModel = function(model) {
    Map.__view.focusByModel(model);
  };
  Neatline.commands.addHandler('map:focusByModel', focusByModel);


  /**
   * Focus the map on the data extent for a record, identified by id.
   *
   * @param {Number} id: The record id.
   */
  var focusById = function(id) {
    Map.__collection.getOrFetch(id, function(model) {
      focusByModel(model);
    });
  };
  Neatline.commands.addHandler('map:focusById', focusById);


  /**
   * Unselect all features.
   */
  var unselect = function() {
    Map.__view.unselectAll();
  };
  Neatline.commands.addHandler('map:unselect', unselect);


});
