
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

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
   * Initialize editor-specific state trackers.
   */
  __initEditor: function() {
    this.editLayer    = null;
    this.isModifying  = false;
  },


  /**
   * Construct editing controls for record.
   *
   * @param {Object} model: The record model.
   */
  startEdit: function(model) {


    // If a layer already exists on the map for the model that is being
    // edited (which would be the case, for instance, if the user opened
    // the edit form by just clicking on a map vector), use the existing
    // layer as the edit layer. If a layer does not exist, build a new
    // layer from the model and add it to the map.

    this.editLayer = this.vectorLayers[model.get('id')];
    if (!this.editLayer) this.editLayer = this.buildVectorLayer(model);

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

      // Draw SVG-backed geometry.
      svg: new OpenLayers.Control.DrawFeature(
        this.editLayer,
        OpenLayers.Handler.Geometry,
        {
          featureAdded: _.bind(this.publishWKT, this)
        }
      ),

      // Modify/Rotate/Resize/Drag shape.
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
   * Remove the editing controls.
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


    this.settings = settings;


    // Reset map.
    // ----------

    this.isModifying = false;

    this.activateControls();
    _.each(this.controls, function(control) {
      control.deactivate();
    });


    // Set edit mode.
    // --------------

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


    // Set regular polygon options.
    // ----------------------------

    // Sides.
    var sides = _.isNaN(settings.poly.sides) ? 0 : settings.poly.sides;
    this.controls.regPoly.handler.sides = Math.max(3, sides);

    // Snap angle.
    var snap = _.isNaN(settings.poly.snap) ? 0 : settings.poly.snap;
    this.controls.regPoly.handler.snapAngle = parseFloat(snap);

    // Irregular.
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

    // Then, flip on the `isModifying` state tracker and force the edit
    // layer to the top of the stack of layers on the map, which ensures
    // that the geometries on the layer can be selected and manipulated
    // by the `edit` control.

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
   * Update `nModel` and `nId` on the edit layer.
   *
   * @param {Object} model: The updated model.
   */
  updateModel: function(model) {

    // Replace the model.
    this.editLayer.nId = model.get('id');
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
      if (!f._sketch) {

        // Split collections into individual features.
        if (f.geometry.CLASS_NAME == 'OpenLayers.Geometry.Collection') {
          _.each(f.geometry.components, function(geo) {
            features.push(new OpenLayers.Feature.Vector(geo));
          });
        }

        else features.push(f);

      }
    });

    // Convert to WKT.
    if (!_.isEmpty(features)) {
      wkt = new OpenLayers.Format.WKT().write(features);
    }

    // Update the form.
    Neatline.execute('RECORD:setCoverage', wkt);

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
   * Remove a layer by model.
   *
   * @param {Object} model: The model of the layer to remove.
   */
  removeLayerByModel: function(model) {
    var layer = this.vectorLayers[model.get('id')];
    if (layer) this.removeLayer(layer);
  },


  /**
   * Remove a layer from the map and the `layers` tracker.
   *
   * @param {Object} layer: The layer.
   */
  removeLayer: function(layer) {
    this.map.removeLayer(layer);
    delete this.vectorLayers[layer.nId];
  },


  /**
   * Delete all features on the edit layer, publish empty WKT.
   */
  clearLayer: function() {
    this.editLayer.destroyFeatures();
    this.publishWKT();
  }


});
