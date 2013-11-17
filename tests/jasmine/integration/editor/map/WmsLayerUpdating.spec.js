
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | WMS Layer Updating', function() {


  var fixtures = {
    add: {
      noWms:  read('EditorMapWmsLayerUpdating.add.noWms.json'),
      wms:    read('EditorMapWmsLayerUpdating.add.wms.json')
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

    //NL.respondRecordList200(fixtures.add.noWms);
    //NL.respondMap200(fixtures.add.noWms);

    //// Open edit form, get the edit layer.
    //NL.navigate('record/'+NL.getRecordListModelByTitle('title').id);
    //var vectorLayer1 = NL.getVectorLayer('title');

    //// 1 vector layer, 0 WMS.
    //NL.assertVectorLayerCount(1);
    //NL.assertWmsLayerCount(0);

    //// Save the form, respond with new WMS layer.
    //NL.v.record.$('a[name="save"]').trigger('click');
    //NL.respondMap200(fixtures.add.wms);

    //// 1 vector layer, 1 WMS.
    //NL.assertVectorLayerCount(1);
    //NL.assertWmsLayerCount(1);

    //// Should render new WMS layer.
    //var newWmsLayer = NL.getWmsLayer('title');
    //expect(newWmsLayer.params.LAYERS).toEqual('layers');
    //expect(newWmsLayer.url).toEqual('address');

    //// Vector layer should be unchanged.
    //var vectorLayer2 = NL.getVectorLayer('title');
    //expect(vectorLayer2.id).toEqual(vectorLayer1.id);

  });


  it('should reload an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved without changes to the WMS fields, the WMS layer should be re-
    // loaded without modification.
    // ------------------------------------------------------------------------

  });


  it('should update an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved _with_ changes to the WMS fields, the WMS layer should be re-
    // loaded with the new values.
    // ------------------------------------------------------------------------

  });


  it('should remove an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved with empty WMS fields, the WMS layer should be removed.
    // ------------------------------------------------------------------------

  });


});
