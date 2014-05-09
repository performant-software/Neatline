
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Sync Geometry', function() {


  var elements, fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);
    NL.v.record.activateTab('map');

    elements = {
      coverage: NL.v.record.$('textarea[name="coverage"]'),
      pan:      NL.v.record.$('input[value="pan"]'),
      modify:   NL.v.record.$('input[value="modify"]')
    };

  });


  it('should sync geometry when the form model changes', function() {

    // ------------------------------------------------------------------------
    // When the coverage attribute on the record for mmodel changes (eg, when
    // the record has just been associated with an Omeka item, and a new
    // coverage compiled on the server), the features on the edit layer should
    // be rebuilt to match the value in the "Coverage" input.
    // ------------------------------------------------------------------------

    NL.v.record.model.set('coverage', 'POINT(3 4)');

    // Should clear old geometry and render new coverage.
    expect(NL.v.map.editLayer.features[0].geometry.x).toEqual(3);
    expect(NL.v.map.editLayer.features[0].geometry.y).toEqual(4);
    expect(NL.v.map.editLayer.features.length).toEqual(1);

  });


  it('should sync geometry on coverage input `change`', function() {

    // ------------------------------------------------------------------------
    // When a new coverage is entered into the "Coverage" textarea triggering
    // a `change` event, the features on the edit layer should be rebuilt.
    // ------------------------------------------------------------------------

    elements.coverage.val('POINT(3 4)').trigger('change');

    // Should clear old geometry and render new coverage.
    expect(NL.v.map.editLayer.features[0].geometry.x).toEqual(3);
    expect(NL.v.map.editLayer.features[0].geometry.y).toEqual(4);
    expect(NL.v.map.editLayer.features.length).toEqual(1);

  });


  it('should sync geometry on coverage input `keyup`', function() {

    // ------------------------------------------------------------------------
    // When a new coverage is entered into the "Coverage" textarea triggering
    // a `keyup` event, the features on the edit layer should be rebuilt.
    // ------------------------------------------------------------------------

    elements.coverage.val('POINT(3 4)').trigger('keyup');

    // Should clear old geometry and render new coverage.
    expect(NL.v.map.editLayer.features[0].geometry.x).toEqual(3);
    expect(NL.v.map.editLayer.features[0].geometry.y).toEqual(4);
    expect(NL.v.map.editLayer.features.length).toEqual(1);

  });


  it('should clear geometry when empty coverage entered', function() {

    // ------------------------------------------------------------------------
    // When an empty coverage is entered into "Coverage" textarea, all of the
    // features on the edit layer should be deleted.
    // ------------------------------------------------------------------------

    elements.coverage.val('').trigger('keyup');

    // Should clear all features.
    expect(NL.v.map.editLayer.features.length).toEqual(0);

  });


  it('should not sync geometry when modify control is active', function() {

    // ------------------------------------------------------------------------
    // When the "Modify Shape" control is active, features on the edit layer
    // should not be rebuilt. Otherwise, the feature being modified would be
    // cleared (and thus effectively "unselected") after each individual point
    // modification, making it necessary to continually reselect the feature.
    // ------------------------------------------------------------------------

    var feature = NL.v.map.editLayer.features[0];

    // Check "Modify Shape".
    elements.modify.prop('checked', true).trigger('change');

    // Move the point.
    NL.v.map.controls.edit.selectFeature(feature);
    feature.geometry.x = 3;
    feature.geometry.y = 4;

    // Trigger modification.
    NL.v.map.controls.edit.dragComplete();

    // Should _not_ rebuild the feature.
    expect(NL.v.map.editLayer.features[0].id).toEqual(feature.id);

  });


});
