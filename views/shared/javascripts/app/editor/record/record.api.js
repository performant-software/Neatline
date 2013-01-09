
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


  // ======================================================================

  /**
   * Show form for an existing record.
   *
   * @param {Number} id: The record id.
   */
  var showById = function(id) {
    Neatline.request('editor:records:getModel', id, function(record) {
      Record.__view.show(record);
    });
  };

  Neatline.commands.addHandler('editor:record:showById', showById);
  Neatline.vent.on('editor:router:#records/:id', showById);


  // ======================================================================

  /**
   * Show form for a new record.
   */
  var showNew = function() {

    // Create new record.
    var record = new Neatline.Shared.Record.Model();

    // Populate id.
    record.save(null, {
      success: function() {
        Record.__view.show(record);
      }
    });

  };

  Neatline.commands.addHandler('editor:record:showNew', showNew);
  Neatline.vent.on('editor:router:#records/add', showNew);


  // ======================================================================

  /**
   * Close a record form.
   */
  var close = function() {
    if (Record.__view.open) Record.__view.close();
  };

  Neatline.commands.addHandler('editor:record:close', close);
  Neatline.vent.on('editor:router:before', close);


  // ======================================================================

  /**
   * Update coverage textarea.
   *
   * @param {String} coverage: The new WKT.
   */
  var setCoverage = function(coverage) {
    Record.__view.model.set('coverage', coverage);
  };

  Neatline.commands.addHandler('editor:record:setCoverage', setCoverage);
  Neatline.vent.on('editor:map:newCoverage', setCoverage);

  // ======================================================================


});
