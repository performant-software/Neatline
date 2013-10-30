
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter', function(
  Presenter, Neatline, Backbone, Marionette, $, _) {


  Presenter.ID = 'PRESENTER';


  Presenter.addInitializer(function() {


    /**
     * Highlight the record.
     *
     * @param {Object} args: Event arguments.
     */
    var highlight = function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':highlight', args.model
        );
      } catch (e) {}
    };
    Neatline.commands.setHandler('PRESENTER:highlight', highlight);
    Neatline.vent.on('highlight', highlight);


    /**
     * Unhighlight the record.
     *
     * @param {Object} args: Event arguments.
     */
    var unhighlight = function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':unhighlight', args.model
        );
      } catch(e) {}
    };
    Neatline.commands.setHandler('PRESENTER:unhighlight', unhighlight);
    Neatline.vent.on('unhighlight', unhighlight);


    /**
     * Freeze the record.
     *
     * @param {Object} args: Event arguments.
     */
    var select = function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':select', args.model
        );
      } catch (e) {}
    };
    Neatline.commands.setHandler('PRESENTER:select', select);
    Neatline.vent.on('select', select);


    /**
     * Unfreeze and hide the record.
     *
     * @param {Object} args: Event arguments.
     */
    var unselect = function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':unselect', args.model
        );
      } catch (e) {}
    };
    Neatline.commands.setHandler('PRESENTER:unselect', unselect);
    Neatline.vent.on('unselect', unselect);


  });


});
