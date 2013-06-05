
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `select` (Vector Layers)', function() {


  var model, fx = {
    records: readFixtures('NeatlineMapSubscriptions.records.json'),
    record:  readFixtures('NeatlineMapSubscriptions.record.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should focus when a layer already exists', function() {

    // --------------------------------------------------------------------
    // When `select` is triggered with a record that has a vector layer
    // on the map, the map should focus on the existing layer.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.records);

    // Get layer, cache request count.
    var layer = NL.vw.MAP.getVectorLayers()[0];
    var count = NL.server.requests.count;

    Neatline.vent.trigger('select', { model: layer.nModel });

    // Should not load record from server.
    expect(NL.server.requests.count).toEqual(count);

    // Map should focus.
    NL.assertMapViewport(100, 200, 10);

  });


  it('should create layer and focus when no layer exists', function() {

    // --------------------------------------------------------------------
    // When `select` is triggered with a record that does _not_ have a
    // vector layer on the map, the map should create a new layer for the
    // record and focus on it.
    // --------------------------------------------------------------------

    // Create model with no vector layer.
    var model = NL.recordFromJson(fx.record);
    var count = NL.server.requests.count;

    Neatline.vent.trigger('select', { model: model });

    // Should not load record from server.
    expect(NL.server.requests.count).toEqual(count);

    // New layer should be created for model.
    var layer = NL.vw.MAP.getVectorLayers()[0];
    expect(layer.features[0].geometry.x).toEqual(1);
    expect(layer.features[0].geometry.y).toEqual(2);

    // Map should focus.
    NL.assertMapViewport(100, 200, 10);

  });


  it('should select the layer', function() {

    // --------------------------------------------------------------------
    // When `select` is triggered, features on the corresponding vector
    // layer should be selected as if they had been clicked by the cursor.
    // For example, they should not respond to highlight events - when the
    // cursor leaves a feature, it should not be unhighlighted.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.records);

    // Select model for the vector layer.
    var layer = NL.vw.MAP.getVectorLayers()[0];
    Neatline.vent.trigger('select', { model: layer.nModel });

    // Hover, then unhover.
    NL.hoverOnMapFeature(layer.features[0]);
    NL.unHoverOnMapFeature();

    // Should not unhighlight.
    NL.assertSelectIntent(layer);

  });


  it('should be possible to unselect the layer', function() {

    // --------------------------------------------------------------------
    // When a layer is selected in response to a `select` event, it should
    // be possible to unselect the layer by clicking on the base layer.
    // --------------------------------------------------------------------

    // TODO

  });


  it('should not focus when feature is clicked', function() {

    // --------------------------------------------------------------------
    // When a map feature is clicked, the map should _not_ focus on the
    // record that corresponds to the clicked feature. This prevents
    // disorienting leaps that can occur when the record's zoom level is
    // much higher is much higher or lower the current map zoom.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.records);
    var feature = NL.vw.MAP.getVectorLayers()[0].features[0];

    // Set center and zoom.
    NL.setMapCenter(200, 300, 15);

    // Click on feature.
    NL.clickOnMapFeature(feature);

    // Focus should be unchanged.
    NL.assertMapViewport(200, 300, 15);

  });


});
