
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
     * Initialize state.
     */
    init: function() {
      this.active   = true;   // True when bubble should be displayed.
      this.selected = false;  // True when bubble is frozen after a click.
    },


    /**
     * Render values and inject the bubble.
     *
     * @param {Object} model: The record model.
     */
    bind: function(model) {
      rivets.bind(this.$el, { record: model });
      Neatline.Map.__view.$el.append(this.$el);
    },


    /**
     * Render values and inject the bubble.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {
      if (!this.selected && this.active) this.bind(model);
    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.selected) this.$el.detach();
    },


    /**
     * Freeze the bubble.
     *
     * @param {Object} model: The record model.
     */
    select: function(model) {
      if (model.get('body')) this.$el.addClass('body');
      this.$el.addClass('frozen');
      this.selected = true;
      this.bind(model);
    },


    /**
     * Unfreeze and hide the bubble.
     */
    unselect: function() {
      this.$el.removeClass('frozen body');
      this.selected = false;
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
