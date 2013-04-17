
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map record record ingesting.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Record Ingesting', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should query for records when the exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should query for records that fall
    // within the default extent of the map.
    // --------------------------------------------------------------------

    _t.assertMapExtentQuery();

  });


  it('should query for records when the map is moved', function() {

    // --------------------------------------------------------------------
    // When the map is panned or zoomed, the map should query for records
    // that fall within the current extent of the map.
    // --------------------------------------------------------------------

    _t.triggerMapMoveEnd();
    _t.assertMapExtentQuery();

  });


  it('should not ingest records when the map is being moved', function() {
    
  });


});
