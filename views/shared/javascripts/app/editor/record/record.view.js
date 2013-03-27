
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.View = Backbone.Neatline.View.extend({


    template:   '#record-form-template',
    className:  'form-stacked record',
    tagName:    'form',

    events: {
      'shown ul.nav a':         'onTabChange',
      'click a[name="close"]':  'onCloseClick',
      'click a[name="save"]':   'onSaveClick',
      'click a[name="delete"]': 'onDeleteClick'
    },

    ui: {
      tabs:   'li.tab a',
      modal:  '#delete-modal'
    },


    /**
     * Initialize state.
     */
    init: function() {
      this.open = false;  // True if a record is bound to the form.
      this.tab = null;    // The hash of the active tab.
    },


    /**
     * Show the form.
     *
     * @param {Object} model: A record model.
     */
    bind: function(model) {

      this.model = model;
      this.open  = true;

      // Start map editing, bind model to form.
      Neatline.execute('MAPEDIT:startEdit', this.model);
      rivets.bind(this.$el, { record: model });

      // Update map on model change.
      this.model.bind('change', _.bind(function() {
        Neatline.execute('MAPEDIT:updateModel', this.model);
      }, this));

    },


    /**
     * End the map edit session, reset the presenter.
     */
    unbind: function() {

      // Deactivate map editing.
      Neatline.execute('MAPEDIT:endEdit', this.model);

      // Activate and close the presenter.
      Neatline.vent.trigger('PRESENTER:activate');
      Neatline.execute('PRESENTER:unselect', this.model);

      this.model = null;
      this.open  = false;

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

      // Get the tab slug and id.
      this.tab = $(event.target).attr('data-slug');
      var id = this.model.get('id') || 'add';

      // Update the route, notify tab views.
      Neatline.execute('EDITOR:setRoute', 'record/'+id+'/'+this.tab);
      Neatline.vent.trigger('RECORD:tab:'+this.tab);

    },


    /**
     * Close the form.
     */
    onCloseClick: function() {
      Neatline.execute('RECORDS:navToList');
      this.unbind();
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
     * Delete the record.
     */
    onDeleteClick: function() {
      this.model.destroy({
        success:  _.bind(this.onDeleteSuccess, this),
        error:    _.bind(this.onDeleteError, this)
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {

      // Flash success.
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.record.save.success
      );

      // Update the route.
      Neatline.execute('EDITOR:setRoute',
        'record/'+this.model.get('id')+'/'+this.tab
      );

      // Refresh the map.
      Neatline.execute('MAP:refresh');

    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.record.save.error
      );
    },


    /**
     * When a delete succeeds.
     */
    onDeleteSuccess: function() {

      // FLash success.
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.record.remove.success
      );

      // Delete the record's layer on the map.
      Neatline.execute('MAPEDIT:deleteLayer', this.model);
      this.__ui.modal.modal('hide');

      // Close the form.
      this.onCloseClick();

    },


    /**
     * When a delete fails.
     */
    onDeleteError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.record.remove.error
      );
    }


  });


});
