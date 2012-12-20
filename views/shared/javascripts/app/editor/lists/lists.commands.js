
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Lists command handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Lists', function(
  Lists, Editor, Backbone, Marionette, $, _) {

  console.log(Editor);

  /**
   * Show the lists layout and records list.
   */
  Editor.commands.addHandler('showRecordList', function(region) {

    // Render lists layout.
    var listsLayout = new Lists.Layout();
    region.show(listsLayout);

  });


});
