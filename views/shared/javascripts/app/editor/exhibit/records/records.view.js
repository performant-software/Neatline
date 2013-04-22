
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  this.View = Backbone.Neatline.View.extend({


    className: 'records',

    events: {
      'click a': 'click'
    },


    /**
     * Compile pagination and row templates.
     */
    init: function() {
      this.template = _.template($('#record-list-template').html());
    },


    /**
     * Render record list and paginators.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {
      this.$el.html(this.template({
        records: records,
        query: Neatline.request('SEARCH:getQueryForUrl'),
        limit: Neatline.global.page_length
      }));
    },


    /**
     * Focus the map when a record row is clicked.
     *
     * @param {Object} e: The click event.
     */
    click: function(e) {
      var id = parseInt($(e.currentTarget).attr('data-id'), 10);
      Neatline.execute('MAP:focusById', id);
    }


  });


});
