
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Close Form', function() {


  var el, fx = {
    records: read('EditorRecordCloseForm.records.json'),
    record:  read('EditorRecordCloseForm.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fx.record);

    el = {
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
    el.close.trigger('click');

    // Records list should be visible.
    expect(NL.v.editor.__ui.editor).not.toContain(NL.v.record.$el);
    expect(NL.v.editor.__ui.editor).toContain(NL.v.records.$el);

  });


  it('should unselect the record', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, the bound model should be unselected.
    // ------------------------------------------------------------------------

    spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Click "X".
    el.close.trigger('click');

    // Should unselect the record.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('unselect', {
      model:  NL.v.record.model,
      source: Neatline.Editor.Record.ID
    });

  });


  it('should refresh the exhibit', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, the exhibit should be refreshed.
    // ------------------------------------------------------------------------

    spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Click "X".
    el.close.trigger('click');

    // Should refresh the exhibit.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('refresh', {
      source: Neatline.Editor.Record.ID
    });

  });


  it('should clear unsaved geometry changes', function() {

    // ------------------------------------------------------------------------
    // When the form is closed, unsaved changes to the record' geometry that
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
    el.close.trigger('click');

    // Respond with original geometry.
    NL.respondMap200(fx.records);

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
    el.pan.removeAttr('checked');
    el.poly.attr('checked', 'checked').trigger('change');

    // Click "X".
    el.close.trigger('click');

    // Should deactivate edit control.
    expect(NL.v.map.controls.poly.active).toBeFalsy();

  });


});
