
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  Menu.init = function() {
    this.__view = new Menu.View();
  };

  Menu.addInitializer(Menu.init);


});
