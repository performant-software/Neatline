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
  var layer = this.getLayerByModel(model);

  // Point.
  var point = new OpenLayers.Control.DrawFeature(layer,
                  OpenLayers.Handler.Point);

  // Line.
  var line =  new OpenLayers.Control.DrawFeature(layer,
                  OpenLayers.Handler.Path);

  // Polygon.
  var poly =  new OpenLayers.Control.DrawFeature(layer,
                  OpenLayers.Handler.Polygon);

  // Regular.
  var reg =   new OpenLayers.Control.DrawFeature(layer,
                  OpenLayers.Handler.RegularPolygon);

  // Edit.
  var edit =  new OpenLayers.Control.ModifyFeature(layer);

  // Store and add controls.
  this.controls = [point, line, poly, reg, edit];
  this.map.addControls(this.controls);

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
  _.each(this.controls, function(c) { c.deactivate(); });
  this.controls[4].mode = OpenLayers.Control.ModifyFeature.RESHAPE;

  // Set control.
  switch (settings.control) {

    case 'point':
      this.controls[0].activate();
      break;

    case 'line':
      this.controls[1].activate();
      break;

    case 'poly':
      this.controls[2].activate();
      break;

    case 'regPoly':
      this.controls[3].activate();
      break;

    case 'modify':
      this.controls[4].activate();
      break;

  }

  // Rotate.
  if (_.contains(settings.modify, 'rotate'))
    this.controls[4].mode |= OpenLayers.Control.ModifyFeature.ROTATE;

  // Resize.
  if (_.contains(settings.modify, 'resize'))
    this.controls[4].mode |= OpenLayers.Control.ModifyFeature.RESIZE;

  // Drag.
  if (_.contains(settings.modify, 'drag'))
    this.controls[4].mode |= OpenLayers.Control.ModifyFeature.DRAG;

  // Set sides.
  this.controls[3].handler.sides = settings.sides;

};
