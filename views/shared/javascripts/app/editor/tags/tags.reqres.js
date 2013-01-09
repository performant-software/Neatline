
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tags list request handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tags', function(
  Tags, Editor, Backbone, Marionette, $, _) {


  /**
   * Get a tag model from the collection.
   *
   * @param {Number} id: The tag id.
   * @param {Function} cb: A callback, called with the model.
   */
  Neatline.reqres.addHandler('editor:tags:getModel', function(id, cb) {
    Tags.__collection.getOrFetch(id, cb);
  });


});
