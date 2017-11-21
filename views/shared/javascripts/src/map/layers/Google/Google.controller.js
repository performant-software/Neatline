
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.Google', function(Google) {


  Google.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP:LAYERS',

    requests: ['Google'],


    /**
     * Construct a Google layer.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer.Google}: The Google layer.
     */
    Google: function(json) {
      switch (json.properties.provider) {
      case 'physical':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.TERRAIN,
          numZoomLevels: 22,
          useTiltImages: false
        });
      case 'streets':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.ROADMAP,
          numZoomLevels: 22,
          useTiltImages: false
        });
      case 'satellite':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.SATELLITE,
          numZoomLevels: 21,
          useTiltImages: false
        });
      case 'hybrid':
        return new OpenLayers.Layer.Google(json.title, {
          type: google.maps.MapTypeId.HYBRID,
          numZoomLevels: 21,
          useTiltImages: false
        });
      }
    }


  });


});
