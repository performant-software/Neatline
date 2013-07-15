
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Spatial Querying Disabled', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapSpatialQueryingDisabled.html');
  });


  it('should query for records when the exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should query for all records that
    // are plotted on the map.
    // --------------------------------------------------------------------

    NL.assertMapStaticQuery();

  });


  it('should not query for records when the map is moved', function() {

    // --------------------------------------------------------------------
    // When the map is moved, the map should not query for new records.
    // --------------------------------------------------------------------

    var c1 = NL.server.requests.length;
    NL.triggerMapMoveEnd();
    var c2 = NL.server.requests.length;
    expect(c2).toEqual(c1);

  });


});
