
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Broker', function(Map) {


  Broker.Controller = Neatline.Shared.Controller.extend({


    events: [
      'highlight',
      'unhighlight',
      'select',
      'unselect'
    ],


    /**
     * Initialize the record trackers.
     */
    init: function() {
      this.highlighted = null;
      this.selected = null;
    },


    /**
     * Unhighlight a currently-highlighted model.
     *
     * @param {Object} args: Event arguments.
     */
    highlight: function(args) {
      if (!_.isNull(this.highlighted)) {
        Neatline.vent.trigger('unhighlight', {
          model: this.highlighted, source: args.source
        });
      }
    },


    /**
     * Clear the currently-highlighted model.
     *
     * @param {Object} args: Event arguments.
     */
    unhighlight: function(args) {
      this.highlighted = null;
    },


    /**
     * Unhighlight a currently-selected model.
     *
     * @param {Object} args: Event arguments.
     */
    select: function(args) {
      if (!_.isNull(this.selected)) {
        Neatline.vent.trigger('unselect', {
          model: this.selected, source: args.source
        });
      }
    },


    /**
     * Clear the currently-selected model.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      this.selected = null;
    }


  });


});
