
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.StaticBubble', function(
  StaticBubble, Neatline, Backbone, Marionette, $, _) {


  StaticBubble.View = Backbone.Neatline.View.extend({


    template:   '#static-bubble-template',
    className:  'bubble',
    id:         'static-bubble',

    options: {
      pad: {
        x: 40,
        y: 15
      }
    },

    ui: {
      body: '.body'
    },


    /**
     * Initialize trackers, get markup.
     */
    initialize: function() {

      this.active = true;   // True when bubble should be displayed.
      this.frozen = false;  // True when bubble is frozen after a click.
      this.getTemplate();
      this.getUi();

      // Track window size.
      this.window = $(window);
      this.window.resize(_.bind(this.measureWindow, this));
      this.measureWindow();

    },


    /**
     * Get the window height and width.
     */
    measureWindow: function() {
      this.windowH = this.window.outerHeight();
      this.windowW = this.window.outerWidth();
    },


    /**
     * Get the bubble height and width.
     */
    measureBubble: function() {
      this.$el.height('');
      this.bubbleH = this.el.scrollHeight;
      this.bubbleW = this.$el.outerWidth();
    },


    /**
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {
      if (!this.frozen && this.active) {
        rivets.bind(this.$el, { record: model });
        Neatline.Map.__view.$el.append(this.$el);
      }
    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.frozen) this.$el.detach();
    },


    /**
     * Freeze the bubble.
     */
    select: function() {
      this.frozen = true;
      this.$el.addClass('frozen');
      this.__ui.body.show();
    },


    /**
     * Unfreeze and hide the bubble.
     */
    unselect: function() {
      this.frozen = false;
      this.$el.removeClass('frozen');
      this.__ui.body.hide();
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
    }


  });


});
