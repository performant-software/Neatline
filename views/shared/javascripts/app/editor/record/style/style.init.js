
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Spatial tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Style', { startWithParent: false,
  define: function(Style, Neatline, Backbone, Marionette, $, _) {


  /**
   * Start the tab once the form is running.
   */
  Neatline.Editor.Record.on('start', function() {
    Style.start();
  });


  /**
   * Instantiate the tab view.
   */
  Style.init = function() {
    var form = Neatline.request('RECORD:getElement');
    this.__view = new Style.View({ el: form });
  };

  Style.addInitializer(Style.init);


}});
