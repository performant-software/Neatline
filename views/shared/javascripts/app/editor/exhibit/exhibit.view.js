
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  Exhibit.View = Backbone.Neatline.View.extend({


    template:   '#exhibit-form-template',
    className:  'form-stacked exhibit',
    tagName:    'form',

    events: {
      'shown ul.nav a':       'onTabChange',
      'click a[name="save"]': 'onSaveClick'
    },

    ui: {
      tabs: 'li.tab a'
    },


    /**
     * Activate a tab.
     *
     * @param {String} tab: The tab to activate.
     */
    activateTab: function(tab) {
      this.__ui.tabs.filter('[data-slug="'+tab+'"]').tab('show');
    },


    /**
     * Update the route.
     *
     * @param {Object} event: The `shown` event.
     */
    onTabChange: function(event) {
      var tab = $(event.target).attr('data-slug');
      Neatline.execute('EDITOR:setRoute', 'records/'+tab);
    },


    /**
     * Save the record.
     */
    onSaveClick: function() {
      this.model.save(null, {
        success:  _.bind(this.onSaveSuccess, this),
        error:    _.bind(this.onSaveError, this)
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {
      // TODO
    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      // TODO
    }


  });


});
