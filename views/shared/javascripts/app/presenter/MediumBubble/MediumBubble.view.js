
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Medium bubble view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.MediumBubble', function(
  MediumBubble, Neatline, Backbone, Marionette, $, _) {


  MediumBubble.View = Neatline.Presenter.SmallBubble.View.extend({


    template: '#medium-bubble-template',
    id:       'medium-bubble',

    ui: {
      body: '.body'
    },


    /**
     * Display the body and reposition.
     */
    select: function() {
      MediumBubble.View.__super__.select.apply(this, arguments);
      this.__ui.body.show();
      this.measureBubble();
      this.reposition();
    },


    /**
     * Hide the body.
     */
    unselect: function() {
      MediumBubble.View.__super__.unselect.apply(this, arguments);
      this.__ui.body.hide();
    },


    /**
     * Reposition using the last cached move event.
     *
     * @param {Object} e: The mousemove event.
     */
    position: function(e) {
      MediumBubble.View.__super__.position.apply(this, arguments);
      this.e = e;
    },


    /**
     * Reposition using the last cached move event.
     */
    reposition: function() {
      this.position(this.e);
    }


  });


});
