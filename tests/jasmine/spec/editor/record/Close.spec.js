
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form close.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Close', function() {


  var vw, el;


  beforeEach(function() {

    _t.loadEditor();
    _t.openFirstRecordForm();

    vw = {
      editor:   Neatline.Editor.__view,
      records:  Neatline.Editor.Exhibit.Records.__view,
      record:   Neatline.Editor.Record.__view
    };

    el = {
      close:    vw.record.$('a[name="close"]')
    };

  });


  it('should close the form when "Close" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "X" button at the top of the record edit form is clicked,
    // the form should disappear and the record list should be displayed.
    // --------------------------------------------------------------------

    // Click "X".
    el.close.trigger('click');
    _t.respondRecords();

    // Records list should be visible.
    expect(vw.editor.__ui.editor).not.toContain(vw.record.$el);
    expect(vw.editor.__ui.editor).toContain(vw.records.$el);

  });


});
