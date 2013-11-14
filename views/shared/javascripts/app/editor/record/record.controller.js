
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(Record) {


  Record.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:RECORD',

    events: [
      { 'ROUTER:before': 'unbind' },
      { 'select': 'navToForm' }
    ],

    commands: [
      'display',
      'bindSaved',
      'bindNew',
      'unbind',
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
    bind: function(record, tab) {
      this.view.bind(record);
      this.view.activateTab(tab);
    },


    /**
     * Bind an existing record to the form.
     *
     * @param {Number|String} id: The record id.
     * @param {String} tab: The active tab slug.
     */
    bindSaved: function(id, tab) {
      Neatline.request('EDITOR:EXHIBIT:RECORDS:getModel', Number(id),
        _.bind(function(record) { this.bind(record, tab) }, this)
      );
    },


    /**
     * Bind a new record to the form.
     *
     * @param {String} tab: The active tab slug.
     */
    bindNew: function(tab) {
      this.bind(new Neatline.Shared.Record.Model(), tab);
    },


    /**
     * If the form is open, Unbind the current record.
     */
    unbind: function() {
      if (this.view.open) this.view.unbind();
    },


    /**
     * Open a record edit form if one is not already open.
     *
     * @param {Object} args: Event arguments.
     */
    navToForm: function(args) {
      if (!this.view.open) {
        this.router.navigate('record/'+args.model.id, true);
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
