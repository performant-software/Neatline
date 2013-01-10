
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for tag form close.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tag Form Close', function() {

  var els;

  beforeEach(function() {

    _t.loadEditor();
    _t.openTagForm();

    els = {
      close: _t.vw.tag.$('a[name="close"]')
    };

  });

  it('should close the form when "Close" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "X" button at the top of the tag edit form is clicked, the
    // form should disappear and the tags list should be displayed.
    // --------------------------------------------------------------------

    // Click "X".
    els.close.trigger('click');
    _t.respondTags();

    // Check for tags list, no form.
    expect(_t.el.editor).not.toContain(_t.el.tag);
    expect(_t.el.editor).toContain(_t.el.tags);

    // 3 records in browser pane.
    expect(_t.getTagRows().length).toEqual(3);

  });

});
