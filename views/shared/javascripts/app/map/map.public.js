
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
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
  Neatline.commands.setHandler(Map.ID+':load', load);


  /**
   * Reload map data for current focus/zoom.
   */
  var refresh = function() {
    Map.__view.removeAllLayers();
    Map.__view.publishPosition();
  };
  Neatline.commands.setHandler(Map.ID+':refresh', refresh);
  Neatline.vent.on('refresh', refresh);


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: A record model.
   */
  var focusByModel = function(model) {
    Map.__view.focusByModel(model);
  };
  Neatline.commands.setHandler(Map.ID+':focusByModel', focusByModel);


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
  Neatline.commands.setHandler(Map.ID+':focusById', focusById);


  /**
   * Focus by model, unless the event was triggered by the map.
   *
   * @param {Object} args: Event arguments.
   */
  var select = function(args) {
    if (args.source !== 'MAP') focusByModel(args.model);
  };
  Neatline.commands.setHandler(Map.ID+':select', select);
  Neatline.vent.on('select', select);


  /**
   * Set a layer filter.
   *
   * @param {Object} args: Event arguments.
   */
  var setFilter = function(args) {
    Map.__view.setFilter(args.key, args.evaluator);
  };
  Neatline.commands.setHandler(Map.ID+':setFilter', setFilter);
  Neatline.vent.on('setFilter', setFilter);


  /**
   * Remove a layer filter.
   *
   * @param {Object} args: Event arguments.
   */
  var removeFilter = function(args) {
    Map.__view.removeFilter(args.key);
  };
  Neatline.commands.setHandler(Map.ID+':removeFilter', removeFilter);
  Neatline.vent.on('removeFilter', removeFilter);


  /**
   * Emit the OpenLayers map instance.
   *
   * @return {Object}: The map.
   */
  var getMap = function() {
    return Map.__view.map;
  };
  Neatline.reqres.setHandler(Map.ID+':getMap', getMap);


  /**
   * Emit the current records collection.
   *
   * @return {Object}: The collection.
   */
  var getRecords = function() {
    return Map.__collection;
  };
  Neatline.reqres.setHandler(Map.ID+':getRecords', getRecords);


  /**
   * Emit the current viewport focus coordinates.
   *
   * @return {Object}: OpenLayers.LonLat.
   */
  var getCenter = function() {
    return Map.__view.map.getCenter();
  };
  Neatline.reqres.setHandler(Map.ID+':getCenter', getCenter);


  /**
   * Emit the current zoom level.
   *
   * @return {Number}: The zoom level.
   */
  var getZoom = function() {
    return Map.__view.map.getZoom();
  };
  Neatline.reqres.setHandler(Map.ID+':getZoom', getZoom);


});
