
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
      'bindId',
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
      this.view = new Record.View();
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
     * Show form for an existing record.
     *
     * @param {Number|String} id: The record id.
     * @param {String} tab: The active tab slug.
     */
    bindId: function(id, tab) {

      // Get or fetch the model.
      Neatline.request('EDITOR:EXHIBIT:RECORDS:getModel', Number(id),
        _.bind(function(record) {
          this.view.bind(record);
          this.view.activateTab(tab);
        }, this)
      );

    },


    /**
     * Show form for a new record.
     *
     * @param {String} tab: The active tab slug.
     */
    bindNew: function(tab) {

      // Create a new model.
      var record = new Neatline.Shared.Record.Model();

      // Bind model to form.
      this.view.bind(record);
      this.view.activateTab(tab);

    },


    /**
     * Unbind the form.
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
