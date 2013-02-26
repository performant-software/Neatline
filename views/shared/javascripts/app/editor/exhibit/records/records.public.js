
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  NS = 'editor:exhibit:records';


  /**
   * Append the list to the editor container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Records.__view.showIn(container);
  };
  Neatline.commands.addHandler(NS+':display', display);


  /**
   * Query for new records.
   *
   * @param {Object} params: The query parameters.
   */
  var load = function(params) {
    Records.__collection.update(params, function(records) {
      ingest(records);
    });
  };
  Neatline.commands.addHandler(NS+':load', load);


  /**
   * Render a records collection in the list.
   *
   * @param {Object} records: The collection of records.
   */
  var ingest = function(records) {
    Records.__view.ingest(records);
  };
  Neatline.commands.addHandler(NS+':ingest', ingest);


  /**
   * Navigate to the record list.
   */
  var navToList = function() {
    Records.__router.navigate('records', true);
  };
  Neatline.commands.addHandler(NS+':navToList', navToList);


});
