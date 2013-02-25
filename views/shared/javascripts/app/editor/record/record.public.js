
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the form to the editor container.
   */
  var render = function() {
    Record.__view.showIn(Neatline.request('editor:getContainer'));
  };

  Neatline.commands.addHandler('editor:record:render', render);


  /**
   * Show form for an existing record.
   *
   * @param {Number} id: The record id.
   */
  var showById = function(id) {
    id = parseInt(id, 10);
    Neatline.request('editor:records:getModel', id, function(record) {
      Record.__view.show(record);
    });
  };

  Neatline.commands.addHandler('editor:record:showById', showById);


  /**
   * Show form for a new record.
   */
  var showNew = function() {
    var record = new Neatline.Shared.Record.Model();
    Record.__view.show(record);
    Record.__view.resetTabs();
  };

  Neatline.commands.addHandler('editor:record:showNew', showNew);


  /**
   * Update coverage textarea.
   *
   * @param {String} coverage: The new WKT.
   */
  var setCoverage = function(coverage) {
    Record.__view.model.set('coverage', coverage);
  };

  Neatline.commands.addHandler('editor:record:setCoverage', setCoverage);


  /**
   * Deactivate the form.
   */
  var deactivate = function() {
    if (Record.__view.open) Record.__view.deactivate();
  };

  Neatline.commands.addHandler('editor:record:deactivate', deactivate);
  Neatline.vent.on('editor:router:before', deactivate);


});
