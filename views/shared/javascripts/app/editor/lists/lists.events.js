
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Lists events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Lists', function(
  Lists, Editor, Backbone, Marionette, $, _) {


  /**
   * Show the list menu ("Records" and "Tags" tabs) and record list.
   */
  Neatline.vent.on('editor:show:records', function() {
    Neatline.Editor.layout.editor.show(Lists.layout);
  });


});
