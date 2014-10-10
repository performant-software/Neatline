
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Widget', function(Widget) {


  Widget.View = Neatline.Shared.View.extend({


    className: 'widget',


    /**
     * TODO|bandaid
     * Inject the widget container into the map.
     *
     * @param {Object} options
     */
    initialize: function(options) {
      this.$el.appendTo($('#neatline-map'));
      Widget.View.__super__.initialize.call(this, options);
    },


  });


});
