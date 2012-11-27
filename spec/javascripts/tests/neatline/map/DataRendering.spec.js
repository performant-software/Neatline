
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for map data manifestation.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Data Rendering', function() {

  var server, layers;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');
  var jsonChangedData = readFixtures('records-changed-data.json');
  var jsonRemovedData = readFixtures('records-removed-record.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('neatline-partial.html');
    server = sinon.fakeServer.create();

    // Run Neatline.
    _t.loadNeatline();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

    // Get layers.
    layers = _t.getVectorLayers(); layer = layers[0];

  });

  it('should render features for map-active models', function() {

    // Check geometry.
    expect(layers.length).toEqual(2);
    expect(layers[0].features[0].geometry.x).toEqual(1);
    expect(layers[0].features[0].geometry.y).toEqual(1);
    expect(layers[1].features[0].geometry.x).toEqual(2);
    expect(layers[1].features[0].geometry.y).toEqual(2);

  });

  it('should not change data for frozen record', function() {

    // Get Record 2 layer.
    var record2Layer = _.find(layers, function(layer) {
      return layer.name == 'Record 2';
    });

    // Set frozen.
    _t.map.frozen.push(record2Layer.nId);

    // Trigger a map move, inject fixture.
    _t.map.map.events.triggerEvent('moveend');
    var request = _.last(server.requests);
    _t.respond200(request, jsonChangedData);

    // Get the new layer for record 2
    var newLayers = _t.getVectorLayers();
    record2Layer = _.find(newLayers, function(layer) {
      return layer.name == 'Record 2';
    });

    // Check geometry.
    expect(record2Layer.features[0].geometry.x).toEqual(2);
    expect(record2Layer.features[0].geometry.y).toEqual(2);

  });

  it('should not remove data for frozen record', function() {

    // Get Record 2 layer.
    var record2Layer = _.find(layers, function(layer) {
      return layer.name == 'Record 2';
    });

    // Set frozen.
    _t.map.frozen.push(record2Layer.nId);

    // Trigger a map move, inject fixture.
    _t.map.map.events.triggerEvent('moveend');
    var request = _.last(server.requests);
    _t.respond200(request, jsonRemovedData);

    // Get the new layer for record 2
    var newLayers = _t.getVectorLayers();
    record2Layer = _.find(newLayers, function(layer) {
      return layer.name == 'Record 2';
    });

    // Check geometry.
    expect(record2Layer.features[0].geometry.x).toEqual(2);
    expect(record2Layer.features[0].geometry.y).toEqual(2);

  });

  it('should render styles', function() {

    /*
     * Default:
     */

    // Fill color.
    expect(layers[0].styleMap.styles.default.defaultStyle.fillColor).
      toEqual('#111111');
    expect(layers[1].styleMap.styles.default.defaultStyle.fillColor).
      toEqual('#222222');

    // Stroke color.
    expect(layers[0].styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('#444444');
    expect(layers[1].styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('#555555');

    // Fill opacity
    expect(layers[0].styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.01);
    expect(layers[1].styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.02);

    // Stroke opacity
    expect(layers[0].styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.07);
    expect(layers[1].styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.08);

    // Graphic opacity
    expect(layers[0].styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.1);
    expect(layers[1].styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.11);

    // Stroke width.
    expect(layers[0].styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(13);
    expect(layers[1].styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(14);

    // Point radius.
    expect(layers[0].styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(16);
    expect(layers[1].styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(17);

    /*
     * Select:
     */

    // Fill color.
    expect(layers[0].styleMap.styles.select.defaultStyle.fillColor).
      toEqual('#777777');
    expect(layers[1].styleMap.styles.select.defaultStyle.fillColor).
      toEqual('#888888');

    // Stroke color.
    expect(layers[0].styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('#444444');
    expect(layers[1].styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('#555555');

    // Fill opacity
    expect(layers[0].styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.04);
    expect(layers[1].styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.05);

    // Stroke opacity
    expect(layers[0].styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.07);
    expect(layers[1].styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.08);

    // Graphic opacity
    expect(layers[0].styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.1);
    expect(layers[1].styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.11);

    // Stroke width.
    expect(layers[0].styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(13);
    expect(layers[1].styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(14);

    // Point radius.
    expect(layers[0].styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(16);
    expect(layers[1].styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(17);

    /*
     * Temporary:
     */

    // Fill color.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('#777777');
    expect(layers[1].styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('#888888');

    // Stroke color.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('#444444');
    expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('#555555');

    // Fill opacity
    expect(layers[0].styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.04);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.05);

    // Stroke opacity
    expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.07);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.08);

    // Graphic opacity
    expect(layers[0].styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.1);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.11);

    // Stroke width.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(13);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(14);

    // Point radius.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(16);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(17);

  });

});
