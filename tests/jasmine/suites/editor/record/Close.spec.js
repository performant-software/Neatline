
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


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.showRecordForm(_t.json.RecordForm.record);

    el = {
      close: _t.vw.RECORD.$('a[name="close"]')
    };

  });


  it('should close the form when "Close" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "X" button at the top of the record edit form is clicked,
    // the form should disappear and the record list should be displayed.
    // --------------------------------------------------------------------

    // Click "X".
    el.close.trigger('click');

    // Records list should be visible.
    expect(_t.vw.EDITOR.__ui.editor).not.toContain(_t.vw.RECORD.$el);
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORDS.$el);

  });


  it('should update the map', function() {

    // --------------------------------------------------------------------
    // When the form is closed, the map should be automatically refreshed
    // to clear out any unsaved geometry changes.
    // --------------------------------------------------------------------

    // Spy on event executor.
    spyOn(Neatline, 'execute');

    // Click "X".
    el.close.trigger('click');

    // Should refresh map.
    expect(Neatline.execute).toHaveBeenCalledWith('MAP:refresh');

  });


});
