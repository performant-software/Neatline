
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.AWMC', function(AWMC) {


  AWMC.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP:LAYERS',

    requests: ['AWMC'],


    /**
     * Construct an OpenStreetMap layer.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer.OSM}: The OSM layer.
     */
    AWMC: function(json) {

      var id = json.properties.id;

      var layer =  new OpenLayers.Layer.XYZ(json.title, [
        'http://a.tiles.mapbox.com/v3/'+id+'/${z}/${x}/${y}.png',
        'http://a.tiles.mapbox.com/v3/'+id+'/${z}/${x}/${y}.png',
        'http://a.tiles.mapbox.com/v3/'+id+'/${z}/${x}/${y}.png',
        'http://a.tiles.mapbox.com/v3/'+id+'/${z}/${x}/${y}.png'
      ], {
        sphericalMercator: true,
        wrapDateLine: true
      });

      return layer;

    }


  });


});
