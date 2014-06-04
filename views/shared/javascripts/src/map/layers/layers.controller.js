
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers', function(Layers) {


  Layers.Controller = Neatline.Shared.Controller.extend({


    slug: 'MAP:LAYERS',

    requests: ['getLayer'],


    /**
     * Dispatch a layer request to the appropriate handler. If no handler
     * exists for the passed type and the request fails, return undefined.
     *
     * @param {Object} json: The layer definition.
     * @return {OpenLayers.Layer|undefined}: The layer.
     */
    getLayer: function(json) {
      return Neatline.request('MAP:LAYERS:'+json.type, json);
    }


  });


});
