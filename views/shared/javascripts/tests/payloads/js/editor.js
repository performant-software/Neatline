
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline application.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline = new Backbone.Marionette.Application();
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * An individual Neatline record.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.Model = Backbone.Model.extend({
    url: function() { return __exhibit.api.record+'/'+this.get('id'); }
  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Collection of Neatline records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.Collection = Backbone.Neatline.SyncCollection.extend({
    url: function() { return __exhibit.api.records; },
    model: Neatline.Record.Model
  });


});
;
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
   * Query for updated spatial data when the map is panned or zoomed.
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   */
  Neatline.vent.on('map:move', function(params) {
    Map.__collection.update(params, function(records) {
      Neatline.vent.trigger('map:newRecords', records);
      Map.__view.ingest(records);
    });
  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  Map.init = function() {
    this.__collection = new Neatline.Record.Collection();
    this.__view = new Neatline.Map.Views.Map({ el: '#neatline-map' });
  };

  Map.addInitializer(Map.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map command handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Focus the map on the data extent for a record, identified by id.
   *
   * @param {Number} id: The record id.
   */
  Neatline.commands.addHandler('map:focusById', function(id) {
    Map.__collection.getOrFetch(id, function(model) {
      Map.__view.focusByModel(model);
    });
  });


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: The record model.
   */
  Neatline.commands.addHandler('map:focusByModel', function(model) {
    Map.__view.focusByModel(model);
  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map view. Creates and manages the core OpenLayers.Map instance.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Views', function(
  Views, Map, Backbone, Marionette, $, _) {


  Views.Map = Backbone.View.extend({


    options: {
      defaultZoom: 6
    },


    /**
     * Initialize state variables, run the top-level start-up routine, and
     * publish initial request for data.
     */
    initialize: function() {

      // Trackers.
      this.layers = [];   // Array of all current vector layers.
      this.frozen = [];   // Array of layers that should not be updated.

      // Startup.
      this.initializeOpenLayers();
      this.publishPosition();

    },


    /**
     * Construct the OpenLayers Map instance, set the default base layer
     * and call component start-up routines that add cursor controls, set
     * the default focus/zoom, and listen for movement events.
     */
    initializeOpenLayers: function() {

      // Global attributes.
      OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

      // widgets.
      var options = {
        controls: [
          new OpenLayers.Control.MousePosition(),
          new OpenLayers.Control.PanZoomBar(),
          new OpenLayers.Control.Navigation({ documentDrag: true }),
          new OpenLayers.Control.LayerSwitcher()
        ],
        theme: null
      };

      // Instantiate map.
      this.map = new OpenLayers.Map(this.el, options);

      // Get OSM base layer.
      this.osm = new OpenLayers.Layer.OSM();
      this.map.addLayer(this.osm);
      this.map.setBaseLayer(this.osm);

      // Startup routines.
      this.addControls();
      this.setDefaultViewport();
      this.registerMapEvents();

    },


    /**
     * Construct, add, and activate hover and click controls to the map.
     * `hoverControl` handles highlighting, `clickControl` handles clicks.
     */
    addControls: function() {

      // Build the hover control, bind callbacks.
      this.hoverControl = new OpenLayers.Control.SelectFeature(
        this.layers, {
          hover: true,
          highlightOnly: true,
          renderIntent: 'temporary',
          eventListeners: {
            featurehighlighted: this.onFeatureHighlight,
            featureunhighlighted: this.onFeatureUnhighlight
          }
        }
      );

      // Build the click control, bind callbacks.
      this.clickControl = new OpenLayers.Control.SelectFeature(
        this.layers, {
          onSelect: this.onFeatureSelect,
          onUnselect: this.onFeatureUnselect
        }
      );

      // Add to map, activate.
      this.map.addControls([this.hoverControl, this.clickControl]);
      this.activateControls();

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
      this.hoverControl.setLayer(this.layers);
      this.clickControl.setLayer(this.layers);
    },


    /**
     * Set the starting focus and zoom. If `mapFocus` is non-null on the
     * global __exhibit object, then we know that a default focus and zoom
     * has been set for the exhibit and should be manifested. If no
     * default exists, apply the default zoom and geolocate the focus.
     */
    setDefaultViewport: function() {

      // If defaults are defined.
      if (!_.isNull(__exhibit.map.focus)) {
        this.setViewport(__exhibit.map.focus, __exhibit.map.zoom);
      }


      else {
        this.map.zoomTo(this.options.defaultZoom);
        this.geolocate();
      }

    },


    /**
     * Add a listener for the `moveend` event on the map, which is called
     * when a pan or zoom is completed. Bind to `publishPosition`, which
     * emits the current focus of the map and triggers off a data reload.
     */
    registerMapEvents: function() {

      // Register for `moveend`.
      this.map.events.register('moveend', this.map,
        _.bind(this.publishPosition, this)
      );

    },


    /**
     * Publish the current focus and zoom of the map via `map:move`.
     */
    publishPosition: function() {

      // Trigger out.
      Neatline.vent.trigger('map:move', {
        extent: this.getExtentAsWKT(),
        zoom:   this.getZoom()
      });

    },


    /**
     * Focus the position and zoom to center around the passed model.
     *
     * - If `map_active` is 0, break and do nothing.
     *
     * - If the model has a non-null `map_focus`, then we know that a
     *   default position has been defined and can assume that `map_zoom`
     *   also has a value. Set the viewport using these values.
     *
     * - Otherwise, automatically fit the viewport around the extent of
     *   the model's geometries.
     *
     * @param {Object} model: The record model.
     */
    focusByModel: function(model) {

      // Break if map-inactive.
      if (model.get('map_active') === 0) {
        Neatline.vent.trigger('map:focused');
        return;
      }

      // Get / build the layer for the model.
      var layer = this.getLayerByModel(model);
      if (!layer) layer = this.buildLayer(model);

      // Try to get a map focus.
      var mapFocus = model.get('map_focus');

      // If defined, apply.
      if (!_.isNull(mapFocus)) {
        this.setViewport(mapFocus, model.get('map_zoom'));
      }

      else {
        // Otherwise, fit to viewport.
        this.map.zoomToExtent(layer.getDataExtent());
      }

      // Publish complete.
      Neatline.vent.trigger('map:focused');

    },


    /**
     * Set the focus and zoom of the map.
     *
     * @param {String} focus: Comma-delimited lat/lon.
     * @param {Number} zoom: The zoom value.
     */
    setViewport: function(focus, zoom) {

      // Get focus lat/lon.
      focus = focus.split(',');
      var lonlat = new OpenLayers.LonLat(focus[0], focus[1]);

      // Set center.
      this.map.setCenter(lonlat, zoom);

    },


    /**
     * Focus the map on the user's location.
     */
    geolocate: function() {

      // Construct the control.
      var geolocate = new OpenLayers.Control.Geolocate({
        bind: true, watch: false });

      // Focus.
      this.map.addControl(geolocate);
      geolocate.activate();

    },


    /**
     * The top-level point of entry when a new record collection arrives.
     * Updates the map layers to mirror the new records collection.
     *
     * - Remove all records that are not included in the `frozen` array.
     *
     * - Then walk the new collection and construct new layers for models
     *   that are active on the map and not in the `frozen` array.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      var layers = [];


      // Clear layers.
      // -------------

      _.each(this.layers, _.bind(function(layer) {

        // If unfrozen, remove from map.
        if (!_.contains(this.frozen, layer.nId)) {
          this.map.removeLayer(layer);
        }

        // Else, add to new tracker.
        else layers.push(layer);

      }, this));

      this.layers = layers;


      // Add layers.
      // -----------

      records.each(_.bind(function(record) {

        // Test for frozen and active.
        var frozen = _.contains(this.frozen, record.get('id'));
        var active = record.get('map_active') == 1;

        // Build if map active and unfrozen.
        if (!frozen && active) this.buildLayer(record);

      }, this));

      // Register layers.
      this.updateControls();


    },


    /**
     * Construct a vector layer and geometries for a model.
     *
     * @param {Object} record: The record model.
     * @return {Boolean}: True if the layer was added.
     */
    buildLayer: function(record) {

      // Build geometry and style.
      var formatWKT = new OpenLayers.Format.WKT();
      var features = formatWKT.read(record.get('coverage'));
      var style = this.getStyleMap(record);

      // Build the layer.
      var layer = new OpenLayers.Layer.Vector(
        record.get('title'), {
          styleMap: style, displayInLayerSwitcher: false
        }
      );

      // Add to map, track.
      layer.addFeatures(features);
      this.map.addLayer(layer);

      // Store model, id.
      layer.nModel = record;
      layer.nId = record.get('id');

      // Track layer.
      this.layers.push(layer);

      return layer;

    },


    /**
     * Construct a style map object for a vector. Used by `buildLayer` to
     * populate the `styleMap` attribute for a model's vector layer.
     *
     * @param {Object} record: The record.
     */
    getStyleMap: function(record) {

      // Compute decimal opacities.
      var fillOpacity = record.get('vector_opacity')/100;
      var imageOpacity = record.get('image_opacity')/100;
      var selectOpacity = record.get('select_opacity')/100;
      var strokeOpacity = record.get('stroke_opacity')/100;

      return new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
          fillColor:        record.get('vector_color'),
          strokeColor:      record.get('stroke_color'),
          pointRadius:      record.get('point_radius'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      record.get('stroke_width'),
          fillOpacity:      fillOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'select': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          pointRadius:      record.get('point_radius'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      record.get('stroke_width'),
          fillOpacity:      selectOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        }),
        'temporary': new OpenLayers.Style({
          fillColor:        record.get('select_color'),
          strokeColor:      record.get('stroke_color'),
          pointRadius:      record.get('point_radius'),
          externalGraphic:  record.get('point_image'),
          strokeWidth:      record.get('stroke_width'),
          fillOpacity:      selectOpacity,
          graphicOpacity:   imageOpacity,
          strokeOpacity:    strokeOpacity
        })
      });

    },


    /**
     * Return the layer that corresponds the the passed model instance.
     *
     * @param {Object} model: The record model.
     * @return {Object|OpenLayers.Layer.Vector} The vector layer.
     */
    getLayerByModel: function(model) {
      return _.first(this.map.getLayersBy('nId', model.get('id')));
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
      var formatWKT = new OpenLayers.Format.WKT();
      var extent = this.map.getExtent().toGeometry();
      var feature = new OpenLayers.Feature.Vector(extent);
      return formatWKT.write(feature);
    },


    /**
     * When a feature is selected, publish `map:select` with the model
     * instance that was used to construct the layer.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureSelect: function(feature) {
      Neatline.vent.trigger('map:select', feature.layer.nModel);
    },


    /**
     * When a feature is unselected, publish `map:unselect` with the model
     * instance that was used to construct the layer.
     *
     * @param {Object|OpenLayers.Feature} feature: The feature.
     */
    onFeatureUnselect: function(feature) {
      Neatline.vent.trigger('map:unselect', feature.layer.nModel);
    },


    /**
     * When a feature is highlighted, publish `map:highlight` with the
     * model instance that was used to construct the layer.
     *
     * @param {Object} evt: The highlight event.
     */
    onFeatureHighlight: function(evt) {
      Neatline.vent.trigger('map:highlight', evt.feature.layer.nModel);
    },


    /**
     * When a feature is un-highlighted, publish `map:unhighlight` with
     * the model instance that was used to construct the layer.
     *
     * @param {Object} evt: The unhighlight event.
     */
    onFeatureUnhighlight: function(evt) {
      Neatline.vent.trigger('map:unhighlight', evt.feature.layer.nModel);
    },


    /**
     * Add the passed record id to the `frozen` array.
     *
     * @param {Number} id: The id to freeze.
     */
    freeze: function(id) {
      this.frozen.push(id);
    },


    /**
     * Remove the passed record id to the `frozen` array.
     *
     * @param {Number} id: The id to unfreeze.
     */
    unFreeze: function(id) {
      this.frozen = _.reject(this.frozen, function(fid) {
        return fid == id;
      });
    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bubble events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Bubble', function(
  Bubble, Neatline, Backbone, Marionette, $, _) {


  /**
   * Show bubble on feature mouseenter.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('map:highlight', function(model) {
    Bubble.__view.show(model);
  });


  /**
   * Hide bubble on feature mouseleave.
   */
  Neatline.vent.on('map:unhighlight', function() {
    Bubble.__view.hide();
  });


  /**
   * Lock bubble on feature click on.
   */
  Neatline.vent.on('map:select', function() {
    Bubble.__view.freeze();
  });


  /**
   * Lock bubble on feature click off.
   */
  Neatline.vent.on('map:unselect', function() {
    Bubble.__view.thaw();
  });


  /**
   * Close and deactivate the bubble when the "Spatial" tab is active.
   */
  Neatline.vent.on('editor:form:spatialSelect', function() {
    Bubble.__view.thaw();
    Bubble.__view.deactivate();
  });


  /**
   * Reactivate the bubble when the "Spatial" tab is inactive.
   */
  Neatline.vent.on('editor:form:spatialDeselect', function(model) {
    Bubble.__view.activate();
  });


  /**
   * Close the bubble when an edit form is closed.
   */
  Neatline.vent.on('editor:form:close', function() {
    Bubble.__view.activate();
    Bubble.__view.thaw();
  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bubble initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Bubble', function(
  Bubble, Neatline, Backbone, Marionette, $, _) {


  Bubble.init = function() {
    this.__view = new Neatline.Bubble.Views.Bubble({ el: '#bubble' });
  };

  Bubble.addInitializer(Bubble.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bubble view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Bubble.Views', function(
  Views, Bubble, Backbone, Marionette, $, _) {


  Views.Bubble = Backbone.Neatline.View.extend({


    options: {
      padding: {
        x: 40,
        y: 25
      }
    },

    ui: {
      title:  '.record-title',
      body:   '.record-body'
    },


    /**
     * Initialize trackers, get markup.
     */
    initialize: function() {

      this.getUi();

      // State trackers.
      this.active = true;   // True when bubble should be displayed.
      this.frozen = false;  // True when bubble is frozen after a click.

      // Containers.
      this.exhibit = $('#neatline');
      this.window = $(window);

    },


    /**
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {

      // Break if frozen.
      if (this.frozen || !this.active) return;

      // Render values, measure.
      this.__ui.title.html(model.get('title'));
      this.__ui.body.html(model.get('body'));

      // Position on mousemove.
      this.window.bind('mousemove.bubble', _.bind(function(e) {
        this.position(e);
      }, this));

      // Hide on exhibit mouseleave.
      this.exhibit.bind('mouseleave.bubble', _.bind(function() {
        this.hide();
      }, this));

      // Show.
      this.$el.show();

    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.frozen) this.thaw();
    },


    /**
     * Freeze the bubble in place.
     *
     * @param {Object} model: The record model.
     */
    freeze: function() {

      // Strip events.
      this.window.unbind('mousemove.bubble');
      this.exhibit.unbind('mouseleave.bubble');

      // Track.
      this.frozen = true;

    },


    /**
     * Unfreeze the bubble.
     *
     * @param {Object} model: The record model.
     */
    thaw: function() {

      // Strip events.
      this.window.unbind('mousemove.bubble');
      this.exhibit.unbind('mouseleave.bubble');

      // Track, hide.
      this.frozen = false;
      this.$el.hide();

    },


    /**
     * Render position.
     *
     * @param {Object} evt: The mousemove event.
     */
    position: function(evt) {
      var x = evt.clientX + this.options.padding.x;
      var y = evt.clientY - this.options.padding.y;
      this.$el.css({ left: x, top: y });
    },


    /**
     * Enable the bubble.
     */
    activate: function() {
      this.active = true;
    },


    /**
     * Disable the bubble
     */
    deactivate: function() {
      this.active = false;
    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline editor initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  /**
   * Start the editor before Neatline.
   */
  Neatline.on('initialize:before', function() {
    Editor.start();
  });


  /**
   * Initialize the router and layout view.
   */
  Editor.init = function() {
    this.__view   = new Editor.View({ el: 'body' });
    this.__router = new Editor.Router();
    Backbone.history.stop();
    Backbone.history.start();
  };

  Editor.addInitializer(Editor.init);


}});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  Editor.Router = Backbone.Router.extend({


    routes: {
      '':                 'showRecordList',
      'records':          'showRecordList',
      'records/add':      'showNewRecordForm',
      'records/:id':      'showRecordForm',
      'tags':             'showTagList',
      'tags/add':         'showNewTagForm',
      'tags/:id':         'showTagForm'
    },


    /**
     * Alias components.
     */
    initialize: function() {

      this.views = {
        editor:   Editor.         __view,
        menu:     Editor.Menu.    __view,
        search:   Editor.Search.  __view,
        records:  Editor.Records. __view,
        record:   Editor.Record.  __view,
        tags:     Editor.Tags.    __view,
        tag:      Editor.Tag.     __view
      };

      this.ui = {
        editor:   Editor.         __view.__ui.editor,
        menu:     Editor.Menu.    __view.$el,
        search:   Editor.Search.  __view.$el,
        records:  Editor.Records. __view.$el,
        record:   Editor.Record.  __view.$el,
        tags:     Editor.Tags.    __view.$el,
        tag:      Editor.Tag.     __view.$el
      };

    },


    /**
     * Show the list of records.
     */
    showRecordList: function() {
      this.ui.editor.html(this.ui.menu);
      this.ui.editor.append(this.ui.search);
      this.ui.editor.append(this.ui.records);
      this.views.menu.activateTab('records');
    },


    /**
     * Show edit form for individual record.
     *
     * @param {String} id: The record id.
     */
    showRecordForm: function(id) {
      this.ui.editor.html(this.ui.record);
    },


    /**
     * Show add record form.
     */
    showNewRecordForm: function() {
      this.ui.editor.html(this.ui.record);
    },


    /**
     * Show the list of tags.
     */
    showTagList: function() {
      this.ui.editor.html(this.ui.menu);
      this.ui.editor.append(this.ui.tags);
      this.views.menu.activateTab('tags');
    },


    /**
     * Show edit form for individual tag.
     *
     * @param {String} id: The tag id.
     */
    showTagForm: function(id) {
      this.ui.editor.html(this.ui.record);
    },


    /**
     * Show add tag form.
     */
    showNewTagForm: function() {
      this.ui.editor.html(this.ui.record);
    }


  });


}});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  Editor.View = Backbone.Neatline.View.extend({


    ui: {
      exhibit:  '#neatline',
      map:      '#neatline-map',
      editor:   '#editor'
    },


    /**
     * Get ui, store default editor width, listen for window resize.
     */
    initialize: function() {

      this.getUi();

      // Cache starting width.
      this.width = this.__ui.editor.width();

      // Listen for resize.
      this.window = $(window);
      this.window.resize(_.bind(this.position, this));
      this.window.trigger('resize');

    },


    /**
     * Fit the exhibit and editor to fill the screen.
     */
    position: function() {

      // Measure window.
      var h = this.window.height();
      var w = this.window.width();

      this.__ui.editor.   css({ height: h, width: this.width });
      this.__ui.map.      css({ height: h, width: w - this.width });
      this.__ui.exhibit.  css({ left: this.width });

    }


  });


}});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  Menu.init = function() {
    this.__view = new Menu.View();
  };

  Menu.addInitializer(Menu.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  Menu.View = Backbone.Neatline.View.extend({


    template: '#menu-template',
    tagName: 'header',

    ui: {
      tabs: {
        all:      'ul.nav li',
        records:  'li.records',
        tags:     'li.tags'
      }
    },


    /**
     * Render template, get ui.
     */
    initialize: function() {
      this.getTemplate();
      this.getUi();
    },


    /**
     * Activate a tab.
     *
     * @param {String} tab: The tab name.
     */
    activateTab: function(tab) {
      this.ui.tabs.all.removeClass('active');
      this.ui.tabs[tab].addClass('active');
    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.init = function() {
    this.__view = new Record.View();
  };

  Record.addInitializer(Record.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.View = Backbone.Neatline.View.extend({


    template:   '#record-form-template',
    className:  'form-stacked record',
    tagName:    'form',


    /**
     * Render template.
     */
    initialize: function() {
      this.getTemplate();
    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.ListView = Backbone.View.extend({


    className:  'records',
    tagName:    'ul',


    /**
     * Compile row template.
     */
    initialize: function() {
      this.template = _.template($('#record-row-template').html());
    },


    /**
     * Render list of records.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      // Walk records.
      records.each(_.bind(function(r) {

        // Create row view.
        var row = new Records.RowView({
          template: this.template,
          model: r
        });

        // Add to list.
        this.$el.append(row.$el);

      }, this));

    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record row view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.RowView = Backbone.View.extend({


    className:  'record',
    tagName:    'a',


    /**
     * Store model, set `href`, render template.
     */
    initialize: function() {

      // Store model, set `href`.
      this.model = this.options.model;
      this.$el.attr('href', '#records/'+this.model.get('id'));

      // Render template.
      this.$el.append(this.options.template({
        title:  this.model.get('title'),
        body:   this.model.get('body')
      }));

    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.init = function() {

    // Instantiate collection and view.
    this.__collection = new Neatline.Record.Collection();
    this.__view = new Records.ListView();

    // Execute default search query.
    Neatline.execute('editor:loadRecords');

  };

  Records.addInitializer(Records.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list command handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  /**
   * Execute search query.
   *
   * @param {Object} params: Query parameters.
   */
  Neatline.commands.addHandler('editor:loadRecords', function(params) {
    Records.__collection.update(params, function(records) {
      Records.__view.ingest(records);
    });
  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  Search.init = function() {
    this.__view = new Search.View();
  };

  Search.addInitializer(Search.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  Search.View = Backbone.Neatline.View.extend({


    template:   '#search-template',
    className:  'search',
    tagName:    'form',


    /**
     * Render template.
     */
    initialize: function() {
      this.getTemplate();
    }


  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag form initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  Tag.init = function() {
    this.__view = new Tag.View();
  };

  Tag.addInitializer(Tag.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  Tag.View = Backbone.View.extend({
    tagName: 'form'
  });


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tags list initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tags', function(
  Tags, Neatline, Backbone, Marionette, $, _) {


  Tags.init = function() {
    this.__view = new Tags.View();
  };

  Tags.addInitializer(Tags.init);


});
;
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag list view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tags', function(
  Tags, Neatline, Backbone, Marionette, $, _) {


  Tags.View = Backbone.View.extend({
    className:  'tags',
    tagName:    'ul'
  });


});
