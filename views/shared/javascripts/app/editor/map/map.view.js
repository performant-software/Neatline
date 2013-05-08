
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Monkey patch editing methods into the public map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

_.extend(Neatline.Map.View.prototype, {


  /**
   * Initialize editor-specific state trackers.
   */
  __initEditor: function() {
    this.editLayer = null;
    this.modifying = false;
  },


  /**
   * Construct edit layer and controls for a record.
   *
   * @param {Object} model: The record model.
   */
  startEdit: function(model) {

    // Get or create a layer for the model.
    this.editLayer = this.layers.vector[model.id]
    if (!this.editLayer) this.editLayer = this.buildVectorLayer(model);

    // Freeze the edit layer.
    this.editLayer.nFrozen = true;

    this.controls = {

      // Draw Point.
      point: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Point, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw Line.
      line: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Path, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw Polygon.
      poly: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Polygon, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw Regular Polygon.
      regPoly: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.RegularPolygon, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw SVG.
      svg: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Geometry, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Modify Shape.
      edit: new OpenLayers.Control.ModifyFeature(
        this.editLayer, {
          onModification: _.bind(this.publishWKT, this)
        }
      ),

      // Delete Shape.
      remove: new OpenLayers.Control.ModifyFeature(
        this.editLayer, {
          onModificationStart: _.bind(this.removeFeature, this)
        }
      )

    };

    // Add the controls.
    this.map.addControls(_.values(this.controls));

  },


  /**
   * Remove editing controls and release the edit layer.
   */
  endEdit: function() {

    // Reset controls.
    this.removeEditControls();
    this.deactivateEditControls();
    this.activateControls();

    // Release edit layer.
    if (this.editLayer) {
      this.editLayer.nFrozen = false;
      this.editLayer = null;
    }

  },



  /**
   * Apply a settings combination to the controls. Based on:
   * http://openlayers.org/dev/examples/modify-feature.html
   *
   * @param {Object} settings: Settings for the controls.
   */
  updateEdit: function(settings) {

    // (1) Reset the map to its default state.

    this.modifying = false;
    this.deactivateEditControls();
    this.activateControls();

    // (2) Apply the active editing mode.

    var modes = OpenLayers.Control.ModifyFeature;

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
        this.controls.edit.mode = modes.RESHAPE;
        this.activateModifying();
        break;

      case 'rotate':
        this.controls.edit.mode = modes.ROTATE;
        this.activateModifying();
        break;

      case 'resize':
        this.controls.edit.mode = modes.RESIZE;
        this.activateModifying();
        break;

      case 'drag':
        this.controls.edit.mode = modes.DRAG;
        this.activateModifying();
        break;

      case 'remove':
        this.controls.remove.activate();
        break;

    }

    // (3) Update the settings on the regular polygon control.

    // Snap angle:
    var snap = parseFloat(settings.poly.snap) || 0;
    this.controls.regPoly.handler.snapAngle = Math.max(0, snap);

    // Sides:
    var sides = parseInt(settings.poly.sides, 10) || 0;
    this.controls.regPoly.handler.sides = Math.max(3, sides);

    // Irregular:
    this.controls.regPoly.handler.irregular = settings.poly.irreg;

  },


  /**
   * Activate the `edit` control.
   */
  activateModifying: function() {

    // First, deactivate the default cursor controls on the map and switch
    // on the `edit` control, which provides its own selection controls.

    this.deactivateControls();
    this.controls.edit.activate();

    // Then, push the edit layer to the top of the stack of vector layers.
    // Since OpenLayers automatically manages the z-indices of map layers,
    // it's possible for the edit layer to be "buried" underneath other
    // layers on the map, making it impossible to select or manipulate the
    // geometries on the edit layer. This ensures that the edit layer will
    // always be the "highest" layer on the map when one of the geometry
    // modification modes is active.

    this.modifying = true;
    this.raiseEditLayer();

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
   * Update the model on the edit layer, update the edit layer's id key
   * in the id-to-layer tracker object.
   *
   * @param {Object} model: The updated model.
   */
  updateModel: function(model) {

    // If the `id` of the model associated with the form has changed since
    // the last `change` event, update the key used to identify the edit
    // layer in the `layers.vector` hash. This is the case when the model
    // has been saved for the first time, and the original `undefined` id
    // is replaced by the new `id` of the resource on the server.

    if (model.hasChanged('id')) {
      delete this.layers.vector[model.previous('id')];
      this.layers.vector[model.id] = this.editLayer;
    }

    // Replace the model.
    this.editLayer.nModel = model;

    // Rebuild the style map.
    this.editLayer.styleMap = this.getStyleMap(model);
    this.editLayer.redraw();

  },


  /**
   * Publish updated KML.
   */
  publishWKT: function() {

    var features = [];
    var wkt = null;

    // Get features from the edit layer.
    _.each(this.editLayer.features, function(f) {

      // Don't save temporary editing geometry added by the modify feature
      // control (eg, the drag-handle points added on vertices).

      if (!f._sketch) {

        // If the feature is a collection, flatten it into an array of
        // regular, non-collection features by creating new features from
        // each of the component geometries. This prevents layers with
        // multiple features from being serialized as nested collections,
        // which can't be indexed by MySQL.

        if (f.geometry.CLASS_NAME == 'OpenLayers.Geometry.Collection') {
          _.each(f.geometry.components, function(geo) {
            features.push(new OpenLayers.Feature.Vector(geo));
          });
        }

        else features.push(f);

      }

    });

    // Convert to WKT, update the form.
    if (!_.isEmpty(features)) wkt = this.formatWkt.write(features);
    Neatline.execute('EDITOR:RECORD:setCoverage', wkt);

  },


  /**
   * Deactivate all edit controls.
   */
  deactivateEditControls: function() {
    _.each(this.controls, function(control) {
      control.deactivate();
    });
  },


  /**
   * Remove all edit controls from the map.
   */
  removeEditControls: function() {
    _.each(this.controls, _.bind(function(control) {
      this.map.removeControl(control);
    }, this));
  },


  /**
   * Delete a feature.
   *
   * @param {Object} feature: The selected feature.
   */
  removeFeature: function(feature) {
    this.controls.remove.unselectFeature(feature);
    this.editLayer.destroyFeatures([feature]);
    this.publishWKT();
  },


  /**
   * Push the edit layer to the top of the stack.
   */
  raiseEditLayer: function() {
    if (!_.isNull(this.editLayer) && this.modifying) {
      this.map.raiseLayer(this.editLayer, this.map.layers.length);
    }
  },


  /**
   * Clear the edit layer, publish empty WKT.
   */
  clearEditLayer: function() {
    this.editLayer.destroyFeatures();
    this.publishWKT();
  }


});
