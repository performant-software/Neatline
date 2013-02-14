
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Small-content bubble view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.SmallBubble', function(
  SmallBubble, Neatline, Backbone, Marionette, $, _) {


  SmallBubble.View = Backbone.Neatline.View.extend({


    template:   '#small-bubble-template',
    className:  'bubble',
    id:         'small-bubble',

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
     * Render values, inject bubble, add move listener.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {
      if (!this.frozen && this.active) {

        // Create reference-able event callbacks.
        this.onMouseMove = _.bind(this.position, this);
        this.onMouseOut  = _.bind(this.hide, this);

        // Bind to mousemove and mouseout.
        var map = Neatline.request('map:getMap');
        map.events.register('mousemove', null, this.onMouseMove);
        map.events.register('mouseout',  null, this.onMouseOut);

        // Render template, inject bubble.
        rivets.bind(this.$el, { record: model });
        this.$el.appendTo(Neatline.Map.__view.$el);

      }
    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.frozen) {
        this.conceal();
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
    position: function(evt) {

      var h = this.$el.outerHeight();
      var w = this.$el.outerWidth();

      // LEFT:
      if (evt.clientX + this.options.padding.x + w > this.windowW) {
        this.$el.css({
          left: evt.clientX - this.options.padding.x - w,
          top:  evt.clientY - this.options.padding.y
        });
      }

      // RIGHT:
      else {
        this.$el.css({
          left: evt.clientX + this.options.padding.x,
          top:  evt.clientY - this.options.padding.y
        });
      }

    },


    /**
     * Position the bubble off-screen.
     */
    conceal: function() {
      this.$el.css({ left: -1000, top: -1000 });
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
