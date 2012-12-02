
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Records view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records.Views', function(
  Views, Records, Backbone, Marionette, $, _) {


  Views.RecordList = Backbone.View.extend({

    getListTemplate: function() {
      return _.template($('#record-list').html());
    },

    getRowTemplate: function() {
      return _.template($('#record-row').html());
    },

    /*
     * --------------------------------------------------------------------
     * Compile templates.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    initialize: function() {
      this.listTemplate = this.getListTemplate();
      this.rowTemplate = this.getRowTemplate();
    },

    /*
     * --------------------------------------------------------------------
     * Render record listings.
     * --------------------------------------------------------------------
     *
     * @param {Object} records: The records collection.
     *
     * @return void.
     */
    show: function(records) {

      // Append container.
      this.ul = $(this.listTemplate());
      this.$el.html(this.ul);

      // Walk the incoming records.
      records.each(_.bind(function(r) {

        // Create record.
        var record = new Neatline.Editor.Records.Views.RecordRow({
          model: r, template: this.rowTemplate
        });

        // Append.
        this.ul.append(record.$el);

      }, this));

    }

  });

});
