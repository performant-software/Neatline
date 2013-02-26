
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  var NS = 'editor:exhibit';


  /**
   * Display exhibit views in the editor container.
   *
   * @param {Array} views: A list of views.
   */
  var display = function(views) {

    // Get and clear the editor container.
    var editor = Neatline.request('EDITOR:getContainer');
    editor.empty();

    // Show the views.
    _.each(views, function(v) {
      Neatline.execute('editor:exhibit:'+v+':display', editor);
    });

  };
  Neatline.commands.addHandler(NS+':display', display);


});
