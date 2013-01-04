
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


    /**
     * Compile row template.
     */
    initialize: function() {
      this.template = _.template($('#record-list-template').html());
    },


    /**
     * Render list of records.
     *
     * @param {Object} records: The records collection.
     */
    ingest: function(records) {
      this.$el.html(this.template({ records: records }));
    }


  });


});
