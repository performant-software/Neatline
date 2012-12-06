
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Record row view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records.Views', function(
  Views, Records, Backbone, Marionette, $, _) {


  Views.RecordRow = Backbone.View.extend({


    tagName: 'li',
    className: 'record-row',


    events: {
      'click': 'openForm'
    },


    /**
     * Set instance model, render the template.
     *
     * @return void.
     */
    initialize: function() {

      // Store model.
      this.model = this.options.model;

      // Render template.
      this.$el.append($(this.options.template({
        title: this.model.get('title'),
        body: this.model.get('description')
      })));

    },

    /**
     * When the listing is clicked, open the edit form for the record.
     *
     * @return void.
     */
    openForm: function() {
      Neatline.vent.trigger('editor:records:openForm', this.model);
    }

  });


});
