
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list command handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  /**
   * Execute search query.
   *
   * @param {Object} params: Query parameters.
   */
  Neatline.commands.addHandler('editor:loadRecords', function(params) {
    Records.__collection.update(params, function(records) {
      Records.__view.ingest(records);
    });
  });


});
