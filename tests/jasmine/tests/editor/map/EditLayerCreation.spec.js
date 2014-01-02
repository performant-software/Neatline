
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Edit Layer Creation', function() {


  var record3, fixtures = {
    records12:  read('EditorMapEditLayerCreation.records12.json'),
    records123: read('EditorMapEditLayerCreation.records123.json'),
    record3:    read('EditorMapEditLayerCreation.record3.json')
  };


  beforeEach(function() {
    NL.loadEditor();
    record3 = NL.recordFromJson(fixtures.record3);
  });


  describe('when the record is loaded in the records list', function() {

    it('should use existing layer when one exists', function() {

      // ----------------------------------------------------------------------
      // When a record is (a) loaded in the records list and (b) loaded on the
      // map, the existing layer should be used as the edit layer.
      // ----------------------------------------------------------------------

      NL.respondRecordList200(fixtures.records123);
      NL.respondMap200(fixtures.records123);

      // 3 layers at the start.
      NL.assertVectorLayerCount(3);

      // Open edit form for record 3.
      NL.navigate('record/'+record3.id);

      // Record 3 layer should be converted to the edit layer.
      expect(NL.v.map.editLayer.id).toEqual(NL.getVectorLayer('title3').id);

      // No new layer created.
      NL.assertVectorLayerCount(3);

    });

    it('should create new layer when none exists', function() {

      // ----------------------------------------------------------------------
      // When a record is loaded in the records list but _not_ loaded on the
      // map, a new edit layer should be created for the record.
      // ----------------------------------------------------------------------

      NL.respondRecordList200(fixtures.records123);
      NL.respondMap200(fixtures.records12);

      // 2 layers at the start.
      NL.assertVectorLayerCount(2);

      // Open edit form for record 3.
      NL.navigate('record/'+record3.id);

      // Should add new layer for record 3.
      var record3Layer = NL.getVectorLayer('title3');
      expect(record3Layer.features[0].geometry.x).toEqual(5);
      expect(record3Layer.features[0].geometry.y).toEqual(6);
      NL.assertVectorLayerCount(3);

      // Record 3 layer should be edit layer.
      expect(NL.v.map.editLayer.id).toEqual(record3Layer.id);

    });

  });


  describe('when the record is not loaded in the records list', function() {

    it('should use existing layer when one exists', function() {

      // ----------------------------------------------------------------------
      // When a record is _not_ loaded in the records list but loaded on the
      // map, the existing layer should be used as the edit layer.
      // ----------------------------------------------------------------------

      NL.respondRecordList200(fixtures.records12);
      NL.respondMap200(fixtures.records12);

      // 2 layers at the start.
      NL.assertVectorLayerCount(2);

      // Open edit form for record 3.
      NL.navigate('record/'+record3.id);

      // Respond to record list request.
      NL.respondLast200(fixtures.record3);

      // Record 3 layer should be converted to the edit layer.
      expect(NL.v.map.editLayer.id).toEqual(NL.getVectorLayer('title3').id);

      // No new layer created.
      NL.assertVectorLayerCount(3);

    });

    it('should create new layer when none exists', function() {

      // ----------------------------------------------------------------------
      // When a record is _not_ loaded in the records list and _not_ loaded on
      // the map, the record should be loaded an used to build the edit layer.
      // ----------------------------------------------------------------------

      NL.respondRecordList200(fixtures.records12);
      NL.respondMap200(fixtures.records12);

      // 2 layers at the start.
      NL.assertVectorLayerCount(2);

      // Open edit form for record 3.
      NL.navigate('record/'+record3.id);

      // Respond to record list request.
      NL.respondLast200(fixtures.record3);

      // Should add new layer for record 3.
      var record3Layer = NL.getVectorLayer('title3');
      expect(record3Layer.features[0].geometry.x).toEqual(5);
      expect(record3Layer.features[0].geometry.y).toEqual(6);
      NL.assertVectorLayerCount(3);

      // Record 3 layer should be edit layer.
      expect(NL.v.map.editLayer.id).toEqual(record3Layer.id);

    });

  });


  it('should create new layer when record is added', function() {

    // ------------------------------------------------------------------------
    // When a new record is added, a new edit layer should be created.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records123);

    // Add new record.
    NL.navigate('record/add');

    // Map should create new layer for unsaved record.
    expect(NL.v.map.layers.vector[undefined]).toBeDefined();
    NL.assertVectorLayerCount(4);

    // Map should set new layer as the edit layer.
    expect(NL.v.map.editLayer.neatline.model.id).toBeUndefined();

  });


});
