
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


  StaticBubble.View = Neatline.Shared.Widget.View.extend({


    id: 'static-bubble',

    events: {
      'click .close': 'unselect'
    },

    ui: {
      close:  '.close',
      body:   '.body'
    },


    /**
     * Initialize state, compile template.
     */
    init: function() {

      StaticBubble.View.__super__.init.apply(this);

      this.active   = true;   // True when bubble should be displayed.
      this.selected = false;  // True when bubble is frozen after a click.

      this.template = _.template(
        $('#static-bubble-template').html()
      );

    },


    /**
     * Populate title and body.
     *
     * @param {Object} model: The record model.
     */
    __bind: function(model) {
      this.$el.html(this.template({ record: model }));
      this.$el.addClass('bound');
    },


    /**
     * Clear title and body.
     */
    __unbind: function() {
      this.$el.empty();
      this.$el.removeClass('bound');
    },


    /**
     * Render values and inject the bubble.
     *
     * @param {Object} model: The record model.
     */
    show: function(model) {
      if (!this.selected && this.active) {
        this.__bind(model);
      }
    },


    /**
     * Hide the bubble.
     */
    hide: function() {
      if (!this.selected) {
        this.__unbind();
      }
    },


    /**
     * Freeze the bubble.
     *
     * @param {Object} model: The record model.
     */
    select: function(model) {
      if (this.active) {
        if (model.get('body')) this.$el.addClass('body');
        this.$el.addClass('selected');
        this.selected = true;
        this.__bind(model);
      }
    },


    /**
     * Unfreeze and hide the bubble.
     */
    unselect: function() {
      this.$el.removeClass('selected body');
      this.selected = false;
      this.__unbind();
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
