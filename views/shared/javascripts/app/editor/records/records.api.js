
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list event handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  /**
   * Udpate the records collection and render the list.
   *
   * @param {Object} params: The query parameters.
   */
  var update = function(params) {
    Records.__collection.update(params, function(records) {
      Neatline.vent.trigger('editor:records:update', records);
      Records.__view.ingest(records);
    });
  };

  Neatline.commands.addHandler('editor:records:update', update);


});
