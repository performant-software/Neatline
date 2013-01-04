
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  /**
   * Load a record form.
   *
   * @param {Number} id: The record id.
   */
  var loadForm = function(id) {
    Neatline.request('editor:records:fetch', id, function(r) {
      Record.__view.show(r);
    });
  };


  Neatline.vent.on('editor:router:#records/:id', loadForm);


});
