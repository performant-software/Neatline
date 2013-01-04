
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  /**
   * Get or fetch a record from the collection.
   *
   * @param {Number} id: The record id.
   * @param {Function} cb: A callback.
   */
  Neatline.reqres.addHandler('editor:records:fetch', function(id, cb) {
    Records.__collection.getOrFetch(id, cb);
  });


});
