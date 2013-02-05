
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Google Satellite layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.GoogleSatellite', function(
  GoogleSatellite, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a GoogleSatellite layer.
   *
   * @return {OpenLayers.Layer.Google}: The Google Satellite layer.
   */
  Neatline.reqres.addHandler('map:layers:GoogleSatellite', function() {
    return new OpenLayers.Layer.Google('Google Satellite', {
      type: google.maps.MapTypeId.SATELLITE
    });
  });


});
