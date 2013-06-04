
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

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


    /**
     * Initialize the map and publish initial request for data.
     */
    initialize: function() {

      // An nested object that contains references to all vector and WMS
      // layers currently on the map, keyed by record id.
      this.layers = { vector: {}, wms: {} };

      // An object that contains references to all filters registered on
      // the map, keyed by filter slug.
      this.filters = {};

      // WKT reader/writer.
      this.formatWkt = new OpenLayers.Format.WKT();

      // The currently-selected record model.
      this.selectedModel = null;

      // Startup routines.
      this.__initOpenLayers();
      this.__initBaseLayers();
      this.__initControls();
      this.__initViewport();
      this.__initEvents();

      // Get starting data.
      this.publishPosition();

    },


    /**
     * Construct the OpenLayers Map instance, set the default base layer
     * and call component start-up routines that add cursor controls, set
     * the default focus/zoom, and listen for movement events.
     */
    __initOpenLayers: function() {

      this.map = new OpenLayers.Map(this.el, {

        theme: null,
        zoomMethod: null,
        panMethod:  null,

        controls: [
          new OpenLayers.Control.PanZoomBar(),
          new OpenLayers.Control.LayerSwitcher(),
          new OpenLayers.Control.Navigation({
            dragPanOptions: { enableKinetic: false },
            documentDrag: true
          })
        ]

      });

    },


    /**
     * Construct the base layers and set the default.
     */
    __initBaseLayers: function() {

      this.baseLayers = {};

      // Build array of base layer instances.
      _.each(Neatline.g.neatline.base_layers, _.bind(function(json) {
        var layer = Neatline.request('MAP:LAYERS:getLayer', json);
        if (_.isObject(layer)) this.baseLayers[json.id] = layer;
      }, this));

      // Add the layers.
      this.map.addLayers(_.values(this.baseLayers));

      // Set default layer.
      this.map.setBaseLayer(
        this.baseLayers[Neatline.g.neatline.exhibit.base_layer]
      );

    },


    /**
     * Construct, add, and activate hover and click controls to the map.
     */
    __initControls: function() {

      // Build the hover control, bind callbacks.
      this.highlightControl = new OpenLayers.Control.SelectFeature(
        this.getVectorLayers(), {

          hover: true,
          renderIntent: 'temporary',
          highlightOnly: true,

          eventListeners: {
            featurehighlighted:   _.bind(this.onFeatureHighlight, this),
            featureunhighlighted: _.bind(this.onFeatureUnhighlight, this)
          }

        }
      );

      // Build the click control, bind callbacks.
      this.selectControl = new OpenLayers.Control.SelectFeature(
        this.getVectorLayers(), {
          onSelect:   _.bind(this.onFeatureSelect, this),
          onUnselect: _.bind(this.onFeatureUnselect, this)
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
     * Set the starting focus and zoom.
     */
    __initViewport: function() {

      var focus = Neatline.g.neatline.exhibit.map_focus;
      var zoom  = Neatline.g.neatline.exhibit.map_zoom;

      // Apply defaults if they exist.
      if (_.isString(focus) && _.isNumber(zoom)) {
        this.setViewport(focus, zoom);
      }

      else {
        // Otherwise, geolocate.
        this.map.zoomTo(this.options.defaultZoom);
        this.geolocate();
      }

    },


    /**
     * When a move completes, issue a request for new layers that fall
     * within the updated viewport extent.
     */
    __initEvents: function() {
      this.map.events.register('moveend', this.map, _.bind(function() {
        this.publishPosition();
      }, this));
    },


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
     * Update the layer collections operated on by the hover and click
     * controls. Called after new data arrives and the layer set has been
     * rebuild by the `ingest` flow.
     */
    updateControls: function() {

      // Update the controls.
      var layers = this.getVectorLayers();
      this.highlightControl.setLayer(layers);
      this.selectControl.setLayer(layers);

      // TODO|TDD
      if (!_.isNull(this.selectedModel)) {
        this.selectByModel(this.selectedModel);
      }

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

      if (this.map.dragging) return;

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
        layer.addFeatures(this.formatWkt.read(record.get('coverage')));
      }

      layer.nModel = record;
      layer.nFrozen = false;
      this.filterLayer(layer);

      // Track, add to map.
      this.layers.vector[record.id] = layer;
      this.map.addLayer(layer);

      // Set z-index.
      this.map.setLayerIndex(layer, record.get('zindex'));

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
      this.map.setLayerIndex(layer, record.get('zindex'));

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
      strokeWidth             = parseInt(strokeWidth);
      pointRadius             = parseInt(pointRadius);

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
      var layer = this.layers.vector[model.id];
      if (!layer) layer = this.buildVectorLayer(model);

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
     * Highglight all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    highlightByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer) return;

      // Render `temporary` intent.
      _.each(layer.features, _.bind(function(feature) {
        layer.drawFeature(feature, 'temporary');
      }, this));

    },


    /**
     * Unhighglight all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    unhighlightByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer) return;

      // Render `default` intent.
      _.each(layer.features, _.bind(function(feature) {
        layer.drawFeature(feature, 'default');
      }, this));

    },


    /**
     * Select all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    selectByModel: function(model) {

      var layer = this.layers.vector[model.id];
      if (!layer) return;

      _.each(layer.features, _.bind(function(feature) {

        // Render `select` intent, register the feature as selected.

        layer.drawFeature(feature, 'select');
        layer.selectedFeatures.push(feature);

        // Set the `_lastHighlighter` attribute on the feature to the id
        // of the select control. This has the effect of "freezing" the
        // render intent and preventing it from being switched back to the
        // `default` intent by the highlight control.

        // TODO|TDD
        feature._lastHighlighter = this.selectControl.id;

      }, this));

      // Mock a feature handler on the select control, which ensures that
      // the layer can be unselected by clicking elsewhere on the map.

      // TODO|TDD
      this.selectControl.handlers.feature.lastFeature =
        layer.selectedFeatures[0];

      // Track model.
      this.selectedModel = model;

    },


    /**
     * Unselect all features on a layer, identified by record id.
     *
     * @param {Object} model: The record model.
     */
    unselectByModel: function(model) {
      this.unhighlightByModel(model);
      this.selectedModel = null;
    },


    /**
     * When a feature is highlighted, trigger the `highlight` event with
     * the model associated with the feature.
     *
     * @param {Object} evt: The highlight event.
     */
    onFeatureHighlight: function(evt) {

      // Highlight sibling features.
      this.highlightByModel(evt.feature.layer.nModel);

      // Publish `highlight` event.
      Neatline.vent.trigger('highlight', {
        model:  evt.feature.layer.nModel,
        source: Map.ID
      });

    },


    /**
     * When a feature is unhighlighted, trigger the `unhighlight` event
     * with the model associated with the feature.
     *
     * @param {Object} evt: The unhighlight event.
     */
    onFeatureUnhighlight: function(evt) {

      // Unhighlight sibling features.
      this.unhighlightByModel(evt.feature.layer.nModel);

      // Publish `unhighlight` event.
      Neatline.vent.trigger('unhighlight', {
        model:  evt.feature.layer.nModel,
        source: Map.ID
      });

    },


    /**
     * When a feature is selected, trigger the `select` event with the
     * model associated with the feature.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureSelect: function(feature) {

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
    onFeatureUnselect: function(feature) {

      // Unselect sibling features.
      this.unselectByModel(feature.layer.nModel);

      // Publish `unselect` event.
      Neatline.vent.trigger('unselect', {
        model:  feature.layer.nModel,
        source: Map.ID
      });

    }


  });


});
