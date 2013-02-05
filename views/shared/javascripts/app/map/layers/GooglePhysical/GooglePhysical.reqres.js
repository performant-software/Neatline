
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Google Physical layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.GooglePhysical', function(
  GooglePhysical, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a GooglePhysical layer.
   *
   * @return {OpenLayers.Layer.Google}: The Google Physical layer.
   */
  Neatline.reqres.addHandler('map:layers:GooglePhysical', function() {
    return new OpenLayers.Layer.Google('Google Physical', {
      type: google.maps.MapTypeId.TERRAIN
    });
  });


});
