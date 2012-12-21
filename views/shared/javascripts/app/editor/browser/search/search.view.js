
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Browser.Search', function(
  Search, Neatline, Backbone, Marionette, $, _) {


  Search.View = Backbone.Marionette.ItemView.extend({


    template: '#search-template',


    /**
     * Inject the template.
     */
    initialize: function() {
      this.$el.append(_.template($(this.template).html()));
    }


  });


});
