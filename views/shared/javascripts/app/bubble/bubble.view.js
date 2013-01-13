
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

      this.getTemplate();
      this.getUi();

      this.active = true;   // True when bubble should be displayed.
      this.frozen = false;  // True when bubble is frozen after a click.

      this.exhibit  = $('#neatline');
      this.window   = $(window);

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
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {

      // Break if frozen or inactive.
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
      if (this.frozen) return;
      this.$el.detach();
      this._unbind();
    },


    /**
     * Freeze the bubble.
     */
    select: function() {
      this.frozen = true;
      this._unbind();
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
     * Unbind move and leave listeners.
     */
    _unbind: function() {
      this.exhibit.unbind('mouseleave.bubble');
      this.window.unbind('mousemove.bubble');
    }


  });


});
