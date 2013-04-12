
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
    _t.showRecordForm(_t.json.RecordFormClose.record);

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
    spyOn(Neatline, 'execute').andCallThrough();

    // Move the point to a different location.
    var feature = _t.vw.MAP.editLayer.features[0];
    _t.vw.MAP.controls.edit.feature = feature;
    feature.geometry.x = 3;
    feature.geometry.y = 4;

    // Trigger modification.
    _t.vw.MAP.controls.edit.dragComplete();

    // Click "X".
    el.close.trigger('click');

    // Should refresh map.
    expect(Neatline.execute).toHaveBeenCalledWith('MAP:refresh');
    _t.respondLast200(_t.json.RecordFormClose.records);

    // Should revert to the saved geometry.
    var layer = _t.vw.MAP.getVectorLayers()[0];
    expect(layer.features[0].geometry.x).toEqual(1);
    expect(layer.features[0].geometry.y).toEqual(2);

  });


});
