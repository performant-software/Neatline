
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Events', function(Events) {


  Events.Controller = Neatline.Shared.Controller.extend({


    slug: 'EVENTS',

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

      // Unhighlight current.
      if (!_.isNull(this.highlighted)) {
        this.publish('unhighlight', this.highlighted);
      }

      // Set new current.
      this.highlighted = args.model;

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

      // Unselect current.
      if (!_.isNull(this.selected)) {
        this.publish('unselect', this.selected);
      }

      // Set new current.
      this.selected = args.model;

    },


    /**
     * Clear the currently-selected model.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      this.selected = null;
    },


    /**
     * Publish an event.
     *
     * @param {String} event: The event.
     * @param {Object} model: The record model.
     */
    publish: function(event, model) {
      Neatline.vent.trigger(event, {
        model: model, source: this.slug
      });
    }


  });


});
