
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Instantiate the map view and records collection.
   *
   * @return void.
   */
  Map.addInitializer(function() {
    this.collection = new Neatline.Collections.Records();
    this.view = new Neatline.Map.Views.Map({ el: '#neatline-map' });
  });


});
