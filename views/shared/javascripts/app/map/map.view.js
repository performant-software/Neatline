
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map view. Creates and manages the core OpenLayers.Map instance.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  this.View = Backbone.View.extend({


    options: {
      defaultZoom: 6
    },


    /**
     * Initialize the map and publish initial request for data.
     */
    initialize: function() {

      this.layers = { vector: {}, wms: {} };
      this.filters = {};

      this.formatWKT = new OpenLayers.Format.WKT();
      this.isMoving = false;

      this.__initOpenLayers();
      this.__initBaseLayers();
      this.__initControls();
      this.__initViewport();
      this.__initEvents();

      this.publishPosition();

    },


    /**
     * Construct the OpenLayers Map instance, set the default base layer
     * and call component start-up routines that add cursor controls, set
     * the default focus/zoom, and listen for movement events.
     */
    __initOpenLayers: function() {

      // Widgets.
      var options = {
        controls: [
          new OpenLayers.Control.PanZoomBar(),
          new OpenLayers.Control.Navigation({ documentDrag: true })
        ],
        theme: null
      };

      // Instantiate map.
      this.map = new OpenLayers.Map(this.el, options);

    },


    /**
     * Construct the base layers and set the default.
     */
    __initBaseLayers: function() {

      this.baseLayers = {};

      // Get the array of base layer instances.
      _.each(Neatline.global.base_layers, _.bind(function(json) {
        var layer = Neatline.request('LAYERS:getLayer', json);
        if (_.isObject(layer)) this.baseLayers[json.id] = layer;
      }, this));

      // Add the base layers.
      this.map.addLayers(_.values(this.baseLayers));

      // Set the default layer.
      this.defaultLayer = this.baseLayers[Neatline.global.base_layer];
      this.map.setBaseLayer(this.defaultLayer);

      // Add switcher for more than 1 layer.
      if (_.values(this.baseLayers).length > 1) {
        this.map.addControl(new OpenLayers.Control.LayerSwitcher());
      }

    },


    /**
     * Construct, add, and activate hover and click controls to the map.
     * `hoverControl` handles highlighting, `clickControl` handles clicks.
     */
    __initControls: function() {

      // Build the hover control, bind callbacks.
      this.hoverControl = new OpenLayers.Control.SelectFeature(
        this.getVectorLayers(), {
          hover: true,
          highlightOnly: true,
          renderIntent: 'temporary',
          eventListeners: {
            featurehighlighted:   this.onFeatureHighlight,
            featureunhighlighted: this.onFeatureUnhighlight
          }
        }
      );

      // Build the click control, bind callbacks.
      this.clickControl = new OpenLayers.Control.SelectFeature(
        this.getVectorLayers(), {
          onSelect:   this.onFeatureSelect,
          onUnselect: this.onFeatureUnselect,
          toggle: true
        }
      );

      // Enable panning when cursor is over feature.
      this.hoverControl.handlers.feature.stopDown = false;
      this.clickControl.handlers.feature.stopDown = false;

      // Add to map, activate.
      this.map.addControls([this.hoverControl, this.clickControl]);
      this.activateControls();

    },


    /**
     * Set the starting focus and zoom.
     */
    __initViewport: function() {

      // Apply defaults if they exist.
      if (_.isString(Neatline.global.map_focus) &&
          _.isNumber(Neatline.global.map_zoom)) {
          this.setViewport(
            Neatline.global.map_focus,
            Neatline.global.map_zoom
          );
      }

      // Otherwise, geolocate.
      else {
        this.map.zoomTo(this.options.defaultZoom);
        this.geolocate();
      }

    },


    /**
     * Register listeners for `movestart` and `moveend`. When a move is
     * started, flip the `isMoving` tracker, which is used to prevent new
     * layers from being ingested _while_ the map is being moved, which
     * can cause visual artifacts. When a move completes, issue a request
     * for new layers that fall within the updated viewport extent.
     */
    __initEvents: function() {

      this.map.events.register('movestart', this.map, _.bind(function() {
        this.isMoving = true;
      }, this));

      this.map.events.register('moveend', this.map, _.bind(function() {
        this.isMoving = false;
        this.publishPosition();
      }, this));

    },


    /**
     * Activate the hover and click controls.
     */
    activateControls: function() {
      this.hoverControl.activate();
      this.clickControl.activate();
    },


    /**
     * Deactivate the hover and click controls.
     */
    deactivateControls: function() {
      this.hoverControl.deactivate();
      this.clickControl.deactivate();
    },


    /**
     * Update the layer collections operated on by the hover and click
     * controls. Called after new data arrives and the layer set has been
     * rebuild by the `ingest` flow.
     */
    updateControls: function() {
      var layers = this.getVectorLayers();
      this.hoverControl.setLayer(layers);
      this.clickControl.setLayer(layers);
    },


    /**
     * Unselect all selected features.
     */
    unselectAll: function() {
      this.hoverControl.unselectAll();
      this.clickControl.unselectAll();
    },


    /**
     * Publish the current focus and zoom of the map via `MAP:move`.
     */
    publishPosition: function() {
      Neatline.execute('MAP:load', {
        extent: this.getExtentAsWKT(),
        zoom:   this.getZoom()
      });
    },


    /**
     * Set the focus and zoom of the map.
     *
     * @param {String} focus: Comma-delimited lat/lon.
     * @param {Number} zoom: The zoom value.
     */
    setViewport: function(focus, zoom) {
      this.map.setCenter(focus.split(','), zoom);
    },


    /**
     * Focus the map on the user's location.
     */
    geolocate: function() {

      // Construct the control.
      var geolocate = new OpenLayers.Control.Geolocate({
        bind: true, watch: false
      });

      // Geolocate.
      this.map.addControl(geolocate);
      geolocate.activate();

    },


    /**
     * The top-level point of entry when a new record collection arrives.
     * Updates the map layers to mirror the new records collection.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      if (this.isMoving) return;

      // Build layers.
      this.ingestVectorLayers(records);
      this.ingestWmsLayers(records);

      // Publish collection, update controls.
      Neatline.vent.trigger('MAP:ingest', records);
      this.updateControls();

      // Store collection.
      this.records = records;

    },


    /**
     * Rebuild the vector layers to match the new collection.
     *
     * @param {Object} records: The records collection.
     */
    ingestVectorLayers: function(records) {

      var newIds = [];

      // Build new layers.
      records.each(_.bind(function(record) {

        newIds.push(record.id);

        // Create layer, if one doesn't exist.
        if (!_.has(this.layers.vector, record.id)) {
          this.buildVectorLayer(record);
        }

      }, this));

      // Garbage-collect stale layers.
      _.each(this.layers.vector, _.bind(function(layer, id) {

        // Delete if model is absent and layer is unfrozen.
        if (!_.contains(newIds, parseInt(id, 10)) && !layer.nFrozen) {
          this.removeVectorLayer(layer);
        }

      }, this));

    },


    /**
     * Rebuild the WMS layers to match the new collection.
     *
     * @param {Object} records: The records collection.
     */
    ingestWmsLayers: function(records) {

      var newIds = [];

      // Build new layers.
      records.each(_.bind(function(record) {

        // Does the layer have a defined address and layers?
        var wms = record.get('wms_address') && record.get('wms_layers');
        newIds.push(record.id);

        // Create layer, if one doesn't exist.
        if (!_.has(this.layers.wms, record.id) && wms) {
          this.buildWmsLayer(record);
        }

      }, this));

      // Garbage-collect stale layers.
      _.each(this.layers.wms, _.bind(function(layer, id) {

        // Delete if model is absent.
        if (!_.contains(newIds, parseInt(id, 10))) {
          this.removeWmsLayer(layer);
        }

      }, this));

    },


    /**
     * Construct a vector layer and geometries for a model.
     *
     * @param {Object} record: The record model.
     * @return {OpenLayers.Layer.Vector}: The layer.
     */
    buildVectorLayer: function(record) {

      // Build the layer.
      var layer = new OpenLayers.Layer.Vector(record.get('title'), {
        styleMap: this.getStyleMap(record),
        displayInLayerSwitcher: false
      });

      // Add features.
      if (record.get('coverage')) {
        layer.addFeatures(this.formatWKT.read(record.get('coverage')));
      }

      layer.nModel = record;
      layer.nFrozen = false;
      this.filterLayer(layer);

      // Track, add to map.
      this.layers.vector[record.id] = layer;
      this.map.addLayer(layer);

      return layer;

    },


    /**
     * Construct a WMS layer for a model.
     *
     * @param {Object} record: The record model.
     * @return {OpenLayers.Layer.WMS}: The layer.
     */
    buildWmsLayer: function(record) {

      // Build the layer.
      var layer = new OpenLayers.Layer.WMS(
        record.get('title'), record.get('wms_address'), {
          layers: record.get('wms_layers'),
          transparent: true
        }, {
          displayOutsideMaxExtent: true,
          opacity: record.get('fill_opacity') / 100,
          isBaseLayer: false
        }
      );

      layer.nModel = record;
      this.filterLayer(layer);

      // Track, add to map.
      this.layers.wms[record.id] = layer;
      this.map.addLayer(layer);

      return layer;

    },


    /**
     * Remove a vector layer from the map.
     *
     * @param {OpenLayers.Layer.Vector}: The layer.
     */
    removeVectorLayer: function(layer) {
      this.map.removeLayer(layer);
      delete this.layers.vector[layer.nModel.id];
    },


    /**
     * Remove a WMS layer from the map.
     *
     * @param {OpenLayers.Layer.WMS}: The layer.
     */
    removeWmsLayer: function(layer) {
      this.map.removeLayer(layer);
      delete this.layers.wms[layer.nModel.id];
    },


    /**
     * Remove all layers from the map.
     */
    removeAllLayers: function() {

      // Vector:
      _.each(_.keys(this.layers.vector), _.bind(function(id) {
        if (!this.layers.vector[id].nFrozen) {
          this.removeVectorLayer(this.layers.vector[id]);
        }
      }, this));

      // WMS:
      _.each(_.keys(this.layers.wms), _.bind(function(id) {
        this.removeWmsLayer(this.layers.wms[id]);
      }, this));

    },


    /**
     * Register a layer filter.
     *
     * @param {String} key: A key to identify the filter.
     * @param {Function} evaluator: The boolean filtering function.
     */
    setFilter: function(key, evaluator) {
      this.filters[key] = evaluator;
      this.filterAllLayers();
    },


    /**
     * Remove a layer filter.
     *
     * @param {String} key: The key of the filter to remove.
     */
    removeFilter: function(key) {
      delete this.filters[key];
      this.filterAllLayers();
    },


    /**
     * Show a layer if it passes all filters; otherwise, hide it.
     *
     * @param {Object} layer: The layer to filter.
     */
    filterLayer: function(layer) {

      var visible = true;

      // Pass the layer through each of the filters.
      _.each(this.filters, _.bind(function(evaluator, key) {
        visible = visible && evaluator(layer.nModel);
      }, this));

      layer.setVisibility(visible);

    },


    /**
     * Pass all layers through the filtering system.
     */
    filterAllLayers: function() {
      _.each(this.layers, _.bind(function(group, key) {
        _.each(group, _.bind(function(layer, id) {
          this.filterLayer(layer);
        }, this));
      }, this));
    },


    /**
     * Construct a style map object for a vector.
     *
     * @param {Object} record: The record.
     */
    getStyleMap: function(record) {

      var fillOpacity   = parseInt(record.get('fill_opacity'))   / 100;
      var selectOpacity = parseInt(record.get('select_opacity')) / 100;
      var strokeOpacity = parseInt(record.get('stroke_opacity')) / 100;
      var pointRadius   = parseInt(record.get('point_radius'));
      var strokeWidth   = parseInt(record.get('stroke_width'));

      return new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
          fillColor:        record.get('fill_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      fillOpacity,
          graphicOpacity:   fillOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'select': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      selectOpacity,
          graphicOpacity:   selectOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'temporary': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          fillOpacity:      selectOpacity,
          graphicOpacity:   selectOpacity,
          strokeOpacity:    strokeOpacity
        })
      });

    },


    /**
     * Get the current zoom level.
     *
     * @return {Number}: The zoom level.
     */
    getZoom: function(model) {
      return this.map.getZoom();
    },


    /**
     * Get the current map viewport bounds as a WKT polygon string.
     *
     * @return {String}: The WKT string.
     */
    getExtentAsWKT: function() {
      var extent = this.map.getExtent().toGeometry();
      var vector = new OpenLayers.Feature.Vector(extent);
      return this.formatWKT.write(vector);
    },


    /**
     * Get an array of all vector layers.
     *
     * @return {Array}: The array of layers.
     */
    getVectorLayers: function() {
      return _.values(this.layers.vector);
    },


    /**
     * Get an array of all WMS layers.
     *
     * @return {Array}: The array of layers.
     */
    getWmsLayers: function() {
      return _.values(this.layers.wms);
    },


    /**
     * Focus the position and zoom to center around the passed model.
     *
     * - If the model has a non-null `map_focus` and `map_zoom`, set the
     *   viewport using these values.
     *
     * - Otherwise, automatically fit the viewport around the extent of
     *   the model's geometries, except when coverage is `POINT(0 0)`.
     *
     * @param {Object} model: The record model.
     */
    focusByModel: function(model) {

      // Get a layer for the model.
      var layer = this.layers.vector[model.id]
      if (!layer) layer = this.buildVectorLayer(model);

      // Try to get a focus and zoom.
      var focus = model.get('map_focus');
      var zoom  = model.get('map_zoom');

      // If defined, apply.
      if (_.isString(focus) && _.isNumber(zoom)) {
        this.setViewport(focus, zoom);
      }

      // Otherwise, fit to viewport.
      else if (model.get('coverage')) {
        this.map.zoomToExtent(layer.getDataExtent());
      }

      Neatline.vent.trigger('MAP:focused');

    },


    /**
     * When a feature is highlighted, trigger the `highlight` event with
     * the model associated with the feature.
     *
     * @param {Object} evt: The highlight event.
     */
    onFeatureHighlight: function(evt) {
      Neatline.vent.trigger('highlight', evt.feature.layer.nModel);
    },


    /**
     * When a feature is unhighlighted, trigger the `unhighlight` event
     * with the model associated with the feature.
     *
     * @param {Object} evt: The unhighlight event.
     */
    onFeatureUnhighlight: function(evt) {
      Neatline.vent.trigger('unhighlight', evt.feature.layer.nModel);
    },


    /**
     * When a feature is selected, trigger the `select` event with the
     * model associated with the feature. Also publish a third parameter,
     * {Boolean} `true`, to indicate that the event was initiated by a
     * map click. This flag is used to suppress the map's default focusing
     * response to `select` events, which can be discombobulating when
     * the record's default zoom is much higher or lower than the current
     * zoom level on the map, which produces a drastic context switch.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureSelect: function(feature) {
      Neatline.vent.trigger('select', feature.layer.nModel, true);
    },


    /**
     * When a feature is unselected, trigger the `unselect` event.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureUnselect: function(feature) {
      Neatline.vent.trigger('unselect', feature.layer.nModel);
    }


  });


});
