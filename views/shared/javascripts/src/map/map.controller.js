
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
      'updateSize',
      'showHighlight',
      'hideHighlight'
    ],

    requests: [
      'getMap',
      'getRecords',
      'getVectorLayer',
      'getVectorLayers',
      'getWmsLayers',
      'getCenter',
      'getZoom',
      'getMinZoom',
      'getExtent'
    ],


    /**
     * Create collection and view.
     */
    init: function() {
      this.view = new Neatline.Map.View({ slug: this.slug });
    },


    /**
     * Highlight by model.
     *
     * @param {Object} args: Event arguments.
     */
    highlight: function(args) {
      this.view.highlight(args.model);
    },


    /**
     * Unhighlight by model.
     *
     * @param {Object} args: Event arguments.
     */
    unhighlight: function(args) {
      this.view.unhighlight(args.model);
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
        this.view.select(args.model);
      }
    },


    /**
     * Unselect by model.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      this.view.unselect(args.model);
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
      this.view.publishPosition();
    },


    /**
     * Load map layers
     *
     * @param {Object} params: Hash with `extent`, `zoom`, and `tags`.
     */
    load: function(params) {
      this.view.loadRecords(params);
    },

    /**
     * Refresh the map after it is resized.
     */
    updateSize: function() {
      this.view.map.updateSize();
    },


    /**
     * Apply the `temporary` render intent on a model's features.
     */
    showHighlight: function(model) {
      this.view.renderVectorHighlightIntent(model);
    },


    /**
     * Apply the `default` render intent on a model's features.
     */
    hideHighlight: function(model) {
      this.view.renderVectorDefaultIntent(model);
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
      return this.view.records;
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
     * Get all vector layers on the map.
     *
     * @return {Array}: The vector layers.
     */
    getVectorLayers: function() {
      return this.view.getVectorLayers();
    },


    /**
     * Get all WMS layers on the map.
     *
     * @return {Array}: The vector layers.
     */
    getWmsLayers: function() {
      return this.view.getWmsLayers();
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
    },


    /**
     * Emit the minimum zoom level.
     *
     * @return {Number}: The minimum zoom level.
     */
    getMinZoom: function() {
      var base = this.view.map.baseLayer;
      if (base) {
        if (base.minZoomLevel) return base.minZoomLevel;
        if (base.zoomOffset) return base.zoomOffset;
        if (this.view.otherZoomOffset) return this.view.otherZoomOffset;
      }
      return 0;
    },


    /**
     * Emit the current map extent.
     *
     * @return {String}: The extent of the map in string format.
     */
    getExtent: function() {
      return this.view.map.getExtent().toString();
    }

  });


});
