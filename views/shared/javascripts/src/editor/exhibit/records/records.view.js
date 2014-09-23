
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
     * Compile pagination and row templates, create the collection.
     *
     * @param {Object} options
     */
    init: function(options) {

      this.slug = options.slug;

      // Compile the list template.
      this.template = _.template($('#record-list-template').html());

      // Create the records collection.
      this.records = new Neatline.Shared.Record.Collection();

    },


    /**
     * Query for new records.
     *
     * @param {Object} params: The query parameters.
     */
    load: function(params) {
      this.records.update(params, _.bind(function(records) {
        this.ingest(records);
      }, this));
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
        query: query,
        limit: Neatline.g.neatline.per_page,
        records: records
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
      var id = Number($(e.currentTarget).attr('data-id'));
      return this.records.get(id);
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
