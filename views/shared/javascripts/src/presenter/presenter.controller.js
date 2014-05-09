
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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


    /**
     * Highlight the record.
     *
     * @param {Object} args: Event arguments.
     */
    highlight: function(args) {
      Neatline.execute(
        'PRESENTER:'+args.model.get('presenter')+':highlight', args.model
      );
    },


    /**
     * Unhighlight the record.
     *
     * @param {Object} args: Event arguments.
     */
    unhighlight: function(args) {
      Neatline.execute(
        'PRESENTER:'+args.model.get('presenter')+':unhighlight', args.model
      );
    },


    /**
     * Freeze the record.
     *
     * @param {Object} args: Event arguments.
     */
    select: function(args) {
      Neatline.execute(
        'PRESENTER:'+args.model.get('presenter')+':select', args.model
      );
    },


    /**
     * Unfreeze and hide the record.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      Neatline.execute(
        'PRESENTER:'+args.model.get('presenter')+':unselect', args.model
      );
    },


  });


});
