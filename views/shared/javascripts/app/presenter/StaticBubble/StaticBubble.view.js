
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.StaticBubble', function(StaticBubble) {


  StaticBubble.View = Neatline.Shared.Widget.View.extend({


    id: 'static-bubble',

    events: {
      'click .close': 'onClose'
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

      this.template = _.template($('#static-bubble-template').html());

    },


    /**
     * Hide the bubble and publish the `unselect` event.
     */
    onClose: function() {

      this.unselect()

      // Publish `unselect` event.
      Neatline.vent.trigger('unselect', {
        model:  this.model,
        source: StaticBubble.ID
      });

    },


    // HELPERS
    // ------------------------------------------------------------------------


    /**
     * Populate title and body.
     *
     * @param {Object} model: The record model.
     */
    bind: function(model) {

      this.model = model;

      // Store reference to mouseout callback.
      this.onMouseOut = _.bind(this.unhighlight, this);

      // Bind to mousemove and mouseout.
      var map = Neatline.request('MAP:getMap');
      map.events.register('mouseout', null, this.onMouseOut);

      // Render template, add `bound` class.
      this.$el.html(this.template({ record: this.model }));
      this.$el.addClass('bound');

    },


    /**
     * Clear title and body.
     */
    unbind: function() {

      // Unbind map `mouseout` listener.
      var map = Neatline.request('MAP:getMap');
      map.events.unregister('mouseout', null, this.onMouseOut);

      // Empty bubble.
      this.$el.empty();
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

        // Add classes.
        if (model.get('body')) this.$el.addClass('body');
        this.$el.addClass('selected');

        // Show bubble.
        this.selected = true;
        this.bind(model);

      }
    },


    /**
     * Unselect and hide the bubble.
     */
    unselect: function() {

      // Strip classes.
      this.$el.removeClass('selected body');

      // Hide bubble.
      this.selected = false;
      this.unbind();

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
