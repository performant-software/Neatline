
/**
 * Monkey patch editing methods into the public map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

_.extend(Neatline.Map.View.prototype, {

  /**
   * Construct edit layer and controls for a record.
   *
   * @param {Object} model: The record model.
   */
  startEdit: function(model) {


    // Acquire and prepare the editing layer:
    // ------------------------------------------------------------------------

    // If a vector layer already exists, use it as the edit layer; otherwise,
    // create a new layer from the model:

    this.editLayer = this.getOrCreateVectorLayer(model);

    // Set an arbitrarily high z-index value on the edit layer to ensure that
    // it can always be manipulated by the editing controls:

    this.map.raiseLayer(this.editLayer, 9999);

    // Reset the layers array on the highlight/select controls. This ensures
    // that the edit layer is always "selectable" for modification.

    this.updatePublicControls();

    // Flip on the `neatline.frozen` flag on the edit layer to exempt it from
    // the regular garbage collection process:

    this.editLayer.neatline.frozen = true;


    // Create the editing controls:
    // ------------------------------------------------------------------------

    this.controls = {

      // DRAW POINT
      point: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Point, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // DRAW LINE
      line: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Path, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // DRAW POLYGON
      poly: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Polygon, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // DRAW REGULAR POLYGON
      regPoly: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.RegularPolygon, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // DRAW SVG
      svg: new OpenLayers.Control.DrawFeature(
        this.editLayer, OpenLayers.Handler.Geometry, {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // MODIFY SHAPE
      edit: new OpenLayers.Control.ModifyFeature(
        this.editLayer, {
          onModification: _.bind(this.publishWKT, this)
        }
      ),

      // DELETE SHAPE
      remove: new OpenLayers.Control.ModifyFeature(
        this.editLayer, {
          onModificationStart: _.bind(this.removeFeature, this)
        }
      )

    };

    var view = this;

    for (var key in this.controls) {
      if (["point", "line", "poly"].includes(key)) {
        var control = this.controls[key];
        control.events.register("activate", null, function() {
          view.highlightControl.deactivate();
          view.selectControl.deactivate();
        });
        control.events.register("deactivate", null, function() {
          view.highlightControl.activate();
          view.selectControl.activate();
        });
      }
    }

    this.map.addControls(_.values(this.controls));

  },


  /**
   * Remove editing controls and release the edit layer.
   */
  endEdit: function() {

    // Reset controls.
    this.deactivateEditorControls();
    this.removeEditorControls();

    // Release edit layer.
    if (this.editLayer) {
      this.editLayer.neatline.frozen = false;
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


    this.settings = settings;


    // Reset the controls editing and cursor controls.
    // ------------------------------------------------------------------------

    this.deactivateEditorControls();


    // Set the active current editing mode.
    // ------------------------------------------------------------------------

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
        this.controls.edit.activate();
        break;

      case 'rotate':
        this.controls.edit.mode = modes.ROTATE;
        this.controls.edit.activate();
        break;

      case 'resize':
        this.controls.edit.mode = modes.RESIZE;
        this.controls.edit.activate();
        break;

      case 'drag':
        this.controls.edit.mode = modes.DRAG;
        this.controls.edit.activate();
        break;

      case 'remove':
        this.controls.remove.activate();
        break;

    }


    // Update the regular polygon settings.
    // ------------------------------------------------------------------------

    // SNAP ANGLE
    var snap = Number(settings.poly.snap) || 0;
    this.controls.regPoly.handler.snapAngle = Math.max(0, snap);

    // SIDES
    var sides = Number(settings.poly.sides) || 0;
    this.controls.regPoly.handler.sides = Math.max(3, sides);

    // IRREGULAR
    this.controls.regPoly.handler.irregular = settings.poly.irreg;


  },


  /**
   * Update the WKT rendered by the `Geometry` handler.
   *
   * @param {String} wkt: The WKT.
   */
  updateSvgWkt: function(wkt) {
    var geometry = OpenLayers.Geometry.fromWKT(wkt);
    this.controls.svg.handler.setGeometry(geometry);
  },


  /**
   * Update the model on the edit layer, update the edit layer's id key in the
   * id-to-layer tracker object.
   *
   * @param {Object} model: The updated model.
   */
  updateModel: function(model) {

    // If the `id` of the form model has changed since the last `change` event
    // (eg, when the model is saved for the first time, and the concrete id
    // is returned from the server), update the key used to identify the layer
    // in the `layers.vector` hash.

    if (model.hasChanged('id')) {
      delete this.layers.vector[model.previous('id')];
      this.layers.vector[model.id] = this.editLayer;
    }

    // Manifest the new coverage.
    if (!this.controls.edit.active) {

      // Clear existing features.
      this.editLayer.destroyFeatures();
      var coverage = model.get('coverage');

      if (_.isString(coverage)) {

        // Add new features, if any can be extracted.
        var features = this.formatWkt.read(model.get('coverage'));
        if (features) this.editLayer.addFeatures(features);

      }

    }

    // Update the edit layer model to match the form model.
    this.editLayer.neatline.model.set(model.changedAttributes());

    // Rebuild the style map.
    this.editLayer.styleMap = model.getStyleMap();
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

      if (!f._sketch) { // Don't save editing drag handles.

        // If the feature is a collection, flatten it to an array of regular,
        // non-collection features. This prevents layers with multiple
        // features from being serialized as nested collections, which can't
        // be stored in MySQL `GEOMETRY` columns.

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
    Neatline.execute('EDITOR:RECORD:setWkt', wkt);

  },


  /**
   * Deactivate all edit controls.
   */
  deactivateEditorControls: function() {
    _.each(this.controls, function(control) {
      control.deactivate();
    });
  },


  /**
   * Remove all edit controls from the map.
   */
  removeEditorControls: function() {
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
   * Clear the edit layer, publish empty WKT.
   */
  clearEditLayer: function() {
    this.editLayer.destroyFeatures();
    this.publishWKT();
  }


});
