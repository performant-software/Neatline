
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
    this.editLayer    = null;
    this.isModifying  = false;
  },


  /**
   * Construct edit layer and controls for a record.
   *
   * @param {Object} model: The record model.
   */
  startEdit: function(model) {


    // If a layer already exists on the map for the model that is being
    // edited (which would be the case, for instance, if the user opened
    // the edit form by just clicking on a map vector), use the exising
    // layer as the edit layer. If a layer does not exist, build a new
    // layer form the model, freeze it, and add it to the map.

    this.editLayer = this.layers.vector[model.id]
    if (!this.editLayer) this.editLayer = this.buildVectorLayer(model);
    this.editLayer.nFrozen = true;

    // Create the set of editing controls for the edit layer.

    this.controls = {

      // Draw Point.
      point: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Point,
        {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw line.
      line: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Path,
        {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw polygon.
      poly: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Polygon,
        {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw regular polygon.
      regPoly: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.RegularPolygon,
        {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Draw SVG geometry.
      svg: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Geometry,
        {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Modify shape.
      edit: new OpenLayers.Control.ModifyFeature(
        this.editLayer,
        {
          onModification: _.bind(this.publishWKT, this)
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

    // Add the edit controls to map.
    _.each(this.controls, _.bind(function(control, key) {
      this.map.addControl(control);
    }, this));


  },


  /**
   * Remove editing controls and release the edit layer.
   */
  endEdit: function() {

    // Remove the editing controls.
    _.each(this.controls, _.bind(function(control) {
      this.map.removeControl(control);
      control.deactivate();
    }, this));

    // Unfreeze and de-reference the edit layer.
    if (this.editLayer) {
      this.editLayer.nFrozen = false;
      this.editLayer = null;
    }

    // Activate the default cursor controls.
    this.activateControls();

  },



  /**
   * Apply a settings combination to the controls. Based on:
   * http://openlayers.org/dev/examples/modify-feature.html
   *
   * @param {Object} settings: Settings for the controls.
   */
  updateEdit: function(settings) {


    // (1) Reset the map to its default state.

    this.isModifying = false;

    this.activateControls();
    _.each(this.controls, function(control) {
      control.deactivate();
    });


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

    this.isModifying = true;
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
    // is replaced by the new id of the resource on the server.

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

        // If the feature is a geometry collection, "flatten" it into a
        // series of regular, non-collection features by creating features
        // from each of the component geometries. Otherwise, it's possible
        // for layers with multiple features to be serialized as nested
        // GEOMETRYCOLLECTION's, which can't be indexed by MySQL.

        if (f.geometry.CLASS_NAME == 'OpenLayers.Geometry.Collection') {
          _.each(f.geometry.components, function(geo) {
            features.push(new OpenLayers.Feature.Vector(geo));
          });
        }

        else features.push(f);

      }

    });

    // Convert to WKT, update the form.
    if (!_.isEmpty(features)) wkt = this.formatWKT.write(features);
    Neatline.execute('RECORD:setCoverage', wkt);

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
    if (!_.isNull(this.editLayer) && this.isModifying) {
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
