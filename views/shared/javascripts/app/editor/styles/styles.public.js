
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the view to the editor container.
   */
  var show = function() {
    Styles.__view.showIn(Neatline.request('editor:getContainer'));
    Styles.__view.refresh();
  };

  Neatline.commands.addHandler('editor:styles:show', show);


});
