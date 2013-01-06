
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Editor, Backbone, Marionette, $, _) {


  /**
   * Is a record for curretly displayed?
   *
   * @return {Boolean}: True if the form is open.
   */
  Neatline.reqres.addHandler('editor:record:isOpen?', function() {
    return Record.__view.open;
  });


});
