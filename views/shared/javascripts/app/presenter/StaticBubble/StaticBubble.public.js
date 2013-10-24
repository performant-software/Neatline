
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.StaticBubble', function(
  StaticBubble, Neatline, Backbone, Marionette, $, _) {


  StaticBubble.addInitializer(function() {


    /**
     * Highlight the bubble.
     *
     * @param {Object} model: The record model.
     */
    var highlight = function(model) {
      StaticBubble.__view.highlight(model);
    };
    Neatline.commands.setHandler(
      StaticBubble.ID+':highlight', highlight
    );


    /**
     * Unhighlight the bubble.
     */
    var unhighlight = function() {
      StaticBubble.__view.unhighlight();
    };
    Neatline.commands.setHandler(
      StaticBubble.ID+':unhighlight', unhighlight
    );


    /**
     * Select the bubble.
     *
     * @param {Object} model: The record model.
     */
    var select = function(model) {
      StaticBubble.__view.select(model);
    };
    Neatline.commands.setHandler(
      StaticBubble.ID+':select', select
    );


    /**
     * Unselect the bubble.
     */
    var unselect = function() {
      StaticBubble.__view.unselect();
    };
    Neatline.commands.setHandler(
      StaticBubble.ID+':unselect', unselect
    );


    /**
     * Activate the bubble.
     */
    var activate = function() {
      StaticBubble.__view.activate();
    };
    Neatline.vent.on(
      'PRESENTER:activate', activate
    );


    /**
     * Deactivate and close the bubble.
     */
    var deactivate = function() {
      StaticBubble.__view.deactivate();
      StaticBubble.__view.unselect();
    };
    Neatline.vent.on(
      'PRESENTER:deactivate', deactivate
    );


  });


});
