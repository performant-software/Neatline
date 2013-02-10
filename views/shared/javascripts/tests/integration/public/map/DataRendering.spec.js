
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map data manifestation.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Data Rendering', function() {


  var layer1, layer2, layer3;


  beforeEach(function() {

    _t.loadNeatline();

    layer1 = _t.vw.map.layers[0];
    layer2 = _t.vw.map.layers[1];
    layer3 = _t.vw.map.layers[2];

  });


  it('should load layers when the exhibit is started', function() {

    // --------------------------------------------------------------------
    // When the exhibit started, the map should query and render records.
    // --------------------------------------------------------------------

    expect(_t.vw.map.layers.length).toEqual(3);
    expect(layer1.features[0].geometry.x).toEqual(1);
    expect(layer1.features[0].geometry.y).toEqual(2);
    expect(layer2.features[0].geometry.x).toEqual(3);
    expect(layer2.features[0].geometry.y).toEqual(4);
    expect(layer3.features[0].geometry.x).toEqual(5);
    expect(layer3.features[0].geometry.y).toEqual(6);
  });


  it('should update layers when the map is moved', function() {

    // --------------------------------------------------------------------
    // Layers should be updated when the map is moved and the record data
    // has changed since the last data ingest.
    // --------------------------------------------------------------------

    var record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point at POINT(3 4).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(_t.vw.map.layers.length).toEqual(3);

    // Move map.
    _t.triggerMapMove();
    _t.respondLast200(_t.json.records.changed);

    // Route should be /records/:id, method GET.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Request should include map focus.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

    record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point should change to POINT(7 8).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(7);
    expect(record2Layer.features[0].geometry.y).toEqual(8);
    expect(_t.vw.map.layers.length).toEqual(3);

  });


  it('should remove layers when the map is moved', function() {

    // --------------------------------------------------------------------
    // Layers should be removed when the map is moved and records have
    // been removed since the last data ingest.
    // --------------------------------------------------------------------

    var record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point at POINT(3 4).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(_t.vw.map.layers.length).toEqual(3);

    // Move map.
    _t.triggerMapMove();
    _t.respondLast200(_t.json.records.removed);

    // Route should be /records/:id, method GET.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Request should include map focus.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

    // Record2 point should be removed.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();
    expect(_t.vw.map.layers.length).toEqual(2);

  });


  it('should render styles', function() {

    /*
     * Default:
     */

    // Fill color.
    expect(layer1.styleMap.styles.default.defaultStyle.fillColor).
      toEqual('#444444');
    expect(layer2.styleMap.styles.default.defaultStyle.fillColor).
      toEqual('#555555');

    // Stroke color.
    expect(layer1.styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('#777777');
    expect(layer2.styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('#888888');

    // Fill opacity
    expect(layer1.styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.14);

    // Stroke opacity
    expect(layer1.styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.20);

    // Graphic opacity
    expect(layer1.styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.22);
    expect(layer2.styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.23);

    // Stroke width.
    expect(layer1.styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(25);
    expect(layer2.styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(26);

    // Point radius.
    expect(layer1.styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(28);
    expect(layer2.styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(29);

    /*
     * Select:
     */

    // Fill color.
    expect(layer1.styleMap.styles.select.defaultStyle.fillColor).
      toEqual('#101010');
    expect(layer2.styleMap.styles.select.defaultStyle.fillColor).
      toEqual('#111111');

    // Stroke color.
    expect(layer1.styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('#777777');
    expect(layer2.styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('#888888');

    // Fill opacity
    expect(layer1.styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.17);

    // Stroke opacity
    expect(layer1.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.20);

    // Graphic opacity
    expect(layer1.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.22);
    expect(layer2.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.23);

    // Stroke width.
    expect(layer1.styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(25);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(26);

    // Point radius.
    expect(layer1.styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(28);
    expect(layer2.styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(29);

    /*
     * Temporary:
     */

    // Fill color.
    expect(layer1.styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('#101010');
    expect(layer2.styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('#111111');

    // Stroke color.
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('#777777');
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('#888888');

    // Fill opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.17);

    // Stroke opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.20);

    // Graphic opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.22);
    expect(layer2.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.23);

    // Stroke width.
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(25);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(26);

    // Point radius.
    expect(layer1.styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(28);
    expect(layer2.styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(29);

  });


});
