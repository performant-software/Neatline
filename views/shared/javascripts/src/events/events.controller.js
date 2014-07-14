
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
      this.highlighted = {};
      this.selected = {};
    },


    /**
     * Unhighlight currently-highlighted records.
     *
     * @param {Object} args: Event arguments.
     */
    highlight: function(args) {

      // Unhighlight all currently-highlighted records.
      if (!args.allowMultiple) {
        this.unhighlightAll();
      }

      // Register the new record.
      this.highlighted[args.model.id] = args.model;

    },


    /**
     * Unhighlight a currently-highlighted record by ID.
     *
     * @param {Number|String} id: The record ID.
     */
    unhighlightById: function(id) {
      if (_.has(this.highlighted, id)) {
        this.publish('unhighlight', this.highlighted[id]);
      }
    },


    /**
     * Unhighlight all currently-highlighted records.
     */
    unhighlightAll: function() {
      _.each(this.highlighted, _.bind(function(model, id) {
        this.unhighlightById(id);
      }, this));
    },


    /**
     * De-register a currently-highlighted model.
     *
     * @param {Object} args: Event arguments.
     */
    unhighlight: function(args) {
      delete this.highlighted[args.model.id];
    },


    /**
     * Unhighlight a currently-selected model.
     *
     * @param {Object} args: Event arguments.
     */
    select: function(args) {

      // Unselect all currently-selected records.
      if (!args.allowMultiple) {
        this.unselectAll();
      }

      // Register the new record.
      this.selected[args.model.id] = args.model;

    },


    /**
     * Unselect a currently-selected record by ID.
     *
     * @param {Number|String} id: The record ID.
     */
    unselectById: function(id) {
      if (_.has(this.selected, id)) {
        this.publish('unselect', this.selected[id]);
      }
    },


    /**
     * Unselect all currently-selected records.
     */
    unselectAll: function() {
      _.each(this.selected, _.bind(function(model, id) {
        this.unselectById(id);
      }, this));
    },


    /**
     * Clear the currently-selected model.
     *
     * @param {Object} args: Event arguments.
     */
    unselect: function(args) {
      delete this.selected[args.model.id];
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
