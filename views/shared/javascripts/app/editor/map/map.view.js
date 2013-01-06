
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
   * Construct editing controls for record.
   *
   * @param {Object} model: The record model.
   */
  startEdit: function(model) {

    // Get the layer.
    var layer = this.getLayerByModel(model);
    this.editLayer = layer ? layer : this.buildLayer(model);

    this.controls = {

      point: new OpenLayers.Control.DrawFeature(this.editLayer,
        OpenLayers.Handler.Point, {
          featureAdded: _.bind(this.publish,this)
      }),

      line: new OpenLayers.Control.DrawFeature(this.editLayer,
        OpenLayers.Handler.Path, {
          featureAdded: _.bind(this.publish,this)
      }),

      poly: new OpenLayers.Control.DrawFeature(this.editLayer,
        OpenLayers.Handler.Polygon, {
          featureAdded: _.bind(this.publish,this)
      }),

      reg: new OpenLayers.Control.DrawFeature(this.editLayer,
        OpenLayers.Handler.RegularPolygon, {
          featureAdded: _.bind(this.publish,this)
      }),

      edit: new OpenLayers.Control.ModifyFeature(this.editLayer, {
          onModification: _.bind(this.publish,this)
      }),

      del: new OpenLayers.Control.ModifyFeature(this.editLayer, {
          onModificationStart: _.bind(this.remove,this)
      })

    };

    // Add controls.
    _.each(this.controls, _.bind(function(val,key) {
      this.map.addControl(val);
    }, this));

  },


  /**
   * Deactivate and remove all editing controls.
   */
  endEdit: function() {

    // Deactivate and remove controls.
    _.each(this.controls, _.bind(function(val,key) {
      val.deactivate();
      this.map.removeControl(val);
    }, this));

    // Reactivate controls.
    this.activateControls();

  },



  /**
   * Apply a settings combination to the controls. Based on:
   * http://openlayers.org/dev/examples/modify-feature.html
   *
   * @param {Object} settings: Settings for the controls.
   */
  update: function(settings) {


    // Reactivate controls.
    this.activateControls();

    // Deactivate all controls, reset modify mode.
    _.each(this.controls, function(val,key) { val.deactivate(); });
    this.controls.edit.mode = OpenLayers.Control.ModifyFeature.RESHAPE;


    // Set control mode.
    // -----------------

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

      case 'regPoly':
        this.controls.reg.activate();
        break;

      case 'modify':
        this.deactivateControls();
        this.controls.edit.activate();
        break;

      case 'remove':
        this.controls.del.activate();
        break;

    }


    // Set regular polygon settings.
    // -----------------------------

    // Sides.
    var sides = _.isNaN(settings.poly.sides) ? 0 : settings.poly.sides;
    this.controls.reg.handler.sides = Math.max(3, sides);

    // Snap angle.
    var snap = _.isNaN(settings.poly.snap) ? 0 : settings.poly.snap;
    this.controls.reg.handler.snapAngle = parseFloat(snap);

    // Irregular.
    this.controls.reg.handler.irregular = settings.poly.irreg;


    // Apply modification settings.
    // ----------------------------

    // Rotate.
    if (_.contains(settings.modify, 'rotate'))
      this.controls.edit.mode |= OpenLayers.Control.ModifyFeature.ROTATE;

    // Resize.
    if (_.contains(settings.modify, 'resize'))
      this.controls.edit.mode |= OpenLayers.Control.ModifyFeature.RESIZE;

    // Drag.
    if (_.contains(settings.modify, 'drag'))
      this.controls.edit.mode |= OpenLayers.Control.ModifyFeature.DRAG;

  },


  /**
   * Publish updated KML.
   */
  publish: function() {

    // Filter out editing geometry.
    var features = _.filter(this.editLayer.features, function(f) {
      return !f._sketch;
    });

    // Write WKT.
    var formatWKT = new OpenLayers.Format.WKT();
    var wkt = formatWKT.write(features);

    // Publish.
    Neatline.vent.trigger('editor:geometry:newCoverage', wkt);

  },


  /**
   * Delete a feature.
   *
   * @param {Object} feature: The selected feature.
   */
  remove: function(feature) {
    this.controls.del.unselectFeature(feature);
    this.editLayer.destroyFeatures([feature]);
    this.publish();
  },


  /**
   * Remove a layer by model.
   *
   * @param {Object} model: The model of the deleted record.
   */
  removeLayerByModel: function(model) {

    // Get layer for the model.
    var layer = this.getLayerByModel(model);
    if (!layer) return;

    // Remove from map.
    this.map.removeLayer(layer);

    // Remove from `layers`.
    this.layers = _.reject(this.layers, function(layer) {
      return layer.nId == model.get('id');
    });

  }


});
