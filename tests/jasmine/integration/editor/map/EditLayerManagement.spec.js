
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Edit Layer Management', function() {


  var fixtures = {
    _123: read('EditorMapEditLayerManagement.123.json'),
    _12:  read('EditorMapEditLayerManagement.12.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should create edit layer for existing record', function() {

    // ------------------------------------------------------------------------
    // When the edit form is opened for an existing record that is not loaded
    // on the map, a new edit layer should be created for the record.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures._123);
    var record3 = NL.getRecordListModels()[2];

    // Load map without record 3.
    NL.refreshMap(fixtures._12);

    // Open edit form for record 3.
    NL.navigate('record/'+record3.id);

    // Should create new layer for record 3.
    var record3Layer = NL.getVectorLayer('title3');
    expect(record3Layer.features[0].geometry.x).toEqual(0);
    expect(record3Layer.features[0].geometry.y).toEqual(3);
    NL.assertVectorLayerCount(3);

    // Record 3 layer should be edit layer.
    expect(NL.v.map.editLayer.id).toEqual(record3Layer.id);

  });


  it('should create edit layer for new record', function() {

    // ------------------------------------------------------------------------
    // When a new record is added, a new edit layer should be created.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures._123);

    // Add new record.
    NL.navigate('record/add');

    // Map should create new layer for unsaved record.
    expect(NL.v.map.layers.vector[undefined]).toBeDefined();
    NL.assertVectorLayerCount(4);

    // Map should set new layer as the edit layer.
    expect(NL.v.map.editLayer.neatline.model.id).toBeUndefined();

  });


  it('should not remove edit layer for existing record', function() {

    // ------------------------------------------------------------------------
    // When a record is being edited, the edit layer should not be removed if
    // new data is ingested that does not include the record.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures._123);
    var record3 = NL.getRecordListModels()[2];

    // Open form for record 3.
    NL.navigate('record/'+record3.id);

    // Load map without record 3.
    NL.refreshMap(fixtures._12);

    // Record 3 layer should still be present.
    expect(NL.getVectorLayer('title3')).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


  it('should not remove edit layer for new record', function() {

    // ------------------------------------------------------------------------
    // When a new record is created, the edit layer should not be removed when
    // new data is ingested.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures._123);

    // Add new record.
    NL.navigate('record/add');

    // Reload the map.
    NL.refreshMap(fixtures._12);

    // Edit layer still present.
    expect(NL.v.map.layers.vector[undefined]).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


  it('should resume updating the edit layer when edit ends', function() {

    // ------------------------------------------------------------------------
    // When the record form is closed, the layer that was previouly the edit
    // layer should start updating again in response to map moves.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures._123);
    var record3 = NL.getRecordListModels()[2];

    // Open record 3 form.
    NL.navigate('record/'+record3.id);

    // Close the form.
    NL.navigate('records');

    // Respond to map refresh.
    NL.respondMap200(fixtures._123);

    // Reload map without record 3.
    NL.refreshMap(fixtures._12);

    // Record 3 layer should be cleared.
    expect(NL.getVectorLayer('title3')).toBeUndefined();

  });


  it('should clear unsaved edit layer when edit ends', function() {

    // ------------------------------------------------------------------------
    // When a new record is added, but then the form is closed without being
    // saved, the edit layer that was created for the model should be garbage
    // collected by the next data ingest.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures._123);

    // Add new record.
    NL.navigate('record/add');

    // Close the form.
    NL.navigate('records');

    // Respond to map refresh.
    NL.respondMap200(fixtures._123);

    // Edit layer should be removed.
    expect(NL.getVectorLayer('title1')).toBeDefined();
    expect(NL.getVectorLayer('title2')).toBeDefined();
    expect(NL.getVectorLayer('title3')).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


});
