
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag form events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  // ======================================================================

  /**
   * Show form for an existing tag.
   *
   * @param {Number} id: The tag id.
   */
  var showById = function(id) {
    Neatline.request('editor:tags:getModel', id, function(r) {
      Tag.__view.show(r);
    });
  };

  Neatline.commands.addHandler('editor:tag:showById', showById);
  Neatline.vent.on('editor:router:#tags/:id', showById);


  // ======================================================================

  /**
   * Show form for a new tag.
   */
  var showNew = function() {

    // Create new tag.
    var tag = new Neatline.Editor.Shared.Tag.Model();

    // Populate id.
    tag.save(null, {
      success: function() {
        Tag.__view.show(tag);
      }
    });

  };

  Neatline.commands.addHandler('editor:tag:showNew', showNew);
  Neatline.vent.on('editor:router:#tags/add', showNew);


  // ======================================================================

  /**
   * Close a tag form.
   */
  var close = function() {
    if (Tag.__view.open) Tag.__view.close();
  };

  Neatline.commands.addHandler('editor:tag:close', close);
  Neatline.vent.on('editor:router:before', close);


  // ======================================================================


});
