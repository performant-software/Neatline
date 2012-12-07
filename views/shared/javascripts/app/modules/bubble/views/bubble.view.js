
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


  Views.Bubble = Backbone.View.extend({


    options: {
      padding: {
        x: 40,
        y: 25
      }
    },


    /**
     * Get markup.
     *
     * @return void.
     */
    initialize: function() {

      this.active = true; // True when bubble should be displayed.
      this.frozen = false; // True when bubble is frozen after a click.

      // Bubble components.
      this.title = this.$el.find('.record-title');
      this.description = this.$el.find('.record-body');

      // Document.
      this.window = $(window);
      this.body = $('body');

    },


    /**
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    show: function(model) {

      // Break if frozen.
      if (this.frozen || !this.active) return;

      // Render values, measure.
      this.title.html(model.get('title'));
      this.description.html(model.get('description'));

      // Position on move.
      this.window.bind('mousemove.bubble', _.bind(function(e) {
        this.position(e);
      }, this));

      // Show.
      this.$el.show();

    },


    /**
     * Hide the bubble.
     *
     * @return void.
     */
    hide: function() {
      if (!this.frozen) this.thaw();
    },


    /**
     * Freeze the bubble in place.
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    freeze: function() {
      this.window.unbind('mousemove.bubble');
      this.$el.addClass('frozen');
      this.frozen = true;
    },


    /**
     * Unfreeze the bubble.
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    thaw: function() {
      this.window.unbind('mousemove.bubble');
      this.$el.removeClass('frozen');
      this.frozen = false;
      this.$el.hide();
    },


    /**
     * Render position.
     *
     * @param {Object} evt: The mousemove event.
     * @return void.
     */
    position: function(evt) {
      var x = evt.clientX + this.options.padding.x;
      var y = evt.clientY - this.options.padding.y;
      this.$el.css({ left: x, top: y });
    },


    /**
     * Measure the size of the window.
     *
     * @return void.
     */
    measureWindow: function() {
      this.wh = this.window.height();
      this.ww = this.window.width();
    },


    /**
     * Enable the bubble.
     *
     * @return void.
     */
    activate: function() {
      this.active = true;
    },


    /**
     * Disable the bubble
     *
     * @return void.
     */
    deactivate: function() {
      this.active = false;
    }


  });


});
