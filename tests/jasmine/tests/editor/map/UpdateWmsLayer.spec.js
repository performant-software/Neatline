
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Update WMS Layer', function() {


  var fixtures = {
    add: {
      recordWms:    read('EditorMapWmsLayerUpdating.add.recordWms.json'),
      recordsNoWms: read('EditorMapWmsLayerUpdating.add.recordsNoWms.json'),
      recordsWms:   read('EditorMapWmsLayerUpdating.add.recordsWms.json')
    },
    reload: {
      record:       read('EditorMapWmsLayerUpdating.reload.record.json'),
      records:      read('EditorMapWmsLayerUpdating.reload.records.json')
    },
    update: {
      records1:     read('EditorMapWmsLayerUpdating.update.records1.json'),
      records2:     read('EditorMapWmsLayerUpdating.update.records2.json'),
      record2:      read('EditorMapWmsLayerUpdating.update.record2.json')
    },
    remove: {
      records1:     read('EditorMapWmsLayerUpdating.remove.records1.json'),
      records2:     read('EditorMapWmsLayerUpdating.remove.records2.json'),
      record2:      read('EditorMapWmsLayerUpdating.remove.record2.json')
    }
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should add a new WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When a WMS address and layers are entered in the record form and the
    // record is saved, the new WMS layer should immediately be added to the
    // map by the layer refresh.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.add.recordsNoWms);
    NL.respondMap200(fixtures.add.recordsNoWms);

    // Open edit form, get the edit layer.
    NL.navigate('record/'+NL.getRecordListModelByTitle('title').id);
    var vectorLayer1 = NL.getVectorLayer('title');

    // 1 vector layer, 0 WMS.
    NL.assertVectorLayerCount(1);
    NL.assertWmsLayerCount(0);

    // Save the form, respond with new WMS layer.
    NL.v.record.$('a[name="save"]').trigger('click');
    NL.respondLast200(fixtures.add.recordWms);
    NL.respondMap200(fixtures.add.recordsWms);

    // 1 vector layer, 1 WMS.
    NL.assertVectorLayerCount(1);
    NL.assertWmsLayerCount(1);

    // Should render new WMS layer.
    var newWmsLayer = NL.getWmsLayer('title');
    expect(newWmsLayer.params.LAYERS).toEqual('layers');
    expect(newWmsLayer.url).toEqual('address');

    // Vector layer should be unchanged.
    var vectorLayer2 = NL.getVectorLayer('title');
    expect(vectorLayer2.id).toEqual(vectorLayer1.id);

  });


  it('should reload an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved without changes to the WMS fields, the WMS layer should be re-
    // loaded without modification.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.reload.records);
    NL.respondMap200(fixtures.reload.records);

    // Open edit form, get the edit layer.
    NL.navigate('record/'+NL.getRecordListModelByTitle('title').id);
    var vectorLayer1 = NL.getVectorLayer('title');

    // 1 vector layer, 1 WMS.
    NL.assertVectorLayerCount(1);
    NL.assertWmsLayerCount(1);

    // Should render existing WMS layer.
    var wmsLayer1 = NL.getWmsLayer('title');
    expect(wmsLayer1.params.LAYERS).toEqual('layers');
    expect(wmsLayer1.url).toEqual('address');

    // Save the form, respond with unchanged layer.
    NL.v.record.$('a[name="save"]').trigger('click');
    NL.respondLast200(fixtures.reload.record);
    NL.respondMap200(fixtures.reload.records);

    // Should re-render WMS layer.
    var wmsLayer2 = NL.getWmsLayer('title');
    expect(wmsLayer2.params.LAYERS).toEqual('layers');
    expect(wmsLayer2.url).toEqual('address');

    // Vector layer should be unchanged.
    var vectorLayer2 = NL.getVectorLayer('title');
    expect(vectorLayer2.id).toEqual(vectorLayer1.id);

  });


  it('should update an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved _with_ changes to the WMS fields, the WMS layer should be re-
    // loaded with the new values.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.update.records1);
    NL.respondMap200(fixtures.update.records1);

    // Open edit form, get the edit layer.
    NL.navigate('record/'+NL.getRecordListModelByTitle('title').id);
    var vectorLayer1 = NL.getVectorLayer('title');

    // 1 vector layer, 1 WMS.
    NL.assertVectorLayerCount(1);
    NL.assertWmsLayerCount(1);

    // Should render existing WMS layer.
    var wmsLayer1 = NL.getWmsLayer('title');
    expect(wmsLayer1.params.LAYERS).toEqual('layers1');
    expect(wmsLayer1.url).toEqual('address1');

    // Save the form, respond with changed layer.
    NL.v.record.$('a[name="save"]').trigger('click');
    NL.respondLast200(fixtures.update.record2);
    NL.respondMap200(fixtures.update.records2);

    // Should rebuild WMS layer.
    var wmsLayer2 = NL.getWmsLayer('title');
    expect(wmsLayer2.params.LAYERS).toEqual('layers2');
    expect(wmsLayer2.url).toEqual('address2');

    // Vector layer should be unchanged.
    var vectorLayer2 = NL.getVectorLayer('title');
    expect(vectorLayer2.id).toEqual(vectorLayer1.id);

  });


  it('should remove an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved with empty WMS fields, the WMS layer should be removed.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.remove.records1);
    NL.respondMap200(fixtures.remove.records1);

    // Open edit form, get the edit layer.
    NL.navigate('record/'+NL.getRecordListModelByTitle('title').id);
    var vectorLayer1 = NL.getVectorLayer('title');

    // 1 vector layer, 1 WMS.
    NL.assertVectorLayerCount(1);
    NL.assertWmsLayerCount(1);

    // Should render existing WMS layer.
    var wmsLayer1 = NL.getWmsLayer('title');
    expect(wmsLayer1.params.LAYERS).toEqual('layers');
    expect(wmsLayer1.url).toEqual('address');

    // Save the form, respond with removed layer.
    NL.v.record.$('a[name="save"]').trigger('click');
    NL.respondLast200(fixtures.remove.record2);
    NL.respondMap200(fixtures.remove.records2);

    // 1 vector layer, 0 WMS.
    NL.assertVectorLayerCount(1);
    NL.assertWmsLayerCount(0);

    // Vector layer should be unchanged.
    var vectorLayer2 = NL.getVectorLayer('title');
    expect(vectorLayer2.id).toEqual(vectorLayer1.id);

  });


});
