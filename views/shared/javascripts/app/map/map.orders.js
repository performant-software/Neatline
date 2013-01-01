
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map command handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Focus the map on the data extent for a record, identified by id.
   *
   * @param {Number} id: The record id.
   */
  Neatline.commands.addHandler('map:focusById', function(id) {
    Map.__collection.getOrFetch(id, function(model) {
      Map.__view.focusByModel(model);
    });
  });


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: The record model.
   */
  Neatline.commands.addHandler('map:focusByModel', function(model) {
    Map.__view.focusByModel(model);
  });


});
