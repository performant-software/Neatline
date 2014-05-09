
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.WMS', function(WMS) {


  WMS.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP:LAYERS',

    requests: ['WMS'],


    /**
     * Construct a WMS layer.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer.WMS}: The WMS layer.
     */
    WMS: function(json) {
      return new OpenLayers.Layer.WMS(
        json.title,
        json.properties.address,
        {
          layers: json.properties.layers
        }
      );
    }


  });


});
