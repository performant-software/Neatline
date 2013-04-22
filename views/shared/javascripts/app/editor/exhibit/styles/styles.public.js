
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  /**
   * Display the form, load fresh exhibit data.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Styles.__view.showIn(container);
    Styles.__view.model.fetch({ success: function() {
      Styles.__view.buildEditor();
    }})
  };
  Neatline.commands.setHandler('ESTYLE:display', display);


});
