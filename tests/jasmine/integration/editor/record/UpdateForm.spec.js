
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Update Form', function() {


  var fx = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should update edit layer model', function() {

    // --------------------------------------------------------------------
    // When the record form model changes, the `nModel` attribute on the
    // map edit layer should be updated.
    // --------------------------------------------------------------------

    NL.showRecordForm(fx.record);

    // Update record form model.
    NL.vw.RECORD.model.set('id', 999);

    // Edit layer `nModel` should be updated.
    expect(NL.vw.MAP.editLayer.nModel.id).toEqual(999);

  });


});
