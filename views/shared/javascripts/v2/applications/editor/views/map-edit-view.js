
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Injects editor-endemic methods into Neatline map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/*
 * Construct editing controls for record.
 *
 * @param {Object} model: The record model.
 *
 * @return void.
 */
Neatline.Views.Map.prototype.edit = function(model) {

  // Get the vector layer for the model.
  this.editLayer = this.getLayerByModel(model);

  this.controls = {

    point:  new OpenLayers.Control.DrawFeature(this.editLayer,
                OpenLayers.Handler.Point, {
                  featureAdded: _.bind(this.publish,this)
                }),

    line:   new OpenLayers.Control.DrawFeature(this.editLayer,
                OpenLayers.Handler.Path, {
                  featureAdded: _.bind(this.publish,this)
                }),

    poly:   new OpenLayers.Control.DrawFeature(this.editLayer,
                OpenLayers.Handler.Polygon, {
                  featureAdded: _.bind(this.publish,this)
                }),

    reg:    new OpenLayers.Control.DrawFeature(this.editLayer,
                OpenLayers.Handler.RegularPolygon, {
                  featureAdded: _.bind(this.publish,this),
                  handlerOptions: {
                    snapAngle: 5
                  }
                }),

    edit:   new OpenLayers.Control.ModifyFeature(this.editLayer,
                { onModification: _.bind(this.publish,this) })

  };

  // Add controls.
  _.each(this.controls, _.bind(function(val,key) {
    this.map.addControl(val);
  }, this));

};


/*
 * Apply a settings combination to the controls. Based on:
 * http://openlayers.org/dev/examples/modify-feature.html
 *
 * @param {Object} setttings: Settings for the controls.
 *
 * @return void.
 */
Neatline.Views.Map.prototype.update = function(settings) {


  // Deactivate all controls, reset modify mode.
  _.each(this.controls, function(val,key) { val.deactivate(); });
  this.controls.edit.mode = OpenLayers.Control.ModifyFeature.RESHAPE;


  // -----------------
  // Set control mode.
  // -----------------

  switch (settings.control) {

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
      this.controls.edit.activate();
      break;

  }


  // -----------------------------
  // Set regular polygon settings.
  // -----------------------------

  // Sides.
  var sides = _.isNaN(settings.sides) ? 0 : settings.sides;
  this.controls.reg.handler.sides = Math.max(3, sides);

  // Snap angle.
  var snap = _.isNaN(settings.snap) ? 0 : settings.snap;
  this.controls.reg.handler.snapAngle = parseFloat(snap);

  // Irregular.
  this.controls.reg.handler.irregular = settings.irreg;


  // ----------------------------
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

  console.log('test');

};


/*
 * Publish updated KML.
 *
 * @return void.
 */
Neatline.Views.Map.prototype.publish = function() {

  // Filter out editing geometry.
  var features = _.filter(this.editLayer.features, function(f) {
    return !f._sketch;
  });

  // Write KML, publish.
  var formatter = new OpenLayers.Format.KML();
  var kml = formatter.write(features);
  Editor.vent.trigger('map:newCoverage', kml);

};
