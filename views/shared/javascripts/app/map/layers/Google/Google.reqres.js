
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Google layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.Google', function(
  Google, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a Google layer.
   *
   * @param {Object} json: The layer definition.
   * @return {OpenLayers.Layer.Google}: The Google layer.
   */
  Neatline.reqres.addHandler('map:layers:Google', function(json) {
    switch (json.properties.provider) {
      case 'physical':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.TERRAIN
        });
        break;
      case 'streets':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.ROADMAP,
          numZoomLevels: 25
        });
        break;
      case 'satellite':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.SATELLITE,
          numZoomLevels: 25
        });
        break;
      case 'hybrid':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.HYBRID,
          numZoomLevels: 25
        });
        break;
    }
  });


});
