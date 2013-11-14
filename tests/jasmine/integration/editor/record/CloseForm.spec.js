
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Close Form', function() {


  var elements, fixtures = {
    records: read('EditorRecordCloseForm.records.json'),
    record:  read('EditorRecordCloseForm.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);

    elements = {
      pan:    NL.v.record.$('input[value="pan"]'),
      poly:   NL.v.record.$('input[value="poly"]'),
      close:  NL.v.record.$('a[name="close"]')
    };

  });


  it('should close the form when "Close" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "X" button at the top of the record edit form is clicked, the
    // form should disappear and the record list should be displayed.
    // ------------------------------------------------------------------------

    // Click "X".
    elements.close.trigger('click');

    // Records list should be visible.
    expect(NL.v.editor.__ui.editor).not.toContain(NL.v.record.$el);
    expect(NL.v.editor.__ui.editor).toContain(NL.v.records.$el);

  });


  it('should unselect the record', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, the bound model should be unselected.
    // ------------------------------------------------------------------------

    var vent = NL.getEventSpy();

    // Click "X".
    elements.close.trigger('click');

    // Should unselect the record.
    expect(vent).toHaveBeenCalledWith('unselect', {
      model: NL.v.record.model, source: 'EDITOR:RECORD'
    });

  });


  it('should refresh the exhibit', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, the exhibit should be refreshed.
    // ------------------------------------------------------------------------

    var vent = NL.getEventSpy();

    // Click "X".
    elements.close.trigger('click');

    // Should refresh the exhibit.
    expect(vent).toHaveBeenCalledWith('refresh', {
      source: 'EDITOR:RECORD'
    });

  });


  it('should clear unsaved geometry changes', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, unsaved changes to the record's geometry that
    // were made during the edit session should be cleared.
    // ------------------------------------------------------------------------

    // Drag the point to a different location.
    var feature = NL.v.map.editLayer.features[0];
    NL.v.map.controls.edit.feature = feature;
    feature.geometry.x = 3;
    feature.geometry.y = 4;

    // Trigger modification.
    NL.v.map.controls.edit.dragComplete();

    // Click "X".
    elements.close.trigger('click');

    // Respond with original geometry.
    NL.respondMap200(fixtures.records);

    // Should revert to the saved geometry.
    var layer = NL.v.map.getVectorLayers()[0];
    expect(layer.features[0].geometry.x).toEqual(1);
    expect(layer.features[0].geometry.y).toEqual(2);

  });


  it('should deactivate edit control', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, the editing control that is currently active
    // on the map should be deactivated.
    // ------------------------------------------------------------------------

    // Activate "Draw Polygon".
    elements.pan.removeAttr('checked');
    elements.poly.attr('checked', 'checked').trigger('change');

    // Click "X".
    elements.close.trigger('click');

    // Should deactivate edit control.
    expect(NL.v.map.controls.poly.active).toBeFalsy();

  });


});
