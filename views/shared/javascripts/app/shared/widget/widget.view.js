
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Abstract view for plugin widgets.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Widget', function(
  Widget, Neatline, Backbone, Marionette, $, _) {


  Widget.View = Backbone.Neatline.View.extend({


    className: 'widget',


    /**
     * On startup, check to see if the view element is attached to the DOM
     * (which is the case if an element with the view's `id` is directly
     * templated on the page). If not, append the view element to the core
     * `#neatline-map` container.
     */
    init: function() {
      if (!$('#'+this.id).length) this.$el.appendTo($('#neatline-map'));
    },


  });


});
