
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

  var els;

  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    els = {
      close: _t.vw.record.$('a[name="close"]'),
    };

  });

  it('should close the form when "Close" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "X" button at the top of the record edit form is clicked,
    // the form should disappear and the record list should be displayed.
    // --------------------------------------------------------------------

    // Open form, click close.
    els.close.trigger('click');

    // Check for records list, no form.
    expect(_t.el.editor).not.toContain(_t.el.record);
    expect(_t.el.editor).toContain(_t.el.records);

    // 3 records in browser pane.
    expect(_t.getRecordRows().length).toEqual(3);

  });

});
