
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


    template:   '#record-list-template',
    className:  'records',
    tagName:    'ul',

    events: {
      'click a': 'click'
    },


    /**
     * Compile row template.
     */
    initialize: function() {
      this.records = _.template($(this.template).html());
    },


    /**
     * Render list of records.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {
      this.$el.html(this.records({ records: records }));
    },


    /**
     * Focus the map on the record.
     *
     * @param {Object} e: The click event.
     */
    click: function(e) {
      var id = parseInt($(e.currentTarget).attr('data-id'), 10);
      Neatline.execute('map:focusById', id);
    }


  });


});
