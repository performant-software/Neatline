
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
      layer.name = json.title;
      return layer;
    }


  });


});
