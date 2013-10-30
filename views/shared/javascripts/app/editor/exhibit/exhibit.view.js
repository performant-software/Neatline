
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
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
      this.ui.dropdowns.removeClass('active');
      this.ui.tabs.removeClass('active');

      // Activate tab.
      var tab = this.ui.tabs.filter('[data-slug="'+tab+'"]');
      tab.addClass('active');

      // Activate dropdown.
      tab.parents('li.dropdown').addClass('active');

    }


  });


});
