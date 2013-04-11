
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for edit layer management.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Edit Layer', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('should create edit layer for existing record', function() {

    // --------------------------------------------------------------------
    // When the edit form is opened for an existing record that is not
    // currently loaded on the map, a new layer should be created for the
    // record and set as the edit layer.
    // --------------------------------------------------------------------

    // Load record list with record 3.
    _t.respondRecordList200(_t.json.MapEditLayer.records.regular);
    var models = _t.getRecordListModels();

    // Load map without record 3.
    _t.respondMap200(_t.json.MapEditLayer.records.deleted);

    // Open edit form for record 3.
    _t.navigate('record/'+models[2].id);

    // Should create new layer for record 3.
    var record3Layer = _t.vw.MAP.layers.vector[models[2].id];
    expect(record3Layer.features[0].geometry.x).toEqual(5);
    expect(record3Layer.features[0].geometry.y).toEqual(6);
    _t.assertVectorLayerCount(3);

    // Record 3 layer should be edit layer.
    expect(_t.vw.MAP.editLayer.id).toEqual(record3Layer.id);

  });


  it('should create edit layer for new record', function() {

    // --------------------------------------------------------------------
    // When a new record is added, a new edit layer should be created.
    // --------------------------------------------------------------------

    _t.respondAll200(_t.json.MapEditLayer.records.regular);

    // Add new record.
    _t.navigate('record/add');

    // Map should create new layer for unsaved record.
    expect(_t.vw.MAP.layers.vector[undefined]).toBeDefined();
    _t.assertVectorLayerCount(4);

    // Map should set new layer as the edit layer.
    expect(_t.vw.MAP.editLayer.nModel.id).toBeUndefined();

  });


  it('should not remove edit layer for existing record', function() {

    // --------------------------------------------------------------------
    // When a record is being edited, the edit layer should not be removed
    // if new data is ingested that does not include the record.
    // --------------------------------------------------------------------

    _t.respondAll200(_t.json.MapEditLayer.records.regular);
    var models = _t.getRecordListModels();

    // Open form for record 3.
    _t.navigate('record/'+models[2].id);

    // Reload map without record 3.
    _t.refreshMap(_t.json.MapEditLayer.records.deleted);

    // Record 3 layer should still be present.
    expect(_t.getVectorLayerByTitle('title3')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  it('should not remove edit layer for new record', function() {

    // --------------------------------------------------------------------
    // When a new record is created, the edit layer should not be removed
    // when new data is ingested.
    // --------------------------------------------------------------------

    _t.respondAll200(_t.json.MapEditLayer.records.regular);

    // Add new record.
    _t.navigate('record/add');

    // Reload the map.
    _t.refreshMap(_t.json.MapEditLayer.records.regular);

    // Edit layer still present.
    expect(_t.vw.MAP.layers.vector[undefined]).toBeDefined();
    _t.assertVectorLayerCount(4);

  });


  it('should resume updating the edit layer when edit ends', function() {

    // --------------------------------------------------------------------
    // When a record edit form is closed, the layer that was previouly the
    // edit layer should start updating again in response to map moves.
    // --------------------------------------------------------------------

    _t.respondAll200(_t.json.MapEditLayer.records.regular);
    var models = _t.getRecordListModels();

    // Open record 3 form.
    _t.navigate('record/'+models[2].id);

    // Close the form.
    _t.navigate('records');

    // Reload the map without record 3.
    _t.refreshMap(_t.json.MapEditLayer.records.deleted);

    // Record 2 layer should be cleared.
    expect(_t.getVectorLayerByTitle('title3')).toBeUndefined();

  });


  it('should clear unsaved edit layer when edit ends', function() {

    // --------------------------------------------------------------------
    // When a new record is added, but then the form is closed without
    // being saved, the edit layer that was created for the model should
    // be garbage collected by the next data ingest.
    // --------------------------------------------------------------------

    _t.respondAll200(_t.json.MapEditLayer.records.regular);

    // Add new record.
    _t.navigate('record/add');

    // Close the form.
    _t.navigate('records');

    // Refresh the map.
    _t.refreshMap(_t.json.MapEditLayer.records.regular);

    // Edit layer should be removed.
    expect(_t.getVectorLayerByTitle('title1')).toBeDefined();
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();
    expect(_t.getVectorLayerByTitle('title3')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


});
