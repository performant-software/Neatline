
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(Record) {


  Record.View = Neatline.Shared.View.extend({


    template:   '#record-form-template',
    className:  'form-stacked record',
    tagName:    'form',

    events: {
      'shown.bs.tab ul.nav a':  'onTabChange',
      'click a[name="close"]':  'onCloseClick',
      'click a[name="save"]':   'onSaveClick'
    },

    ui: {
      tabs: 'li.tab a'
    },


    /**
     * Initialize state.
     *
     * @param {Object} options
     */
    init: function(options) {

      // Set the module slug.
      this.slug = options.slug;

      this.hasRecord = false; // True if a record is bound to the form.
      this.activeTab = null;  // The hash of the active tab.

      this._initDeleteModal();

    },


    /**
     * Cache the delete modal, listen for delete confirmations.
     */
    _initDeleteModal: function() {

      // Cache the element.
      this.deleteModal = $('#delete-modal');

      // Listen for "Yes, delete" clicks.
      this.deleteModal.find('a[name="delete"]').click(
        _.bind(this.onDeleteClick, this)
      );

    },


    /**
     * Show the form.
     *
     * @param {Object} model: A record model.
     */
    bindRecord: function(model) {

      // Bind the model.
      this.hasRecord = true;
      this.model = model;

      // Start map editing, bind model to form.
      Neatline.execute('EDITOR:MAP:startEdit', this.model);
      rivets.bind(this.$el, { record: this.model });

      // Update map on model change.
      this.listenTo(this.model, 'change', _.bind(function() {
        Neatline.execute('EDITOR:MAP:updateModel', this.model);
      }, this));

    },


    /**
     * End the map edit session, reset the presenter.
     */
    unbindRecord: function() {

      // Unselect the record.
      Neatline.vent.trigger('unselect', {
        model: this.model, source: this.slug
      });

      // Switch off map editing.
      Neatline.execute('EDITOR:MAP:endEdit', this.model);

      // Activate the presenter.
      Neatline.vent.trigger('activatePresenter');

      // Refresh the map.
      Neatline.vent.trigger('refresh', { source: this.slug });

      // Unbind the model.
      this.hasRecord = false;
      this.stopListening();

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
     * Cache the active tab, update the route.
     *
     * @param {Object} event: The `shown` event.
     */
    onTabChange: function(event) {
      this.activeTab = $(event.target).attr('data-slug');
      this.updateRoute();
    },


    /**
     * Close the form.
     */
    onCloseClick: function() {
      Neatline.execute('EDITOR:EXHIBIT:RECORDS:navToList');
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

      this.updateRoute();

      // Refresh the exhibit.
      Neatline.vent.trigger('refresh', { source: this.slug });

      // Flash success.
      Neatline.execute('EDITOR:notifySuccess',
        Neatline.g.neatline.strings.record.save.success
      );

    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('EDITOR:notifyError',
        Neatline.g.neatline.strings.record.save.error
      );
    },


    /**
     * When a delete succeeds.
     */
    onDeleteSuccess: function() {

      // Hide modal, close form.
      this.deleteModal.modal('hide');
      this.onCloseClick();

      // Refresh the exhibit.
      Neatline.vent.trigger('refresh', { source: this.slug });

      // FLash success.
      Neatline.execute('EDITOR:notifySuccess',
        Neatline.g.neatline.strings.record.remove.success
      );

    },


    /**
     * When a delete fails.
     */
    onDeleteError: function() {
      Neatline.execute('EDITOR:notifyError',
        Neatline.g.neatline.strings.record.remove.error
      );
    },


    /**
     * Set the current route.
     */
    updateRoute: function() {

      // Construct the new route.
      var route = 'edit/' + (this.model.id || 'new');
      if (this.activeTab !== 'text') route += '/' + this.activeTab;

      // Set the new route.
      Neatline.execute('EDITOR:setRoute', route);

    }


  });


});
