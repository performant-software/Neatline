
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit form controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  Exhibit.Router = Neatline.Editor.Router.extend({


    routes: {
      ':tab': ':tab',
    },


    /**
     * Show an exhibit form tab.
     *
     * @param {String} tab: The active tab.
     */
    ':tab': function(tab) {
      Neatline.execute('EDITOR:display', ['EXHIBIT']);
      Neatline.execute('EXHIBIT:activateTab', tab);
    }


  });


});
