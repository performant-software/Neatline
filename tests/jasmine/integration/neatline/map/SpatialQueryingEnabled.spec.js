
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Spatial Querying Enabled', function() {


  var fx = {
    one: readFixtures('NeatlineMapSpatialQueryingEnabled.one.json'),
    two: readFixtures('NeatlineMapSpatialQueryingEnabled.two.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should query for records when the exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should query for records that fall
    // within the default extent of the map.
    // --------------------------------------------------------------------

    NL.assertMapExtentQuery();

  });


  it('should query for records when the map is moved', function() {

    // --------------------------------------------------------------------
    // When the map is panned or zoomed, the map should query for records
    // that fall within the current extent of the map.
    // --------------------------------------------------------------------

    NL.triggerMapMoveEnd();
    NL.assertMapExtentQuery();

  });


  it('should not ingest records when the map is being moved', function() {

    // --------------------------------------------------------------------
    // If a record collection arrives in response to a previous map move
    // end event _while the map is being moved again_, the new collection
    // should not be ingested on the map. This is necessary in order to
    // prevent a distracting "jumping" visual effect in which vectors are
    // displaced from their proper locations.
    // --------------------------------------------------------------------

    // Load collection with one record.
    NL.refreshMap(fx.one);
    NL.assertVectorLayerCount(1);

    NL.triggerMapMoveEnd();
    NL.triggerMapMoveStart();

    // The new collection should _not_ be ingested.
    NL.respondLast200(fx.two);
    NL.assertVectorLayerCount(1);

    NL.triggerMapMoveEnd();

    // The new collection _should_ be ingested.
    NL.respondLast200(fx.two);
    NL.assertVectorLayerCount(2);

  });


});
