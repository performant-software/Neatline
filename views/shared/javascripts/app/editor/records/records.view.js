
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.View = Backbone.Neatline.View.extend({


    className:  'records',

    events: {
      'click a': 'click'
    },


    /**
     * Compile row template.
     */
    initialize: function() {
      this.pagination = _.template($('#pagination-template').html());
      this.records = _.template($('#record-list-template').html());
    },


    /**
     * Render record list and paginators.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      // Inject the records list.
      this.$el.html(this.records({ records: records }));

      // Inject the paginators into the list.
      this.$el.find('.pagination').html(this.pagination({
        query: Neatline.request('editor:search:getQuery'),
        limit: __editor.perPage,
        records: records
      }));

    },


    /**
     * Focus the map when a record row is clicked.
     *
     * @param {Object} e: The click event.
     */
    click: function(e) {
      var id = parseInt($(e.currentTarget).attr('data-id'), 10);
      Neatline.execute('map:focusById', id);
    }


  });


});
