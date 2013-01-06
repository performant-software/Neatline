
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
   * Show a record form.
   *
   * @param {Number} id: The record id.
   */
  var showForm = function(id) {
    Neatline.request('editor:records:getModel', id, function(r) {
      Record.__view.show(r);
    });
  };


  /**
   * Close a record form.
   */
  var closeForm = function(id) {
    if (Record.__view.open) Record.__view.close();
  };


  /**
   * Update coverage textarea.
   *
   * @param {String} coverage: The new WKT.
   */
  var updateCoverage = function(coverage) {
    Record.__view.model.set('coverage', coverage);
  };


  Neatline.vent.on('editor:router:#records/:id', showForm);
  Neatline.vent.on('editor:router:before', closeForm);
  Neatline.vent.on('editor:map:newCoverage', updateCoverage);


});
