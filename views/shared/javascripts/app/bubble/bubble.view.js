
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bubble view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Bubble', function(
  Bubble, Neatline, Backbone, Marionette, $, _) {


  Bubble.View = Backbone.Neatline.View.extend({


    template: '#bubble-template',
    id:       'bubble',

    options: {
      padding: {
        x: 40,
        y: 15
      }
    },


    /**
     * Initialize trackers, get markup.
     */
    initialize: function() {
      this.active = true;   // True when bubble should be displayed.
      this.frozen = false;  // True when bubble is frozen after a click.
      this.getTemplate();
      this.getUi();
    },


    /**
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {
      if (!this.frozen && this.active) {

        // Create reference-able event callbacks.
        this.onMouseMove = _.bind(this.update, this);
        this.onMouseOut  = _.bind(this.hide, this);

        // Bind to mousemove and mouseout.
        var map = Neatline.request('map:getMap');
        map.events.register('mousemove', null, this.onMouseMove);
        map.events.register('mouseout',  null, this.onMouseOut);

        // Render template, inject bubble.
        rivets.bind(this.$el, { record: model });
        $('body').append(this.$el);

      }
    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.frozen) {
        this.$el.detach();
        this.unbind();
      }
    },


    /**
     * Freeze the bubble.
     */
    select: function() {
      this.frozen = true;
      this.unbind();
    },


    /**
     * Unfreeze and hide the bubble.
     */
    unselect: function() {
      this.frozen = false;
      this.hide();
    },


    /**
     * Enable the bubble.
     */
    activate: function() {
      this.active = true;
    },


    /**
     * Disable the bubble
     */
    deactivate: function() {
      this.active = false;
    },


    /**
     * Render position.
     *
     * @param {Object} evt: The mousemove event.
     */
    update: function(evt) {
      this.$el.css({
        left: evt.clientX + this.options.padding.x,
        top:  evt.clientY - this.options.padding.y
      });
    },


    /**
     * Unbind move and leave listeners.
     */
    unbind: function() {
      var map = Neatline.request('map:getMap');
      map.events.unregister('mousemove', null, this.onMouseMove);
      map.events.unregister('mouseout',  null, this.onMouseOut);
    }


  });


});
