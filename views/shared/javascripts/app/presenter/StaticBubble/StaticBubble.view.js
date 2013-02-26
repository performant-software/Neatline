
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

    events: {
      'click .close': 'unselect'
    },

    ui: {
      close:  '.close',
      body:   '.body'
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

        // Store reference to mouseout callback.
        this.onMouseOut  = _.bind(this.hide, this);

        // Bind to mousemove and mouseout.
        var map = Neatline.request('MAP:getMap');
        map.events.register('mouseout', null, this.onMouseOut);

        // Render template, inject bubble.
        rivets.bind(this.$el, { record: model });
        Neatline.Map.__view.$el.append(this.$el);
        this.model = model;

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
     *
     * @param {Object} model: The record model.
     */
    select: function(model) {
      this.show(model);
      if (this.model.get('body')) this.$el.addClass('body');
      this.$el.addClass('frozen');
      this.frozen = true;
    },


    /**
     * Unfreeze and hide the bubble.
     */
    unselect: function() {
      Neatline.execute('MAP:unselect');
      this.$el.removeClass('frozen body');
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
    unbind: function() {
      var map = Neatline.request('MAP:getMap');
      map.events.unregister('mouseout', null, this.onMouseOut);
    }


  });


});
