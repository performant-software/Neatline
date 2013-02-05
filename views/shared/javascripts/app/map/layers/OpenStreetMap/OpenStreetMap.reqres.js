
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * OpenStreetMap layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.OpenStreetMap', function(
  OpenStreetMap, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct an OpenStreetMap layer.
   *
   * @return {OpenLayers.Layer.OSM}: The OSM layer.
   */
  Neatline.reqres.addHandler('map:layers:OpenStreetMap', function() {
    return new OpenLayers.Layers.OSM();
  });


});
