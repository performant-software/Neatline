
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  this.View = Backbone.Neatline.View.extend({


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
      Neatline.execute('E:MAP:startEdit', this.model);
      rivets.bind(this.$el, { record: this.model });

      // Update map on model change.
      this.listenTo(this.model, 'change', _.bind(function() {
        Neatline.execute('E:MAP:updateModel', this.model);
      }, this));

    },


    /**
     * End the map edit session, reset the presenter.
     */
    unbind: function() {

      // Deactivate map editing.
      Neatline.execute('E:MAP:endEdit', this.model);

      // Activate and close the presenter.
      Neatline.vent.trigger('PRESENTER:activate');
      Neatline.execute('PRESENTER:unselect', this.model);

      // Unbind model listeners.
      this.stopListening(this.model);
      this.open = false;

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
      var id = this.model.id || 'add';

      // Update the route, notify tab views.
      Neatline.execute('E:setRoute', 'record/'+id+'/'+this.tab);
      Neatline.vent.trigger('E:RECORD:#'+this.tab);

    },


    /**
     * Close the form.
     */
    onCloseClick: function() {
      Neatline.execute('E:EXHIBIT:RECORDS:navToList');
      Neatline.vent.trigger('refresh', { source: Record.ID });
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
      Neatline.execute('E:notifySuccess',
        STRINGS.record.save.success
      );

      // Update the route.
      Neatline.execute('E:setRoute',
        'record/'+this.model.id+'/'+this.tab
      );

      // Refresh the exhibit.
      Neatline.vent.trigger('refresh', { source: Record.ID });

    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('E:notifyError',
        STRINGS.record.save.error
      );
    },


    /**
     * When a delete succeeds.
     */
    onDeleteSuccess: function() {

      // FLash success.
      Neatline.execute('E:notifySuccess',
        STRINGS.record.remove.success
      );

      // Hide modal, close form.
      this.__ui.modal.modal('hide');
      this.onCloseClick();

      // Refresh the exhibit.
      Neatline.vent.trigger('refresh', { source: Record.ID });

    },


    /**
     * When a delete fails.
     */
    onDeleteError: function() {
      Neatline.execute('E:notifyError',
        STRINGS.record.remove.error
      );
    }


  });


});
