
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * WMS layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.WMS', function(
  WMS, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a WMS layer.
   *
   * @param {Object} options: Configuration options.
   * @return {OpenLayers.Layer.WMS}: The WMS layer.
   */
  Neatline.reqres.addHandler('map:layers:WMS', function(options) {
    return new OpenLayers.WMS(options.name, options.address, {
      layers: options.layers
    });
  });


});
