
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Google Streets layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.GoogleStreets', function(
  GoogleStreets, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a GoogleStreets layer.
   *
   * @return {OpenLayers.Layer.Google}: The Google Streets layer.
   */
  Neatline.reqres.addHandler('map:layers:GoogleStreets', function() {
    return new OpenLayers.Layer.Google('Google Streets', {
      type: google.maps.MapTypeId.ROADMAP
    });
  });


});
