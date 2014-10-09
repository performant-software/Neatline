
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
     * When a widget view is started, check to see if there is already an
     * element on the page with the view's `id`. If so, just attach the view
     * directly to the existing element. Otherwise, once a new element has
     * created for the view, append the widget to the map container.
     *
     * @param {Object} options
     */
    constructor: function(options) {

      options = options || {};

      // Does an element already exist?
      var el = $('#'+this.id);
      var exists = el.length;

      // If so, attach the view to it.
      if (exists) options.el = el;

      // Start the view.
      Widget.View.__super__.constructor.call(this, options);

      // Append to the map, if not in DOM.
      if (!$.contains(document, this.$el.get(0))) {
        this.$el.appendTo($('#neatline-map'));
      }

    }


  });


});
