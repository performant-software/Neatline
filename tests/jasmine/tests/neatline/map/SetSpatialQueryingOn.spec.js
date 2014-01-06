
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Set Spatial Querying On', function() {


  var fixtures = {
    one: readFixtures('NeatlineMapSpatialQueryingEnabled.one.json'),
    two: readFixtures('NeatlineMapSpatialQueryingEnabled.two.json')
  };


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapSpatialQueryingEnabled.html');
  });


  it('should query by extent/zoom when the exhibit starts', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the map should query for records that fall
    // within the default extent/zoom of the map.
    // ------------------------------------------------------------------------

    NL.assertMapDynamicQuery();

  });


  it('should query for records when the map is moved', function() {

    // ------------------------------------------------------------------------
    // When the map is panned or zoomed, the map should query for records that
    // fall within the current extent of the map.
    // ------------------------------------------------------------------------

    NL.triggerMapMoveEnd();
    NL.assertMapDynamicQuery();

  });


  it('should not ingest records when the map is being moved', function() {

    // ------------------------------------------------------------------------
    // If a record collection arrives in response to a map move event while
    // the map is being moved again, the new collection should not be ingested
    // on the map. This prevents a unsightly "jumping" effect in which vectors
    // are displaced from their proper locations.
    // ------------------------------------------------------------------------

    // Load collection with one record.
    NL.refreshMap(fixtures.one);
    NL.assertVectorLayerCount(1);

    NL.triggerMapMoveEnd();
    NL.triggerMapMoveStart();

    // The new collection should _not_ be ingested.
    NL.respondLast200(fixtures.two);
    NL.assertVectorLayerCount(1);

    NL.triggerMapMoveEnd();

    // The new collection _should_ be ingested.
    NL.respondLast200(fixtures.two);
    NL.assertVectorLayerCount(2);

  });


});
