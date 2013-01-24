
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


  /**
   * Rehydrate the record list from route parameters.
   *
   * @param {String} query:   The search query.
   * @param {Number} offset:  The limit offset.
   */
  var rehydrate = function(query, offset) {
    query = query || null; offset = offset || 0;
    Neatline.execute('editor:records:update', {
      query: query, limit: __editor.perPage, offset: offset
    });
  };

  Neatline.commands.addHandler('editor:records:rehydrate', rehydrate);
  Neatline.vent.on('editor:router:#records', rehydrate);


});
