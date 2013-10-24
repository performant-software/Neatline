
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.addInitializer(function() {


    /**
     * Append the form to the editor container.
     *
     * @param {Object} container: The container element.
     */
    var display = function(container) {
      Record.__view.showIn(container);
    };
    Neatline.commands.setHandler(Record.ID+':display', display);


    /**
     * Show form for an existing record.
     *
     * @param {Number|String} id: The record id.
     * @param {String} tab: The active tab slug.
     */
    var bindId = function(id, tab) {

      // Get or fetch the model.
      Neatline.request('EDITOR:EXHIBIT:RECORDS:getModel', Number(id),
        function(record) {
          Record.__view.bind(record);
          Record.__view.activateTab(tab);
        }
      );

    };
    Neatline.commands.setHandler(Record.ID+':bindId', bindId);


    /**
     * Show form for a new record.
     *
     * @param {String} tab: The active tab slug.
     */
    var bindNew = function(tab) {

      // Create a new model.
      var record = new Neatline.Shared.Record.Model();

      // Bind model to form.
      Record.__view.bind(record);
      Record.__view.activateTab(tab);

    };
    Neatline.commands.setHandler(Record.ID+':bindNew', bindNew);


    /**
     * Unbind the form.
     */
    var unbind = function() {
      if (Record.__view.open) Record.__view.unbind();
    };
    Neatline.commands.setHandler(Record.ID+':unbind', unbind);
    Neatline.vent.on('ROUTER:before', unbind);


    /**
     * Open a record edit form if one is not already open.
     *
     * @param {Object} args: Event arguments.
     */
    var navToForm = function(args) {
      if (!Record.__view.open) {
        Record.__router.navigate('record/'+args.model.id, true);
      }
    };
    Neatline.commands.setHandler(Record.ID+':navToForm', navToForm);
    Neatline.vent.on('select', navToForm);


    /**
     * Update coverage textarea.
     *
     * @param {String} coverage: The new WKT.
     */
    var setCoverage = function(coverage) {
      Record.__view.model.set('coverage', coverage);
    };
    Neatline.commands.setHandler(Record.ID+':setCoverage', setCoverage);


    /**
     * Return the form element.
     */
    var getElement = function() {
      return Record.__view.$el;
    };
    Neatline.reqres.setHandler(Record.ID+':getElement', getElement);


    /**
     * Return the form model.
     */
    var getModel = function() {
      return Record.__view.model;
    };
    Neatline.reqres.setHandler(Record.ID+':getModel', getModel);


  });


});
