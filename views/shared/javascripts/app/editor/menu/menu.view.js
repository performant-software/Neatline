
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


    /**
     * Render template, get ui.
     */
    initialize: function() {
      this.getTemplate();
      this.getUi();
    }


  });


});
