
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


  var recordModels;


  beforeEach(function() {
    _t.loadEditor();
    recordModels = _t.getRecordListModels();
  });


  it('should create edit layer for existing record', function() {

    // --------------------------------------------------------------------
    // When an edit form is opened for an existing record that does not
    // have a map layer, a new layer should be created for the record and
    // set to be the edit layer.
    // --------------------------------------------------------------------

    // Load map without record 2.
    _t.refreshMap(_t.json.records.removed);
    expect(_t.vw.map.layers.length).toEqual(2);

    // Open form for record 2.
    _t.navigate('records/'+recordModels[1].get('id'));

    // Map should create new layer for record 2.
    var newLayer = _.last(_t.vw.map.layers);
    expect(newLayer.features[0].geometry.x).toEqual(3);
    expect(newLayer.features[0].geometry.y).toEqual(4);
    expect(_t.vw.map.layers.length).toEqual(3);

    // Map should set record 2 layer as the edit layer.
    expect(newLayer.nId).toEqual(_t.vw.map.editLayer.nId);

  });


  it('should create edit layer for new record', function() {

    // --------------------------------------------------------------------
    // When a new record is added, a new edit layer should be created.
    // --------------------------------------------------------------------

    // Add new record.
    _t.navigate('records/add');

    // Map should create new layer.
    var newLayer = _.last(_t.vw.map.layers);
    expect(_t.vw.map.layers.length).toEqual(4);

    // Map should set new layer as the edit layer.
    expect(newLayer.nId).toEqual(_t.vw.map.editLayer.nId);

  });


  it('should not update edit layer for existing record', function() {

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


  it('should not remove edit layer for existing record', function() {

    // --------------------------------------------------------------------
    // When a record is being edited, the edit layer should not be removed
    // when new data is ingested that does not include the record.
    // --------------------------------------------------------------------

    // Open form for record 2.
    _t.navigate('records/'+recordModels[1].get('id'));

    // Reload map without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Record 2 layer should still be present.
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();

  });


  it('should update edit layer model', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and a new set of records is ingested
    // on the map, the model tied to the edit layer should be replaced by
    // the updated version.
    // --------------------------------------------------------------------

    // Open form for record 2.
    _t.navigate('records/'+recordModels[1].get('id'));

    // Reload map with updated record 2.
    _t.refreshMap(_t.json.records.changed);

    // Edit layer model should be updated.
    expect(_t.vw.map.editLayer.nModel.get('coverage')).
      toEqual('POINT(7 8)');

  });

  it('should not remove edit layer for new record', function() {

    // --------------------------------------------------------------------
    // When a new record is created, the edit layer should not be removed
    // when new data is ingested that does not include the record.
    // --------------------------------------------------------------------

    // Add new record.
    _t.navigate('records/add');

    // Reload the map.
    _t.refreshMap(_t.json.records.standard);

    // Edit layer should still be present.
    expect(_t.vw.map.layers.length).toEqual(4);

  });


  it('should resume updating the edit layer when edit ends', function() {

    // --------------------------------------------------------------------
    // When a record edit form is closed, the layer that was previouly the
    // edit layer should start updating again in response to map moves.
    // --------------------------------------------------------------------

    // Open form for record 2, then record list.
    _t.navigate('records/'+recordModels[1].get('id'));
    _t.navigate('records');

    // Reload the map without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Record 2 layer should be cleared.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();

  });


  it('should clear unsaved edit layer when edit ends', function() {

    // --------------------------------------------------------------------
    // When a new record is added, but then the form is closed without
    // being saved, the edit layer that was created for the model should
    // be garbage collected in the next layer refresh.
    // --------------------------------------------------------------------

    // Create new record.
    _t.navigate('records/add');
    expect(_t.vw.map.layers.length).toEqual(4);

    // Close without saving, refresh map.
    _t.navigate('records');
    _t.refreshMap(_t.json.records.standard);

    // Edit layer should be removed.
    expect(_t.vw.map.layers.length).toEqual(3);
    expect(_t.getVectorLayerByTitle('title1')).toBeDefined();
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();
    expect(_t.getVectorLayerByTitle('title3')).toBeDefined();

  });


});
