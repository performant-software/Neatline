
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Events', function() {


  var fx = {
    records: read('EditorRecordsEvents.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should publish `highlight` on row mouseenter', function() {
    // TODO
  });


  it('should publish `unhighlight` on row mouseleave', function() {
    // TODO
  });


  it('should publish `select` on row click', function() {
    // TODO
  });


});
