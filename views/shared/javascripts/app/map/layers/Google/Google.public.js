
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.Google', function(Google) {


  Google.ID = 'MAP:LAYERS:Google';


  Google.addInitializer(function() {

    /**
     * Construct a Google layer.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer.Google}: The Google layer.
     */
    var layer = function(json) {
      switch (json.properties.provider) {
        case 'physical':
          return new OpenLayers.Layer.Google(json.title, {
            type: google.maps.MapTypeId.TERRAIN
          });
        case 'streets':
          return new OpenLayers.Layer.Google(json.title, {
            type: google.maps.MapTypeId.ROADMAP,
            numZoomLevels: 25
          });
        case 'satellite':
          return new OpenLayers.Layer.Google(json.title, {
            type: google.maps.MapTypeId.SATELLITE,
            numZoomLevels: 25
          });
        case 'hybrid':
          return new OpenLayers.Layer.Google(json.title, {
            type: google.maps.MapTypeId.HYBRID,
            numZoomLevels: 25
          });
      }
    };
    Neatline.reqres.setHandler(Google.ID, layer);

  });


});
