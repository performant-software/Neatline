
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  Map.addInitializer(function() {


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
      Map.__view.requestRecords();
    };
    Neatline.commands.setHandler(Map.ID+':refresh', refresh);
    Neatline.vent.on('refresh', refresh);


    /**
     * Unhighlight the layer that corresponds to the passed model and then
     * focus on its extent (unless the event was triggered by the map).
     *
     * @param {Object} args: Event arguments.
     */
    var select = function(args) {
      if (args.source !== Map.ID) {
        focusByModel(args.model);
        Map.__view.selectByModel(args.model);
      }
    };
    Neatline.commands.setHandler(Map.ID+':select', select);
    Neatline.vent.on('select', select);


    /**
     * Highlight by model.
     *
     * @param {Object} args: Event arguments.
     */
    var highlight = function(args) {
      Map.__view.highlightByModel(args.model);
    };
    Neatline.commands.setHandler(Map.ID+':highlight', highlight);
    Neatline.vent.on('highlight', highlight);


    /**
     * Unhighlight by model.
     *
     * @param {Object} args: Event arguments.
     */
    var unhighlight = function(args) {
      Map.__view.unhighlightByModel(args.model);
    };
    Neatline.commands.setHandler(Map.ID+':unhighlight', unhighlight);
    Neatline.vent.on('unhighlight', unhighlight);


    /**
     * Unselect by model.
     *
     * @param {Object} args: Event arguments.
     */
    var unselect = function(args) {
      Map.__view.unselectByModel(args.model);
    };
    Neatline.commands.setHandler(Map.ID+':unselect', unselect);
    Neatline.vent.on('unselect', unselect);


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
     * Refresh the map after it is resized.
     */
    var updateSize = function() {
      Map.__view.map.updateSize();
    };
    Neatline.commands.setHandler(Map.ID+':updateSize', updateSize);


    /**
     * Get or create a vector layer for a model.
     *
     * @param {Object} model: A record model.
     * @return {Object}: The record model.
     */
    var getVectorLayer = function(model) {
      return Map.__view.getOrCreateVectorLayer(model);
    };
    Neatline.reqres.setHandler(Map.ID+':getVectorLayer', getVectorLayer);


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


});
