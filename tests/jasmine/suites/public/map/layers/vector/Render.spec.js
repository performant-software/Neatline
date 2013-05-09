
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Vector Layer Rendering', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should construct vector layers for
    // records that arrive in the initial query.
    // --------------------------------------------------------------------

    NL.respondMap200(NL.json.MapVectorLayers.records.regular);
    var layers = NL.vw.MAP.getVectorLayers();

    // Should create layers for records.
    expect(layers[0].features[0].geometry.x).toEqual(1);
    expect(layers[0].features[0].geometry.y).toEqual(2);
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(4);
    expect(layers[2].features[0].geometry.x).toEqual(5);
    expect(layers[2].features[0].geometry.y).toEqual(6);
    NL.assertVectorLayerCount(3);

  });


  it('should load layers when map is moved', function() {

    // --------------------------------------------------------------------
    // New vector layers should be loaded when the map is moved.
    // --------------------------------------------------------------------

    NL.triggerMapMoveEnd();

    NL.respondLast200(NL.json.MapVectorLayers.records.regular);
    var layers = NL.vw.MAP.getVectorLayers();

    // Should create layers for records.
    expect(layers[0].features[0].geometry.x).toEqual(1);
    expect(layers[0].features[0].geometry.y).toEqual(2);
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(4);
    expect(layers[2].features[0].geometry.x).toEqual(5);
    expect(layers[2].features[0].geometry.y).toEqual(6);
    NL.assertVectorLayerCount(3);

  });


  it('should add new layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, new vector layers should be created for
    // records that were not present in the last collection.
    // --------------------------------------------------------------------

    // Load collection without record 3.
    NL.refreshMap(NL.json.MapVectorLayers.records.deleted);

    // Load collection with record 3.
    NL.refreshMap(NL.json.MapVectorLayers.records.regular);

    // Should create layer for record 3.
    expect(NL.getVectorLayer('title3')).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


  it('should not rebuild existing layers', function() {

    // --------------------------------------------------------------------
    // When records are ingested that already have vector layers on the
    // map, the existing layers should not be rebuilt.
    // --------------------------------------------------------------------

    NL.refreshMap(NL.json.MapVectorLayers.records.regular);

    // Store original OpenLayers id's.
    var olIds1 = _.map(_.values(NL.vw.MAP.layers.vector), function(v) {
      return v.id;
    });

    // Reload the same collection.
    NL.refreshMap(NL.json.MapVectorLayers.records.regular);

    // Get new OpenLayers id's.
    var olIds2 = _.map(_.values(NL.vw.MAP.layers.vector), function(v) {
      return v.id;
    });

    expect(olIds2).toEqual(olIds1);

  });


  it('should garbage collect stale layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, vector layers associated with records
    // that are no longer present in the collection should be removed.
    // --------------------------------------------------------------------

    // Load collection with record 3.
    NL.refreshMap(NL.json.MapVectorLayers.records.regular);

    // Load collection without record 3.
    NL.refreshMap(NL.json.MapVectorLayers.records.deleted);

    // Should remove layer for record 3.
    expect(NL.getVectorLayer('title3')).toBeUndefined();
    NL.assertVectorLayerCount(2);

  });


  it('should not garbage collect frozen layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, vector layers associated with records
    // that are absent from the new collection should _not_ be removed if
    // the `nFrozen` property is true.
    // --------------------------------------------------------------------

    // Load collection with record 3.
    NL.refreshMap(NL.json.MapVectorLayers.records.regular);

    // Freeze layer for record 3.
    NL.getVectorLayer('title3').nFrozen = true;

    // Load collection without record 3.
    NL.refreshMap(NL.json.MapVectorLayers.records.deleted);

    // Should not remove frozen layer.
    expect(NL.getVectorLayer('title3')).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


});
