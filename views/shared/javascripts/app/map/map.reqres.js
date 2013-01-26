
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Emit the OpenLayers map instance.
   *
   * @return {Object}: The map.
   */
  Neatline.reqres.addHandler('map:getMap', function() {
    return Map.__view.map;
  });


  /**
   * Emit the current records collection.
   *
   * @return {Object}: The collection.
   */
  Neatline.reqres.addHandler('map:getRecords', function() {
    return Map.__view.records;
  });


});
