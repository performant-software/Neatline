
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.StaticBubble', function(StaticBubble) {


  StaticBubble.Controller = Neatline.Shared.Controller.extend({


    slug: 'PRESENTER:StaticBubble',

    events: [
      'activatePresenter',
      'deactivatePresenter'
    ],

    commands: [
      'highlight',
      'unhighlight',
      'select',
      'unselect'
    ],


    /**
     * Initialize the view.
     */
    init: function() {
      this.view = new StaticBubble.View({ slug: this.slug });
    },


    /**
     * Highlight the bubble.
     *
     * @param {Object} model: The record model.
     */
    highlight: function(model) {
      this.view.highlight(model);
    },


    /**
     * Unhighlight the bubble.
     */
    unhighlight: function() {
      this.view.unhighlight();
    },


    /**
     * Select the bubble.
     *
     * @param {Object} model: The record model.
     */
    select: function(model) {
      this.view.select(model);
    },


    /**
     * Unselect the bubble.
     *
     * @param {Object} model: The record model.
     */
    unselect: function(model) {
      this.view.unselect(model);
    },


    /**
     * Activate the bubble.
     */
    activatePresenter: function() {
      this.view.activate();
    },


    /**
     * Deactivate and close the bubble.
     */
    deactivatePresenter: function() {
      this.view.deactivate();
      this.view.unselect();
    }


  });


});
