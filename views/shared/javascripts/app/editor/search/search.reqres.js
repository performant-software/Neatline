
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search request/response handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Editor, Backbone, Marionette, $, _) {


  /*
   * ----------------------------------------------------------------------
   * Is map mirroring currently enabled?
   * ----------------------------------------------------------------------
   *
   * @return {Boolean}: True if map mirroring is enabled.
   */
  Neatline.reqres.addHandler('editor:search:mapMirror?', function() {
    return Search.view.mirrored;
  });


});
