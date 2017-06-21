
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.StaticBubble', function(StaticBubble) {


  StaticBubble.View = Neatline.Shared.Widget.View.extend({


    id:         'static-bubble',
    template:   '#static-bubble-template',
    className:  'bubble static',

    events: {
      'click .close': 'onClose'
    },

    ui: {
      close:  '.close',
      body:   '.body'
    },


    /**
     * Compile the interior template, initialize state.
     *
     * @param {Object} options
     */
    init: function(options) {

      this.slug = options.slug;

      this.selected = false;  // True when bubble is frozen after a click.
      this.active = true;     // True when bubble should be displayed.

    },


    /**
     * Publish the `unselect` event.
     */
    onClose: function() {

      // Publish `unselect` event.
      Neatline.vent.trigger('unselect', {
        model:  this.model,
        source: this.slug
      });

    },


    // HELPERS
    // ------------------------------------------------------------------------


    /**
     * Bind a model to the bubble.
     *
     * @param {Object} model: The record model.
     */
    bind: function(model) {

      this.model = model;

      // Store reference to unhighlight callback.
      this.onMouseOut = _.bind(this.unhighlight, this);

      // Unhighlight when the cursor leave the map.
      var map = Neatline.request('MAP:getMap');
      map.events.register('mouseout', null, this.onMouseOut);

      // Render template, add `bound` class.
      rivets.bind(this.$el, { record: this.model })
      this.$el.addClass('bound');

    },


    /**
     * Unbind the current model.
     */
    unbind: function() {

      // Clear the map `mouseout` listener.
      var map = Neatline.request('MAP:getMap');
      map.events.unregister('mouseout', null, this.onMouseOut);

      // Clear the bubble.
      this.$el.removeClass('bound');

    },


    // API METHODS
    // ------------------------------------------------------------------------


    /**
     * Display the bubble if (a) it isn't already selected and (b) the
     * presenter is active.
     *
     * @param {Object} model: The record model.
     */
    highlight: function(model) {
      if (!this.selected && this.active) this.bind(model);
    },


    /**
     * Hide the bubble if it isn't already selected.
     */
    unhighlight: function() {
      if (!this.selected) this.unbind();
    },


    /**
     * Select the bubble if the presenter is active.
     *
     * @param {Object} model: The record model.
     */
    select: function(model) {
      if (this.active) {

        // Show bubble.
        this.$el.addClass('selected');

        // Bind model.
        this.selected = true;
        this.bind(model);

      }
    },


    /**
     * Unselect and hide the bubble.
     *
     * @param {Object} model: The record model.
     */
    unselect: function(model) {
      if (!model || (this.model && this.model.id == model.id)) {

        // Hide bubble.
        this.$el.removeClass('selected');

        // Unbind model.
        this.selected = false;
        this.unbind();

      }
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
