
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Edit', function() {


  var fx = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should update edit layer model', function() {

    // --------------------------------------------------------------------
    // When the record form model changes, the `nModel` `attribute on the
    // map edit layer should be updated.
    // --------------------------------------------------------------------

    NL.showRecordForm(fx.record);

    // Update record form model.
    NL.vw.RECORD.model.set('id', 999);

    // Edit layer `nModel` should be updated.
    expect(NL.vw.MAP.editLayer.nModel.id).toEqual(999);

  });


  it('should update edit layer in id-to-layer tracker', function() {

    // --------------------------------------------------------------------
    // When a new record is saved for the first time and the `id` field on
    // the record form model is populated for the first time, the tracker
    // object that associates id's with vector layers should be updated so
    // that the new id points to the edit layer. This prevents the edit
    // layer from being "double-loaded" - once as the existing edit layer
    // that was created with the new record was added (identified by the
    // `undefined` key in the tracker), and again as the newly-created
    // record on the server that will start getting loaded when the map is
    // moved (identified by the new id). By replacing the `undefined` key
    // with the new id, we block the new record from being loaded, since
    // the record is already represented on the map by the edit layer.
    // --------------------------------------------------------------------

    NL.navigate('record/add');

    // Update record form.
    NL.vw.RECORD.model.set('id', 999);

    // `undefined` key should be replaced with new id.
    expect(NL.vw.MAP.layers.vector[undefined]).toBeUndefined();

    // The new id should point to the edit layer.
    expect(NL.vw.MAP.layers.vector[999].id).toEqual(
      NL.vw.MAP.editLayer.id
    );

  });


});
