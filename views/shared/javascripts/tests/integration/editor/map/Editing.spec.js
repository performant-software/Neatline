
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map editing.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Editing', function() {

  beforeEach(function() {
    _t.loadEditor();
  });

  it('should create map edit layer when one does not exist', function() {

    // --------------------------------------------------------------------
    // When an edit form is opened for a record that does not have a map
    // layer, a new layer should be created for the record.
    // --------------------------------------------------------------------

    // Load map without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Open form for record 2.
    recordModels = _t.getRecordModels();
    _t.navigate('records/'+recordModels[1].get('id'));

    // Check for new layer.
    var mapLayers = _t.getVectorLayers();
    expect(_.last(mapLayers).features[0].geometry.x).toEqual(3);
    expect(_.last(mapLayers).features[0].geometry.y).toEqual(4);
    expect(mapLayers.length).toEqual(3);

  });

  it('should not update the edit layer', function() {

    // --------------------------------------------------------------------
    // When a record is being edited, the edit layer should not be rebuilt
    // when new data is ingested in response to move events.
    // --------------------------------------------------------------------

    // Open form for record 2, get layer.
    _t.navigate('records/'+recordModels[1].get('id'));
    var record2Layer = _t.getVectorLayerByTitle('title2');

    // Add a new point.
    record2Layer.addFeatures([
      new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(9,10)
      )
    ]);

    // Move the map, re-get layer.
    _t.refreshMap(_t.json.records.changed);
    record2Layer = _t.getVectorLayerByTitle('title2');

    // Geometry should be unchanged.
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(record2Layer.features[1].geometry.x).toEqual(9);
    expect(record2Layer.features[1].geometry.y).toEqual(10);

  });

  it('should not remove the edit layer', function() {

    // --------------------------------------------------------------------
    // When a record is being edited, the edit layer should not be removed
    // if a new collection is ingested that does not include the record.
    // --------------------------------------------------------------------

    // Open form for record 2.
    _t.navigate('records/'+recordModels[1].get('id'));

    // Reload map without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Record 2 layer still present.
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();

  });

  it('should resume updating the edit layer when edit ends', function() {

    // --------------------------------------------------------------------
    // When a record edit form is closed, the layer that was previouly the
    // edit layer should start updating again in response to map moves.
    // --------------------------------------------------------------------

    // Open form for record 2, then record list.
    _t.navigate('records/'+recordModels[1].get('id'));
    _t.navigate('records');

    // Reload map without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Record 2 layer updated.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();

  });

});
