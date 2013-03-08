
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', { startWithParent: false,
  define: function(Styles, Neatline, Backbone, Marionette, $, _) {


  Neatline.Editor.Exhibit.on('start', function() {
    Styles.start();
  });

  Styles.addInitializer(function() {
    var form = Neatline.request('EXHIBIT:getElement');
    this.__view = new Styles.View({ el: form });
  });


}});
