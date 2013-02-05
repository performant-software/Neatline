
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Stamen layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.Stamen', function(
  Stamen, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a Stamen layer - http://maps.stamen.com/.
   *
   * @param {Object} options: Configuration options.
   * @return {OpenLayers.Layer.Stamen}: The Stamen layer.
   */
  Neatline.reqres.addHandler('map:layers:Stamen', function(options) {
    return new OpenLayers.Layer.Stamen(options.provider);
  });


});
