
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module(this.ID+'', function(
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
  Neatline.commands.setHandler(this.ID+':load', load);


  /**
   * Reload map data for current focus/zoom.
   */
  var refresh = function() {
    Map.__view.removeAllLayers();
    Map.__view.publishPosition();
  };
  Neatline.commands.setHandler(this.ID+':refresh', refresh);
  Neatline.vent.on('refresh', refresh);


  /**
   * Focus the map on the data extent for a record, identified by model.
   * Unless {Boolean} `true` is passed as a second parameter, a flag that
   * indicates that the event was triggered by a click on the map. When
   * this is the case, suppress the default focusing response, which can
   * be discombobulating when the record's default zoom is much higher or
   * lower than the current zoom level of the map.
   *
   * @param {Object} model: The record model.
   * @param {Boolean} mapClick: True if a map feature was clicked.
   */
  var focusByModel = function(model, mapClick) {
    if (mapClick !== true) Map.__view.focusByModel(model);
  };
  Neatline.commands.setHandler(this.ID+':focusByModel', focusByModel);
  Neatline.vent.on('select', focusByModel);


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
  Neatline.commands.setHandler(this.ID+':focusById', focusById);


  /**
   * Set a layer filter.
   *
   * @param {String} key: A key to identify the filter.
   * @param {Function} evaluator: The boolean filtering function.
   */
  var setFilter = function(key, evaluator) {
    Map.__view.setFilter(key, evaluator);
  };
  Neatline.commands.setHandler(this.ID+':setFilter', setFilter);
  Neatline.vent.on('setFilter', setFilter);


  /**
   * Remove a layer filter.
   *
   * @param {String} key: The key of the filter to remove.
   */
  var removeFilter = function(key) {
    Map.__view.removeFilter(key);
  };
  Neatline.commands.setHandler(this.ID+':removeFilter', removeFilter);
  Neatline.vent.on('removeFilter', removeFilter);


  /**
   * Unselect all features.
   */
  var unselect = function() {
    Map.__view.unselectAll();
  };
  Neatline.commands.setHandler(this.ID+':unselect', unselect);


  /**
   * Emit the OpenLayers map instance.
   *
   * @return {Object}: The map.
   */
  var getMap = function() {
    return Map.__view.map;
  };
  Neatline.reqres.setHandler(this.ID+':getMap', getMap);


  /**
   * Emit the current records collection.
   *
   * @return {Object}: The collection.
   */
  var getRecords = function() {
    return Map.__collection;
  };
  Neatline.reqres.setHandler(this.ID+':getRecords', getRecords);


  /**
   * Emit the current viewport focus coordinates.
   *
   * @return {Object}: OpenLayers.LonLat.
   */
  var getCenter = function() {
    return Map.__view.map.getCenter();
  };
  Neatline.reqres.setHandler(this.ID+':getCenter', getCenter);


  /**
   * Emit the current zoom level.
   *
   * @return {Number}: The zoom level.
   */
  var getZoom = function() {
    return Map.__view.map.getZoom();
  };
  Neatline.reqres.setHandler(this.ID+':getZoom', getZoom);


});
