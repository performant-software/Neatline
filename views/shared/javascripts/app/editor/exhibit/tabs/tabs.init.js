
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit tabs initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Tabs', function(
  Tabs, Neatline, Backbone, Marionette, $, _) {


  Tabs.init = function() {
    this.__view = new Tabs.View();
  };

  Tabs.addInitializer(Tabs.init);


});
