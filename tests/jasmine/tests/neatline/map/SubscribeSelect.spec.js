
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `select`', function() {


  var slug = 'NeatlineMapSubscribeSelect'


  var fixtures = {
    records:        readFixtures(slug+'.records.json'),
    noFocusNoZoom:  readFixtures(slug+'.noFocusNoZoom.json'),
    focusNoZoom:    readFixtures(slug+'.focusNoZoom.json'),
    zoomNoFocus:    readFixtures(slug+'.zoomNoFocus.json'),
    focusAndZoom:   readFixtures(slug+'.focusAndZoom.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should select a vector layer', function() {

    // ------------------------------------------------------------------------
    // When `select` is triggered with a record that has a vector layer on the
    // map, the map should select the features.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    NL.assertSelectIntent(layer);

  });


  it('should select a WMS layer', function() {

    // ------------------------------------------------------------------------
    // If the record has a WMS layer, the opacity should be bumped up to the
    // "Fill Opacity (Selected)" value.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getWmsLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    expect(layer.opacity).toEqual(0.6);

  });


  describe('should focus and zoom on the record', function() {

    beforeEach(function() {
      NL.setMapZoom(1);
    });

    it('no focus, no zoom', function() {

      // ----------------------------------------------------------------------
      // When neither a custom focus nor zoom is provided, the viewport should
      // center around the geometric extent of the record's geometry.
      // ----------------------------------------------------------------------

      NL.respondMap200(fixtures.records);

      // Select a record with no focus or zoom.
      var model = NL.recordFromJson(fixtures.noFocusNoZoom);
      Neatline.vent.trigger('select', { model: model });

      // Should auto-focus.
      NL.assertMapFocus(1, 2);

      // Should auto-zoom.
      expect(NL.getMapZoom()).toBeGreaterThan(1);

    });

    it('focus, no zoom', function() {

      // ----------------------------------------------------------------------
      // When a record has a defined focus but no zoom, the focus should be
      // applied and the viewport should zoom to fit the geometry.
      // ----------------------------------------------------------------------

      NL.respondMap200(fixtures.records);

      // Select a record with a focus but no zoom.
      var model = NL.recordFromJson(fixtures.focusNoZoom);
      Neatline.vent.trigger('select', { model: model });

      // Should apply custom focus.
      NL.assertMapFocus(100, 200);

      // Should auto-zoom.
      expect(NL.getMapZoom()).toBeGreaterThan(1);

    });

    it('zoom, no focus', function() {

      // ----------------------------------------------------------------------
      // When a record has a defined zoom but no focus, the zoom should be
      // applied and the viewport should focus on the geometric center.
      // ----------------------------------------------------------------------

      NL.respondMap200(fixtures.records);

      // Select a record with a zoom but no focus.
      var model = NL.recordFromJson(fixtures.zoomNoFocus);
      Neatline.vent.trigger('select', { model: model });

      // Should auto-focus.
      NL.assertMapFocus(5, 6);

      // Should apply custom zoom.
      NL.assertMapZoom(10);

    });

    it('focus and zoom', function() {

      // ----------------------------------------------------------------------
      // When both a custom focus and zoom are provided, apply both.
      // ----------------------------------------------------------------------

      NL.respondMap200(fixtures.records);

      // Select a record with a focus and zoom.
      var model = NL.recordFromJson(fixtures.focusAndZoom);
      Neatline.vent.trigger('select', { model: model });

      // Should apply custom focus.
      NL.assertMapFocus(100, 200);

      // Should apply custom zoom.
      NL.assertMapZoom(10);

    });

  });


  it('should focus on existing layer when one exists', function() {

    // ------------------------------------------------------------------------
    // When `select` is triggered with a record that has a vector layer on the
    // map, the map should focus on the existing layer.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);

    // Get layer, cache request count.
    var model = NL.recordFromJson(fixtures.focusAndZoom);
    var count = NL.server.requests.count;

    Neatline.vent.trigger('select', { model: model });

    // Should not load record from server.
    expect(NL.server.requests.count).toEqual(count);

    // Map should focus.
    NL.assertMapFocus(100, 200);
    NL.assertMapZoom(10);

  });


  it('should create layer and focus when no layer exists', function() {

    // ------------------------------------------------------------------------
    // When `select` is triggered with a record that does _not_ have a vector
    // layer on the map, the map should create a new layer for the record and
    // focus on it.
    // ------------------------------------------------------------------------

    // Create model with no vector layer.
    var model = NL.recordFromJson(fixtures.focusAndZoom);
    var count = NL.server.requests.count;

    Neatline.vent.trigger('select', { model: model });

    // Should not load record from server.
    expect(NL.server.requests.count).toEqual(count);

    // New layer should be created for model.
    var layer = NL.v.map.getVectorLayers()[0];
    expect(layer.features[0].geometry.x).toEqual(7);
    expect(layer.features[0].geometry.y).toEqual(8);

    // Map should focus.
    NL.assertMapFocus(100, 200);
    NL.assertMapZoom(10);

  });


  it('should reselect currently selected layer after ingest', function() {

    // ------------------------------------------------------------------------
    // When a layer is selected and the map is refreshed, the previously-
    // selected layer should be re-selected after the new layers are added (it
    // will be automatically unselected when the highlight and select controls
    // are updated with the new set of layers).
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);

    // Select model for the vector layer.
    var layer = NL.v.map.getVectorLayers()[0];
    Neatline.vent.trigger('select', { model: layer.neatline.model });

    // Ingest fresh records.
    NL.refreshMap(fixtures.records);

    // Should re-select layer.
    NL.assertSelectIntent(layer);

  });


  it('should not focus when feature is clicked', function() {

    // ------------------------------------------------------------------------
    // When a map feature is clicked, the map should _not_ focus on the record
    // that corresponds to the feature. This prevents disorienting leaps that
    // can occur when the record's zoom level is much higher is much higher or
    // lower the current map zoom.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var feature = NL.v.map.getVectorLayers()[0].features[0];

    // Set center and zoom.
    NL.setMapCenter(200, 300, 15);

    // Click on feature.
    NL.clickOnMapFeature(feature);

    // Focus should be unchanged.
    NL.assertMapFocus(200, 300);
    NL.assertMapZoom(15);

  });


});
