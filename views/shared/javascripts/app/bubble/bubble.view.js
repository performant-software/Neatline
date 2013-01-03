
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Bubble view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Bubble.Views', function(
  Views, Bubble, Backbone, Marionette, $, _) {


  Views.Bubble = Backbone.Neatline.View.extend({


    template: '#bubble-template',
    id:       'bubble',

    options: {
      padding: {
        x: 40,
        y: 25
      }
    },

    ui: {
      title:  '.title',
      body:   '.body'
    },


    /**
     * Initialize trackers, get markup.
     */
    initialize: function() {

      this.getTemplate();
      this.getUi();

      this.active = true;   // True when bubble should be displayed.
      this.frozen = false;  // True when bubble is frozen after a click.

      this.exhibit  = $('#neatline');
      this.window   = $(window);

    },


    /**
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {

      // Break if frozen.
      if (this.frozen || !this.active) return;
      rivets.bind(this.$el, { record: model });

      // Position on move, hide on leave.
      this.window.bind('mousemove.bubble', _.bind(this.position, this));
      this.exhibit.bind('mouseleave.bubble', _.bind(this.hide, this));

      // Inject bubble.
      this.exhibit.append(this.$el);

    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.frozen) this.thaw();
    },


    /**
     * Freeze the bubble in place.
     */
    freeze: function() {
      this.window.unbind('mousemove.bubble');
      this.exhibit.unbind('mouseleave.bubble');
      this.frozen = true;
    },


    /**
     * Unfreeze the bubble.
     */
    thaw: function() {
      this.window.unbind('mousemove.bubble');
      this.exhibit.unbind('mouseleave.bubble');
      this.frozen = false;
      this.$el.detach();
    },


    /**
     * Render position.
     *
     * @param {Object} evt: The mousemove event.
     */
    position: function(evt) {
      this.$el.css({
        left: evt.clientX + this.options.padding.x,
        top:  evt.clientY - this.options.padding.y
      });
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
    }


  });


});
