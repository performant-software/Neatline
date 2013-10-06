
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  Map.View = Backbone.View.extend({


    el: '#neatline-map',

    options: {
      defaultZoom: 6
    },


    // INITIALIZERS
    // ------------------------------------------------------------------------


    initialize: function() {
      this._initGlobals();
      this._initOpenLayers();
      this._initControls();
      this._initEvents();
      this._initBaseLayers();
      this._initViewport();
    },


    /**
     * Initialize tracker containers and helpers.
     */
    _initGlobals: function() {

      /**
       * Alias the global exhibit object.
       */
      this.exhibit = Neatline.g.neatline.exhibit;

      /**
       * WKT reader/writer.
       */
      this.formatWkt = new OpenLayers.Format.WKT();

      /**
       * A nested object that contains references to all vector and WMS layers
       * currently on the map, keyed by record id.
       */
      this.layers = { vector: {}, wms: {} };

      /**
       * An object that contains references to all filters registered on
       * the map, keyed by filter slug.
       */
      this.filters = {};

      /**
       * The model representing the currently-selected record.
       */
      this.selectedModel = null;

      /**
       * True when records are being loaded from the server.
       */
      this.loading = false;

    },


    /**
     * Construct the OpenLayers Map instance, set the default base layer, and
     * call component start-up routines.
     */
    _initOpenLayers: function() {

      this.map = new OpenLayers.Map(this.el, {

        theme: null,
        zoomMethod: null,
        panMethod:  null,

        controls: [
          new OpenLayers.Control.PanZoom(),
          new OpenLayers.Control.Navigation({
            dragPanOptions: { enableKinetic: false },
            documentDrag: true
          })
        ]

      });

    },


    /**
     * Construct, add, and activate hover and click controls to the map.
     */
    _initControls: function() {

      // Bind highlight/select callbacks to the view.
      _.bindAll(this, 'onBeforeHighlight', 'onHighlight', 'onUnhighlight',
        'onSelect', 'onUnselect');

      // Build the hover control, bind callbacks.
      this.highlightControl = new OpenLayers.Control.SelectFeature(
        this.getVectorLayers(), {

          hover: true,
          renderIntent: 'temporary',
          highlightOnly: true,

          eventListeners: {
            beforefeaturehighlighted: this.onBeforeHighlight,
            featurehighlighted:       this.onHighlight,
            featureunhighlighted:     this.onUnhighlight
          }

        }
      );

      // Build the click control, bind callbacks.
      this.selectControl = new OpenLayers.Control.SelectFeature(
        this.getVectorLayers(), {
          onSelect:   this.onSelect,
          onUnselect: this.onUnselect
        }
      );

      // Enable panning when cursor is over feature.
      this.highlightControl.handlers.feature.stopDown = false;
      this.selectControl.handlers.feature.stopDown = false;

      // Add to map, activate.
      this.map.addControls([this.highlightControl, this.selectControl]);
      this.activatePublicControls();

    },


    /**
     * If spatial querying is enabled, issue a request for new layers that
     * fall within the updated viewport extent when the map is moved.
     */
    _initEvents: function() {

      // When the map is panned or zoomed.
      this.map.events.register('moveend', this.map, _.bind(function() {
        if (this.exhibit.spatial_querying) this.requestRecords();
        Neatline.vent.trigger('MAP:move');
      }, this));

    },


    /**
     * Dispatch to one of the base layer constructor methods, depending on
     * what fields are defined on the exhibit object:
     *
     * - If `image_layer` is defined, create a static image layer.
     *
     * - If both `wms_address` and `wms_layers` are defined, create an
     *   individual WMS layer.
     *
     * - If no exhibit-specific layers are defined, add the the regular
     *   spatial layers.
     */
    _initBaseLayers: function() {

      var isImg = _.isString(this.exhibit.image_layer);
      var isWms = _.isString(this.exhibit.wms_address) &&
                  _.isString(this.exhibit.wms_layers);

      if (isImg) this._initImageLayer();
      else if (isWms) this._initWmsLayer();
      else this._initSpatialLayers();

    },


    /**
     * Construct a static image base layer.
     */
    _initImageLayer: function() {

      var h = this.exhibit.image_height;
      var w = this.exhibit.image_width;

      var image = new OpenLayers.Layer.Image(
        this.exhibit.title, this.exhibit.image_layer,
        new OpenLayers.Bounds(0, 0, w, h),
        new OpenLayers.Size(w/5, h/5), {
          numZoomLevels: this.exhibit.zoom_levels
        }
      );

      this.map.addLayer(image);

    },


    /**
     * Construct an individual WMS base layer.
     */
    _initWmsLayer: function() {

      var wms = new OpenLayers.Layer.WMS(
        this.exhibit.title, this.exhibit.wms_address,
        { layers: this.exhibit.wms_layers },
        { maxZoomLevel: 20 }
      );

      this.map.addLayer(wms);

    },


    /**
     * Construct spatial base layers.
     */
    _initSpatialLayers: function() {

      var layers = {};

      // Build array of base layer instances.
      _.each(Neatline.g.neatline.spatial_layers, function(json) {
        var layer = Neatline.request('MAP:LAYERS:getLayer', json);
        if (_.isObject(layer)) layers[json.id] = layer;
      });

      // Add the layers, set indices to 0.
      _.each(_.values(layers), _.bind(function(layer) {
        this.map.addLayer(layer);
        this.map.setLayerIndex(layer, 0);
      }, this));

      // Set default base layer.
      this.map.setBaseLayer(layers[this.exhibit.spatial_layer]);

      // Add layer switcher.
      this.map.addControl(new OpenLayers.Control.LayerSwitcher());

    },


    /**
     * Set the starting focus and zoom.
     */
    _initViewport: function() {

      var focus = Neatline.g.neatline.exhibit.map_focus;
      var zoom  = Neatline.g.neatline.exhibit.map_zoom;

      // Apply default focus, if one exists.
      if (_.isString(focus) && _.isNumber(zoom)) {
        this.setViewport(focus, zoom);
      }

      else {
        // Otherwise, geolocate.
        this.map.zoomTo(this.options.defaultZoom);
        this.geolocate();
      }

    },


    // CONTROLS
    // ------------------------------------------------------------------------


    /**
     * Activate the hover and click controls.
     */
    activatePublicControls: function() {
      this.highlightControl.activate();
      this.selectControl.activate();
    },


    /**
     * Deactivate the hover and click controls.
     */
    deactivatePublicControls: function() {
      this.highlightControl.deactivate();
      this.selectControl.deactivate();
    },


    /**
     * Update the layers operated on by the hover and click controls. Called
     * after new data arrives and the layer have been rebuilt by `ingest`.
     */
    updateControls: function() {

      // Update the controls.
      var layers = this.getVectorLayers();
      this.highlightControl.setLayer(layers);
      this.selectControl.setLayer(layers);

      // Re-select the previously-selected model
      if (!_.isNull(this.selectedModel)) {
        this.selectByModel(this.selectedModel);
      }

    },


    // VIEWPORT
    // ------------------------------------------------------------------------


    /**
     * Focus the position and zoom to center around the passed model.
     *
     * - If the model has a non-null `map_focus` and `map_zoom`, set the
     *   viewport using these values.
     *
     * - Otherwise, automatically fit the viewport around the extent of the
     *   model's geometries, except when coverage is `POINT(0 0)`.
     *
     * @param {Object} model: The record model.
     */
    focusByModel: function(model) {

      // Get a layer for the model.
      var layer = this.getOrCreateVectorLayer(model);

      // Try to get a custom focus.
      var focus = model.get('map_focus');
      var zoom  = model.get('map_zoom');

      // If focus is defined, apply.
      if (_.isString(focus) && _.isNumber(zoom)) {
        this.setViewport(focus, zoom);
      }

      // Otherwise, fit to viewport.
      else if (model.get('coverage') && !model.get('is_wms')) {
        this.map.zoomToExtent(layer.getDataExtent());
      }

      Neatline.vent.trigger('MAP:focused');

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


    // LAYERS
    // ------------------------------------------------------------------------


    /**
     * The point of entry when a new record collection arrives. Updates the
     * map layers to mirror the new records collection.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      if (this.map.dragging) return;

      // Build layers.
      this.ingestVectorLayers(records);
      this.ingestWmsLayers(records);

      // Publish collection, update controls.
      Neatline.vent.trigger('MAP:ingest', records);
      this.updateControls();

      // Store collection.
      this.records = records;
      this.loading = false;

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
        if (!_.contains(newIds, Number(id)) && !layer.nFrozen) {
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
        if (!_.contains(newIds, Number(id))) {
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
        layer.addFeatures(this.formatWkt.read(record.get('coverage')));
      }

      layer.nModel = record;
      layer.nFrozen = false;
      this.filterLayer(layer);

      // Track, add to map.
      this.layers.vector[record.id] = layer;
      this.map.addLayer(layer);

      // Set z-index.
      this.setZIndex(layer, record.get('zindex'));

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
          opacity: parseFloat(record.get('fill_opacity')),
          isBaseLayer: false
        }
      );

      layer.nModel = record;
      this.filterLayer(layer);

      // Track, add to map.
      this.layers.wms[record.id] = layer;
      this.map.addLayer(layer);

      // Set z-index.
      this.setZIndex(layer, record.get('zindex'));

      return layer;

    },


    /**
     * Get or create the vector layer for a model.
     *
     * @param {Object}: A record model.
     */
    getOrCreateVectorLayer: function(model) {
      var layer = this.layers.vector[model.id];
      if (!layer) layer = this.buildVectorLayer(model);
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


    // FILTERS
    // ------------------------------------------------------------------------


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


    // STYLES
    // ------------------------------------------------------------------------


    /**
     * Construct a style map object for a vector.
     *
     * @param {Object} record: The record.
     */
    getStyleMap: function(record) {

      var fillColor           = record.get('fill_color');
      var fillColorSelect     = record.get('fill_color_select');
      var strokeColor         = record.get('stroke_color');
      var strokeColorSelect   = record.get('stroke_color_select');
      var fillOpacity         = record.get('fill_opacity');
      var fillOpacitySelect   = record.get('fill_opacity_select');
      var strokeOpacity       = record.get('stroke_opacity');
      var strokeOpacitySelect = record.get('stroke_opacity_select');
      var externalGraphic     = record.get('point_image');
      var strokeWidth         = record.get('stroke_width');
      var pointRadius         = record.get('point_radius');

      fillOpacity             = parseFloat(fillOpacity);
      fillOpacitySelect       = parseFloat(fillOpacitySelect);
      strokeOpacity           = parseFloat(strokeOpacity);
      strokeOpacitySelect     = parseFloat(strokeOpacitySelect);
      strokeWidth             = Number(strokeWidth);
      pointRadius             = Number(pointRadius);

      return new OpenLayers.StyleMap({

        'default': new OpenLayers.Style({
          fillColor:        fillColor,
          strokeColor:      strokeColor,
          fillOpacity:      fillOpacity,
          graphicOpacity:   fillOpacity,
          strokeOpacity:    strokeOpacity,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        }),

        'select': new OpenLayers.Style({
          fillColor:        fillColorSelect,
          strokeColor:      strokeColorSelect,
          fillOpacity:      fillOpacitySelect,
          graphicOpacity:   fillOpacitySelect,
          strokeOpacity:    strokeOpacitySelect,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        }),

        'temporary': new OpenLayers.Style({
          fillColor:        fillColorSelect,
          strokeColor:      strokeColorSelect,
          fillOpacity:      fillOpacitySelect,
          graphicOpacity:   fillOpacitySelect,
          strokeOpacity:    strokeOpacitySelect,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        })

      });

    },


    // RENDERERS
    // ------------------------------------------------------------------------


    /**
     * Highglight all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    highlightByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer || this.modelIsSelected(model)) return;

      this.stopPropagation = true;

      // Highlight features.
      _.each(layer.features, _.bind(function(feature) {
        this.highlightControl.highlight(feature);
      }, this));

      this.stopPropagation = false;

    },


    /**
     * Unhighglight all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    unhighlightByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer || this.modelIsSelected(model)) return;

      this.stopPropagation = true;

      // Unhighlight features.
      _.each(layer.features, _.bind(function(feature) {
        this.highlightControl.unhighlight(feature);
      }, this));

      this.stopPropagation = false;

    },


    /**
     * Select all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    selectByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer) return;

      this.stopPropagation = true;

      // Select features.
      _.each(layer.features, _.bind(function(feature) {
        this.selectControl.select(feature);
      }, this));

      this.stopPropagation = false;

      // Track selected model.
      this.selectedModel = model;

    },


    /**
     * Unselect all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    unselectByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer) return;

      this.stopPropagation = true;

      // Unselect features.
      _.each(layer.features, _.bind(function(feature) {
        this.selectControl.unselect(feature);
      }, this));

      this.stopPropagation = false;

      // Clear selected model.
      this.selectedModel = null;

    },


    // PUBLISHERS
    // ------------------------------------------------------------------------


    /**
     * Block a feature highlight if the map is being dragged.
     *
     * @param {Object} evt: The highlight event.
     */
    onBeforeHighlight: function(evt) {
      return !this.map.dragging && !this.loading;
    },


    /**
     * When a feature is highlighted, trigger the `highlight` event with the
     * model associated with the feature.
     *
     * @param {Object} evt: The highlight event.
     */
    onHighlight: function(evt) {

      if (this.stopPropagation) return;

      // Highlight sibling features.
      this.highlightByModel(evt.feature.layer.nModel);

      // Publish `highlight` event.
      Neatline.vent.trigger('highlight', {
        model:  evt.feature.layer.nModel,
        source: Map.ID
      });

    },


    /**
     * When a feature is unhighlighted, trigger the `unhighlight` event with
     * the model associated with the feature.
     *
     * @param {Object} evt: The unhighlight event.
     */
    onUnhighlight: function(evt) {

      if (this.stopPropagation) return;

      // Unhighlight sibling features.
      this.unhighlightByModel(evt.feature.layer.nModel);

      // Publish `unhighlight` event.
      Neatline.vent.trigger('unhighlight', {
        model:  evt.feature.layer.nModel,
        source: Map.ID
      });

    },


    /**
     * When a feature is selected, trigger the `select` event with the model
     * associated with the feature.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onSelect: function(feature) {

      if (this.stopPropagation) return;

      // Select sibling features.
      this.selectByModel(feature.layer.nModel);

      // Publish `select` event.
      Neatline.vent.trigger('select', {
        model:  feature.layer.nModel,
        source: Map.ID
      });

    },


    /**
     * When a feature is unselected, trigger the `unselect` event.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onUnselect: function(feature) {

      if (this.stopPropagation) return;

      // Unselect sibling features.
      this.unselectByModel(feature.layer.nModel);

      // Publish `unselect` event.
      Neatline.vent.trigger('unselect', {
        model:  feature.layer.nModel,
        source: Map.ID
      });

    },


    /**
     * Publish a request for new records. If spatial querying is enabled,
     * filter on the current focus and zoom of the map.
     */
    requestRecords: function() {

      var params = {};

      if (this.exhibit.spatial_querying) {
        params.extent = this.getExtentAsWKT();
        params.zoom   = this.getZoom();
      }

      this.loading = true;
      Neatline.execute('MAP:load', params);

    },


    // HELPERS
    // ------------------------------------------------------------------------


    /**
     * Set the z-index on a layer. Add 1 to the user-provided value to ensure
     * that the layers always stack on top of the base layer, which is always
     * has a z-index of 0.
     *
     * @param {Object} layer: A WMS / vector layer.
     * @param {Number} zindex: The z-index value.
     */
    setZIndex: function(layer, zindex) {
      this.map.setLayerIndex(layer, 1+zindex);
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
      return this.formatWkt.write(vector);
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
     * Is the passed model the same as the currently-selected model?
     *
     * @return {Object}: A record model.
     */
    modelIsSelected: function(model) {
      if (this.selectedModel) return this.selectedModel.id == model.id;
      else return false;
    }


  });


});
