
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Search', { startWithParent: false,
  define: function(Search, Neatline, Backbone, Marionette, $, _) {


  Neatline.Editor.Exhibit.on('start', function() {
    Search.start();
  });

  Search.addInitializer(function() {
    this.__view = new Search.View({
      el: Neatline.request('EXHIBIT:getElement')
    });
  });


}});
