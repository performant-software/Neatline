
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.XYZ', function(XYZ) {


  XYZ.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP:LAYERS',

    requests: ['XYZ'],


    /**
     * Construct a XYZ layer.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer.XYZ}: The XYZ layer.
     */
    XYZ: function(json) {

      var id = json.properties.id;

      var layer =  new OpenLayers.Layer.XYZ(
        json.title,
        json.properties.urls,
        {
          sphericalMercator: true,
          wrapDateLine: true
        }
      );

      return layer;

    }


  });


});
