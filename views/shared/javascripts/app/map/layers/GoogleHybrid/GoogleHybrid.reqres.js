
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Google Hybrid layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.GoogleHybrid', function(
  GoogleHybrid, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a GoogleHybrid layer.
   *
   * @return {OpenLayers.Layer.Google}: The Google Hybrid layer.
   */
  Neatline.reqres.addHandler('map:layers:GoogleHybrid', function() {
    return new OpenLayers.Layer.Google('Google Hybrid', {
      type: google.maps.MapTypeId.HYBRID
    });
  });


});
