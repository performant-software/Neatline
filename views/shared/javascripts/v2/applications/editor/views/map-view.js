/**
 * Monkey patches to Neatline map view.
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
 * @param {Object} setttings: Settings for the controls.
 *
 * @return void.
 */
Neatline.Views.Map.prototype.edit = function(model, settings) {

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

  // Add controls.
  // this.map.addControls([layer, point, line, poly, reg, edit]);

  // Apply starting settings.
  this.editControls(settings);

};

/*
 * Apply a settings combination to the controls.
 *
 * @param {Object} setttings: Settings for the controls.
 *
 * @return void.
 */
Neatline.Views.Map.prototype.editControls = function(settings) {

};
