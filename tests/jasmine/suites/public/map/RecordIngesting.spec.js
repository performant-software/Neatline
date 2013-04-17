
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

    // --------------------------------------------------------------------
    // If a record collection arrives in response to a previous map move
    // end event _while the map is being moved again_, the new collection
    // should not be ingested on the map. This is necessary in order to
    // prevent a distracting "jumping" visual effect in which vectors are
    // displaced from their proper locations.
    // --------------------------------------------------------------------

    // Load collection with one record.
    _t.refreshMap(_t.json.MapRecordIngesting.records.one);
    _t.assertVectorLayerCount(1);

    _t.triggerMapMoveEnd();
    _t.triggerMapMoveStart();

    // The new collection should _not_ be ingested.
    _t.respondLast200(_t.json.MapRecordIngesting.records.two);
    _t.assertVectorLayerCount(1);

    _t.triggerMapMoveEnd();

    // The new collection should be ingested.
    _t.respondLast200(_t.json.MapRecordIngesting.records.two);
    _t.assertVectorLayerCount(2);

  });


});
