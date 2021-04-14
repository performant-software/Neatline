
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.Stamen', function(Stamen) {


  Stamen.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP:LAYERS',

    requests: ['Stamen'],


    /**
     * Construct a Stamen layer - http://maps.stamen.com/.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer.Stamen}: The Stamen layer.
     */
    Stamen: function(json) {
      var layer = new OpenLayers.Layer.Stamen(json.properties.provider);
      
      // fix for new stamen schema http://maps.stamen.com/
      var newStamenUrl = "//stamen-tiles-${S}.a.ssl.fastly.net/" + json.properties.provider + "/${z}/${x}/${y}.png" 
      var subdomains = ["a","b","c","d"];
      var Urls = [];
      if (-1 < newStamenUrl.indexOf("${S}")) for (var a = 0; a < subdomains.length; a++) Urls.push(newStamenUrl.replace("${S}", subdomains[a])); else Urls.push(newStamenUrl);
      layer.setUrl(Urls);
      
      layer.name = json.title;
      return layer;
    }


  });


});
