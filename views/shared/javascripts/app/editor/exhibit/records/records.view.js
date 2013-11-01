
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(Records) {


  Records.View = Neatline.Shared.View.extend({


    className: 'records',

    events: {
      'mouseenter a[data-id]':  'onMouseenter',
      'mouseleave a[data-id]':  'onMouseleave',
      'click a[data-id]':       'onClick'
    },


    /**
     * Compile pagination and row templates.
     *
     * @param {Object} options
     */
    init: function(options) {
      this.slug = options.slug;
      this.template = _.template($('#record-list-template').html());
    },


    /**
     * Render record list and paginators.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {

      // Get current query as URL parameter.
      var query = Neatline.request('EDITOR:EXHIBIT:SEARCH:getQueryForUrl');

      // Render record list.
      this.$el.html(this.template({
        records: records, limit: Neatline.g.neatline.per_page, query: query
      }));

      this.records = records;

    },


    /**
     * Trigger `highlight` when the cursor hovers on a record row.
     *
     * @param {Object} e: The click event.
     */
    onMouseenter: function(e) {
      this.publish('highlight', this.getModelByEvent(e));
    },


    /**
     * Trigger `unhighlight` when the cursor leaves a record row.
     *
     * @param {Object} e: The click event.
     */
    onMouseleave: function(e) {
      this.publish('unhighlight', this.getModelByEvent(e));
    },


    /**
     * Trigger `select` a record row is clicked.
     *
     * @param {Object} e: The click event.
     */
    onClick: function(e) {
      this.publish('select', this.getModelByEvent(e));
    },


    /**
     * Get the model that corresponds to a DOM event.
     *
     * @param {Object} e: A DOM event.
     */
    getModelByEvent: function(e) {
      return this.records.get(Number($(e.currentTarget).attr('data-id')));
    },


    /**
     * Publish an event with a model.
     *
     * @param {String} event: An event name.
     * @param {Object} model: A record model.
     */
    publish: function(event, model) {
      Neatline.vent.trigger(event, {
        model: model, source: this.slug
      });
    }


  });


});
