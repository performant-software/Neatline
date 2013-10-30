
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text) {


  Text.ID = 'EDITOR:RECORD:TEXT';


  /**
   * Start the tab after the form.
   */
  Neatline.Editor.Record.on('start', function() {
    Text.start();
  });


  Text.addInitializer(function() {


    Text.__view = new Text.View({
      el: Neatline.request('EDITOR:RECORD:getElement')
    });


    /**
     * Instantiate autocomplete and CKEditor.
     */
    var activate = function() {
      Text.__view.buildWidgets();
    };
    Neatline.commands.setHandler(Text.ID+':activate', activate);
    Neatline.vent.on('EDITOR:RECORD:#text', activate);


  });


}});
