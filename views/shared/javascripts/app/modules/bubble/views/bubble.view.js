
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
      padding: 25
    },


    /**
     * Get markup.
     *
     * @return void.
     */
    initialize: function() {

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

      // Render values, measure.
      this.title.html(model.get('title'));
      this.description.html(model.get('description'));
      this.measureBubble();

      // Position on move.
      this.window.bind('mousemove.bubble', _.bind(function(e) {
        this.position(e);
      }, this));

      // Show.
      this.$el.show();

    },


    /**
     * .
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    hide: function(model) {
      this.window.unbind('mousemove.bubble');
      this.$el.hide();
    },


    /**
     * .
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    lock: function(model) {
      this.window.unbind('mousemove.bubble');
    },


    /**
     * Render position.
     *
     * @param {Object} evt: The mousemove event.
     * @return void.
     */
    position: function(evt) {

      this.measureWindow();

      // Base coordiantes.
      var x = evt.clientX + this.options.padding;
      var y = evt.clientY - this.options.padding;

      // Catch overflows.
      if (x > this.ww) x = this.ww - this.bw;
      if (y > this.wh) y = this.wh - this.bh;

      // Render.
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
     * Measure the size of the bubble.
     *
     * @return void.
     */
    measureBubble: function() {

      // Clone and append to DOM.
      var clone = this.$el.clone().css({
        top: -1000, left: -1000
      }).appendTo(this.body);

      // Measure and remove.
      this.bh = clone.outerHeight();
      this.bw = clone.outerWidth();
      clone.remove();

    }


  });


});
