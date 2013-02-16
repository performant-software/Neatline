
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  Menu.View = Backbone.Neatline.View.extend({


    template: '#menu-template',
    tagName: 'header',

    ui: {
      tabs: {
        all:      'ul.nav li',
        records:  'li.records',
        styles:   'li.styles'
      }
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
     * @param {String} tab: The tab name.
     */
    activateTab: function(tab) {
      this.__ui.tabs.all.removeClass('active');
      this.__ui.tabs[tab].addClass('active');
    }


  });


});
