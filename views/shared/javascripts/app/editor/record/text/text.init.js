
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text, Neatline, Backbone, Marionette, $, _) {


  this.ID = 'E:RECORD:TEXT';


  /**
   * Start the tab after the form.
   */
  Neatline.Editor.Record.on('start', function() {
    Text.start();
  });


  /**
   * Instantiate the tab view.
   */
  this.addInitializer(function() {
    this.__view = new Text.View({
      el: Neatline.request('E:RECORD:getElement')
    });
  });


}});
