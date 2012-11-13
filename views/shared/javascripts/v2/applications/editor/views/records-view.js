/**
 * Records view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Views.Records = Backbone.View.extend({

  /*
   * Render record listings.
   *
   * @param {Object} records: The records collection.
   *
   * @return void.
   */
  ingest: function(records) {

    // Walk the incoming records.
    records.each(_.bind(function(r) {
      var record = new Editor.Views.RecordRow({ model: r });
      this.$el.append(record.$el);
    }, this));

  }

});
