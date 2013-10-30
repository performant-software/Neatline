
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Map', { startWithParent: false,
  define: function(Map) {


  Map.ID = 'EDITOR:RECORD:MAP';


  /**
   * Start the tab after the form.
   */
  Neatline.Editor.Record.on('start', function() {
    Map.start();
  });


  /**
   * Instantiate the tab view.
   */
  Map.addInitializer(function() {
    Map.__view = new Map.View({
      el: Neatline.request('EDITOR:RECORD:getElement')
    });
  });


}});
