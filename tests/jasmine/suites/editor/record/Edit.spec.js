
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form edit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Edit', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('should update edit layer model', function() {

    // --------------------------------------------------------------------
    // When the record form model changes, the `nModel` `attribute on the
    // map edit layer should be updated.
    // --------------------------------------------------------------------

    _t.showFirstRecordForm();

    // Update record form model.
    _t.vw.RECORD.model.set('id', 999);

    // Edit layer `nModel` should be updated.
    expect(_t.vw.MAP.editLayer.nModel.id).toEqual(999);

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

    _t.navigate('record/add');

    // Update record form.
    _t.vw.RECORD.model.set('id', 999);

    // `undefined` key should be replaced with new id.
    expect(_t.vw.MAP.layers.vector[undefined]).toBeUndefined();

    // The new id should point to the edit layer.
    expect(_t.vw.MAP.layers.vector[999].id).toEqual(
      _t.vw.MAP.editLayer.id);

  });


});
