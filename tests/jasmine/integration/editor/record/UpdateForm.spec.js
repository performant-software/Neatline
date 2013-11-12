
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Update Form', function() {


  var fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should update edit layer model', function() {

    // ------------------------------------------------------------------------
    // When the record form model changes, the `neatline.model` attribute on
    // the map edit layer should be updated.
    // ------------------------------------------------------------------------

    NL.showRecordForm(fixtures.record);

    // Update record form model.
    NL.v.record.model.set('id', 999);

    // Edit layer `neatline.model` should be updated.
    expect(NL.v.map.editLayer.neatline.model.id).toEqual(999);

  });


});
