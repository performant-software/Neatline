
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(Record) {


  Record.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:RECORD',

    events: [
      { 'ROUTER:before': 'unbindRecord' },
      { 'select': 'navToForm' }
    ],

    commands: [
      'display',
      'bindNewRecord',
      'bindSavedRecord',
      'unbindRecord',
      'navToForm',
      'setWkt'
    ],

    requests: [
      'getElement',
      'getModel'
    ],


    /**
     * Create the router and view.
     */
    init: function() {
      this.router = new Record.Router();
      this.view = new Record.View({ slug: this.slug });
    },


    /**
     * Append the form to the editor container.
     *
     * @param {Object} container: The container element.
     */
    display: function(container) {
      this.view.showIn(container);
    },


    /**
     * Bind a record to the form and display a tab.
     *
     * @param {Object} record: A record model.
     * @param {String} tab: The active tab slug.
     */
    bindRecord: function(record, tab) {
      this.view.bindRecord(record);
      this.view.activateTab(tab);
    },


    /**
     * Bind a new record to the form.
     *
     * @param {String} tab: The active tab slug.
     */
    bindNewRecord: function(tab) {
      this.bindRecord(new Neatline.Shared.Record.Model(), tab);
    },


    /**
     * Bind an existing record to the form.
     *
     * @param {Number|String} id: The record id.
     * @param {String} tab: The active tab slug.
     */
    bindSavedRecord: function(id, tab) {
      Neatline.request('EDITOR:EXHIBIT:RECORDS:getModel', Number(id),
        _.bind(function(record) { this.bindRecord(record, tab) }, this)
      );
    },


    /**
     * If the form is open, Unbind the current record.
     */
    unbindRecord: function() {
      if (this.view.hasRecord) this.view.unbindRecord();
    },


    /**
     * Open a record edit form if one is not already open.
     *
     * @param {Object} args: Event arguments.
     */
    navToForm: function(args) {
      if (!this.view.hasRecord) {
        this.router.navigate('edit/'+args.model.id, true);
      }
    },


    /**
     * Update coverage textarea.
     *
     * @param {String} coverage: The new WKT.
     */
    setWkt: function(coverage) {
      this.view.model.set('coverage', coverage);
    },


    /**
     * Return the form element.
     */
    getElement: function() {
      return this.view.$el;
    },


    /**
     * Return the form model.
     */
    getModel: function() {
      return this.view.model;
    }


  });


});
