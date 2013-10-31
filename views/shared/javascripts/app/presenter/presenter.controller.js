
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter', function(Presenter) {


  Presenter.Controller = Neatline.Shared.Controller.extend({


    slug: 'PRESENTER',

    events: [
      'highlight',
      'unhighlight',
      'select',
      'unselect'
    ],

    commands: [
      'highlight',
      'unhighlight',
      'select',
      'unselect'
    ],


    /**
     * Highlight the record.
     *
     * @param {Object} args: Event arguments.
     */
    highlight: function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':highlight', args.model
        );
      } catch (e) {}
    },


    /**
     * Unhighlight the record.
     *
     * @param {Object} args: Event arguments.
     */
    unhighlight: function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':unhighlight', args.model
        );
      } catch(e) {}
    },


    /**
     * Freeze the record.
     *
     * @param {Object} args: Event arguments.
     */
    select: function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':select', args.model
        );
      } catch (e) {}
    },


    /**
     * Unfreeze and hide the record.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      try {
        Neatline.execute(
          'PRESENTER:'+args.model.get('presenter')+':unselect', args.model
        );
      } catch (e) {}
    },


  });


});
