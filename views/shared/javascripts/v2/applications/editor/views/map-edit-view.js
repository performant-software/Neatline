
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
  this.editFeature = null;

  // Point.
  var point = new OpenLayers.Control.DrawFeature(
                  this.editLayer, OpenLayers.Handler.Point, {
                  featureAdded: _.bind(this.publish,this) });

  // Line.
  var line =  new OpenLayers.Control.DrawFeature(
                  this.editLayer, OpenLayers.Handler.Path, {
                  featureAdded: _.bind(this.publish,this) });

  // Polygon.
  var poly =  new OpenLayers.Control.DrawFeature(
                  this.editLayer, OpenLayers.Handler.Polygon, {
                  featureAdded: _.bind(this.publish,this) });

  // Regular.
  var reg =   new OpenLayers.Control.DrawFeature(
                  this.editLayer, OpenLayers.Handler.RegularPolygon, {
                  featureAdded: _.bind(this.publish,this) });

  // Modify.
  var edit =  new OpenLayers.Control.ModifyFeature(this.editLayer, {
                  onModification: _.bind(this.publish,this)});

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


  // -----------------
  // Set control mode.
  // -----------------

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

  // Set sides.
  this.controls[3].handler.sides = settings.sides;


  // ----------------------------
  // Apply modification settings.
  // ----------------------------

  // Rotate.
  if (_.contains(settings.modify, 'rotate'))
    this.controls[4].mode |= OpenLayers.Control.ModifyFeature.ROTATE;

  // Resize.
  if (_.contains(settings.modify, 'resize'))
    this.controls[4].mode |= OpenLayers.Control.ModifyFeature.RESIZE;

  // Drag.
  if (_.contains(settings.modify, 'drag'))
    this.controls[4].mode |= OpenLayers.Control.ModifyFeature.DRAG;


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
