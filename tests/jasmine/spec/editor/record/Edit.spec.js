
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


  var vw;


  beforeEach(function() {

    _t.loadEditor();
    _t.openFirstRecordForm();

    vw = {
      map:      Neatline.Map.__view,
      record:   Neatline.Editor.Record.__view
    };

  });


  it('should update the model on the edit layer', function() {

    // --------------------------------------------------------------------
    // When the record form model changes, `nModel` and `nId` attributes
    // on the map edit layer should be updated.
    // --------------------------------------------------------------------

    vw.record.model.set('id', 999);

    // Edit layer `nModel` and `nId` should be updated.
    expect(vw.map.editLayer.nModel.get('id')).toEqual(999);
    expect(vw.map.editLayer.nId).toEqual(999);

  });


});
