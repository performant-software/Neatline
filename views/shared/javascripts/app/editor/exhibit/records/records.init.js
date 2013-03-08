
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', { startWithParent: false,
  define: function(Records, Neatline, Backbone, Marionette, $, _) {


  Neatline.Editor.Exhibit.on('start', function() {
    Records.start();
  });

  Records.addInitializer(function() {
    var form = Neatline.request('EXHIBIT:getElement');
    this.__collection = new Neatline.Shared.Record.Collection();
    this.__view = new Records.View({ el: form });
  });


}});
