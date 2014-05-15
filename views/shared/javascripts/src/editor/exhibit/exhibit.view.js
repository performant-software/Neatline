
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(Exhibit) {


  Exhibit.View = Neatline.Shared.View.extend({


    template: '#exhibit-menu-template',
    tagName:  'header',

    ui: {
      dropdowns: 'li.dropdown',
      tabs: 'li.tab'
    },


    /**
     * Activate a tab.
     *
     * @param {String} tab: The tab to activate.
     */
    activateTab: function(tab) {

      // Clear current activation.
      this.__ui.dropdowns.removeClass('active');
      this.__ui.tabs.removeClass('active');

      // Activate tab.
      var tab = this.__ui.tabs.filter('[data-slug="'+tab+'"]');
      tab.addClass('active');

      // Activate dropdown.
      tab.parents('li.dropdown').addClass('active');

    }


  });


});
