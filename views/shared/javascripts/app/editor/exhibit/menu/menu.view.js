
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit menu view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  Menu.View = Backbone.Neatline.View.extend({


    template: '#exhibit-menu-template',
    tagName:  'header',

    ui: {
      tabs: 'li.tab'
    },


    /**
     * Render template, get ui.
     */
    initialize: function() {
      this.getTemplate();
      this.getUi();
    },


    /**
     * Activate a tab.
     *
     * @param {String} tab: The tab to activate.
     */
    activateTab: function(tab) {
      this.__ui.tabs.removeClass('active');
      this.__ui.tabs.filter('[data-slug="'+tab+'"]').addClass('active');
    }


  });


});
