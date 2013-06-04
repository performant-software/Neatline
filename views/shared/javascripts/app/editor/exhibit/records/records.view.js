
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.View = Backbone.Neatline.View.extend({


    className: 'records',

    events: {
      'mouseenter a[data-id]':  'onMouseenter',
      'mouseleave a[data-id]':  'onMouseleave',
      'click a[data-id]':       'onClick'
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

      this.records = records;

      // Get query as URL param.
      var query = Neatline.request(
        'EDITOR:EXHIBIT:SEARCH:getQueryForUrl'
      );

      // Render record list.
      this.$el.html(this.template({
        records:  this.records,
        limit:    Neatline.g.neatline.per_page,
        query:    query
      }));

    },


    /**
     * Get the model that corresponds to a DOM event.
     *
     * @param {Object} e: A DOM event.
     */
    getModelByEvent: function(e) {
      return this.records.get(
        parseInt($(e.currentTarget).attr('data-id'), 10)
      );
    },


    /**
     * Trigger `highlight` when the cursor hovers on a record row.
     *
     * @param {Object} e: The click event.
     */
    onMouseenter: function(e) {
      Neatline.vent.trigger('highlight', {
        model:  this.getModelByEvent(e),
        source: Records.ID
      });
    },


    /**
     * Trigger `unhighlight` when the cursor leaves a record row.
     *
     * @param {Object} e: The click event.
     */
    onMouseleave: function(e) {
      Neatline.vent.trigger('unhighlight', {
        model:  this.getModelByEvent(e),
        source: Records.ID
      });
    },


    /**
     * Trigger `select` a record row is clicked.
     *
     * @param {Object} e: The click event.
     */
    onClick: function(e) {
      Neatline.vent.trigger('select', {
        model:  this.getModelByEvent(e),
        source: Records.ID
      });
    }


  });


});
