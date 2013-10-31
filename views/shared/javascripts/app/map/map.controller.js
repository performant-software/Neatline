
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(Map) {


  Map.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP',

    events: [
      'highlight',
      'unhighlight',
      'select',
      'unselect',
      'setFilter',
      'removeFilter',
      'refresh'
    ],

    commands: [
      'load',
      'updateSize'
    ],

    requests: [
      'getMap',
      'getRecords',
      'getVectorLayer',
      'getCenter',
      'getZoom'
    ],


    /**
     * Create collection and view.
     */
    init: function() {
      this.collection = new Neatline.Shared.Record.Collection();
      this.view = new Neatline.Map.View({ slug: this.slug });
    },


    /**
     * Highlight by model.
     *
     * @param {Object} args: Event arguments.
     */
    highlight: function(args) {
      this.view.highlightByModel(args.model);
    },


    /**
     * Unhighlight by model.
     *
     * @param {Object} args: Event arguments.
     */
    unhighlight: function(args) {
      this.view.unhighlightByModel(args.model);
    },


    /**
     * Unhighlight the layer that corresponds to the passed model and then
     * focus on its extent (unless the event was triggered by the map).
     *
     * @param {Object} args: Event arguments.
     */
    select: function(args) {
      if (args.source !== this.slug) {
        this.view.focusByModel(args.model);
        this.view.selectByModel(args.model);
      }
    },


    /**
     * Unselect by model.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      this.view.unselectByModel(args.model);
    },


    /**
     * Set a layer filter.
     *
     * @param {Object} args: Event arguments.
     */
    setFilter: function(args) {
      this.view.setFilter(args.key, args.evaluator);
    },


    /**
     * Remove a layer filter.
     *
     * @param {Object} args: Event arguments.
     */
    removeFilter: function(args) {
      this.view.removeFilter(args.key);
    },


    /**
     * Reload map data for current focus/zoom.
     */
    refresh: function() {
      this.view.removeAllLayers();
      this.view.requestRecords();
    },


    /**
     * Load map layers.
     *
     * @param {Object} params: Hash with `extent` and `zoom`.
     */
    load: function(params) {
      this.collection.update(params, _.bind(function(records) {
        this.view.ingest(records);
      }, this));
    },


    /**
     * Refresh the map after it is resized.
     */
    updateSize: function() {
      this.view.map.updateSize();
    },


    /**
     * Emit the OpenLayers map instance.
     *
     * @return {Object}: The map.
     */
    getMap: function() {
      return this.view.map;
    },


    /**
     * Emit the current records collection.
     *
     * @return {Object}: The collection.
     */
    getRecords: function() {
      return this.collection;
    },


    /**
     * Get or create a vector layer for a model.
     *
     * @param {Object} model: A record model.
     * @return {Object}: The record model.
     */
    getVectorLayer: function(model) {
      return this.view.getOrCreateVectorLayer(model);
    },


    /**
     * Emit the current viewport focus coordinates.
     *
     * @return {Object}: OpenLayers.LonLat.
     */
    getCenter: function() {
      return this.view.map.getCenter();
    },


    /**
     * Emit the current zoom level.
     *
     * @return {Number}: The zoom level.
     */
    getZoom: function() {
      return this.view.map.getZoom();
    }


  });


});
