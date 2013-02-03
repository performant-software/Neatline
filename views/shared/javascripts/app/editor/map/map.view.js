
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Mix editing functionality into application map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

_.extend(Neatline.Map.View.prototype, {


  /**
   * Initialize editor-specific state tracekrs.
   */
  initializeEditor: function() {
    this.editLayer = null;
  },


  /**
   * When a new record collection is ingested, exclude the layer that is
   * currently being edited from being updated or garbage collected in the
   * process of rendering the new collection. This prevents edit layers
   * for new records from being prematurely garbage collected before they
   * are saved for the first time, and unsaved modifications made to edit
   * layers for existing records from being wiped out by server data.
   *
   * @param {Object} records: The records collection.
   */
  ingest: function(records) {

    this.records = records;
    var layers = [];

    // REMOVE
    _.each(this.layers, _.bind(function(layer) {

      // Remove if the layer is not the edit layer.
      if (!this.editLayer || (layer.id != this.editLayer.id)) {
        this.map.removeLayer(layer);
      }

      else layers.push(layer);

    }, this));

    this.layers = layers;

    // CREATE
    records.each(_.bind(function(record) {

      // Add if the layer is not the edit layer.
      if (!this.editLayer || (record.get('id') != this.editLayer.nId)) {
        this.buildLayer(record);
      }

    }, this));

    this.updateControls();

  },


  /**
   * Construct editing controls for record.
   *
   * @param {Object} model: The record model.
   */
  startEdit: function(model) {

    // Find or create a layer for the model.
    this.editLayer = this.getLayer(model) || this.buildLayer(model);

    this.controls = {

      // Draw Point.
      point: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Point,
        {
          featureAdded: _.bind(this.publish, this)
        }
      ),

      // Draw line.
      line: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Path,
        {
          featureAdded: _.bind(this.publish, this)
        }
      ),

      // Draw polygon.
      poly: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Polygon,
        {
          featureAdded: _.bind(this.publish, this)
        }
      ),

      // Draw regular polygon.
      regPoly: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.RegularPolygon,
        {
          featureAdded: _.bind(this.publish, this)
        }
      ),

      // Draw SVG-backed geometry.
      svg: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Geometry,
        {
          featureAdded: _.bind(this.publish, this)
        }
      ),

      // Modify shape.
      edit: new OpenLayers.Control.ModifyFeature(
        this.editLayer,
        {
          onModification: _.bind(this.publish, this)
        }
      ),

      // Delete shape.
      remove: new OpenLayers.Control.ModifyFeature(
        this.editLayer,
        {
          onModificationStart: _.bind(this.removeFeature, this)
        }
      )

    };

    // Add edit controls to map.
    _.each(this.controls, _.bind(function(control, key) {
      this.map.addControl(control);
    }, this));

  },


  /**
   * Remove editing controls.
   */
  endEdit: function() {

    // Remove controls.
    _.each(this.controls, _.bind(function(control) {
      this.map.removeControl(control);
      control.deactivate();
    }, this));

    this.activateControls();
    this.editLayer = null;

  },



  /**
   * Apply a settings combination to the controls. Based on:
   * http://openlayers.org/dev/examples/modify-feature.html
   *
   * @param {Object} settings: Settings for the controls.
   */
  updateEdit: function(settings) {


    // Re-activate the default hover/click controls (which could have been
    // disabled if the previous edit mode was "Modify Shape").
    this.activateControls();

    // Deactivate all editing controls.
    _.each(this.controls, function(control) {
      control.deactivate();
    });

    // Reset modify mode.
    this.controls.edit.mode = OpenLayers.Control.ModifyFeature.RESHAPE;


    // Apply edit mode.
    // ----------------

    switch (settings.mode) {

      case 'point':
        this.controls.point.activate();
        break;

      case 'line':
        this.controls.line.activate();
        break;

      case 'poly':
        this.controls.poly.activate();
        break;

      case 'svg':
        this.controls.svg.activate();
        break;

      case 'regPoly':
        this.controls.regPoly.activate();
        break;

      case 'modify':
        this.deactivateControls();
        this.controls.edit.activate();
        break;

      case 'remove':
        this.controls.remove.activate();
        break;

    }


    // Apply "Regular Polygon" settings.
    // ---------------------------------

    // Sides.
    var sides = _.isNaN(settings.poly.sides) ? 0 : settings.poly.sides;
    this.controls.regPoly.handler.sides = Math.max(3, sides);

    // Snap angle.
    var snap = _.isNaN(settings.poly.snap) ? 0 : settings.poly.snap;
    this.controls.regPoly.handler.snapAngle = parseFloat(snap);

    // Irregular.
    this.controls.regPoly.handler.irregular = settings.poly.irreg;


    // Apply "Modify Shape" settings.
    // ------------------------------

    // Rotate.
    if (_.contains(settings.modify, 'rotate')) {
      this.controls.edit.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
    }

    // Resize.
    if (_.contains(settings.modify, 'resize')) {
      this.controls.edit.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
    }

    // Drag.
    if (_.contains(settings.modify, 'drag')) {
      this.controls.edit.mode |= OpenLayers.Control.ModifyFeature.DRAG;
    }

  },


  /**
   * Set the collection on the `Geometry` handler.
   *
   * @param {String} wkt: The WKT.
   */
  updateWKT: function(wkt) {
    var geometry = OpenLayers.Geometry.fromWKT(wkt);
    this.controls.svg.handler.setGeometry(geometry);
  },


  /**
   * Reconstruct the stylemap for the edit layer.
   *
   * @param {Object} model: The updated model.
   */
  updateStyles: function(model) {
    this.editLayer.styleMap = this.getStyleMap(model);
    this.editLayer.redraw();
  },


  /**
   * Publish updated KML.
   */
  publish: function() {

    var features = [];
    var wkt = null;

    // Get features from the edit layer.
    _.each(this.editLayer.features, function(f) {
      if (!f._sketch) {

        // If the feature's `geometry` is a collection, not an individual
        // geometry, extract the component geometries and build separate
        // features for each of them. This prevents the WKT formatter from
        // creating nested GEOMETRYCOLLECTION()'s, which break in MySQL.
        if (f.geometry.CLASS_NAME == 'OpenLayers.Geometry.Collection') {
          _.each(f.geometry.components, function(geometry) {
            var feature = new OpenLayers.Feature.Vector();
            feature.geometry = geometry;
            features.push(feature);
          });
        }

        else features.push(f);

      }
    });

    // Convert to WKT.
    if (!_.isEmpty(features)) {
      var formatWKT = new OpenLayers.Format.WKT();
      var wkt = formatWKT.write(features);
    }

    // Update the form.
    Neatline.execute('editor:record:setCoverage', wkt);

  },


  /**
   * Delete a feature.
   *
   * @param {Object} feature: The selected feature.
   */
  removeFeature: function(feature) {
    this.controls.remove.unselectFeature(feature);
    this.editLayer.destroyFeatures([feature]);
    this.publish();
  },


  /**
   * Remove a layer by model.
   *
   * @param {Object} model: The model of the deleted record.
   */
  removeLayerByModel: function(model) {
    var layer = this.getLayer(model);
    if (layer) this.removeLayer(layer);
  },


  /**
   * Remove a layer from the map and the `layers` tracker.
   *
   * @param {Object} layer: The layer.
   */
  removeLayer: function(layer) {
    this.map.removeLayer(layer);
    this.layers = _.reject(this.layers, function(l) {
      return l.nId == layer.nId;
    });
  },


  /**
   * Delete all features on the edit layer, publish empty WKT.
   */
  clear: function() {
    this.editLayer.destroyFeatures();
    this.publish();
  }


});
