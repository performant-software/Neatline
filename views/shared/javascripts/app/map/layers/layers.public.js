
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Layers public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers', function(
  Layers, Neatline, Backbone, Marionette, $, _) {


  /**
   * Dispatch a layer request to the appropriate handler. If no handler
   * exists for the passed type and the request fails, return null.
   *
   * @param {Object} json: The layer definition.
   * @return {OpenLayers.Layer|null}: The layer.
   */
  var getLayer = function(json) {
    try {
      return Neatline.request('LAYERS:'+json.type, json);
    } catch (e) {
      return null;
    }
  };
  Neatline.reqres.addHandler('LAYERS:getLayer', getLayer);


});
