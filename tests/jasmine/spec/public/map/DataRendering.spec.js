
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map data rendering.
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

    layer1 = _t.vw.MAP.layers[0];
    layer2 = _t.vw.MAP.layers[1];
    layer3 = _t.vw.MAP.layers[2];

  });


  it('should load layers when the exhibit is started', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should automatically load records
    // that fall within the default viewport.
    // --------------------------------------------------------------------

    // Route should be /records/:id, method GET.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Request should include map focus.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

    expect(_t.vw.MAP.layers.length).toEqual(3);
    expect(layer1.features[0].geometry.x).toEqual(1);
    expect(layer1.features[0].geometry.y).toEqual(2);
    expect(layer2.features[0].geometry.x).toEqual(3);
    expect(layer2.features[0].geometry.y).toEqual(4);
    expect(layer3.features[0].geometry.x).toEqual(5);
    expect(layer3.features[0].geometry.y).toEqual(6);

  });


  it('should update layers when the map is moved', function() {

    // --------------------------------------------------------------------
    // When the map is moved or zoomed and records are requested for the
    // new viewport, layers for records that have _changed_ since the last
    // data ingest should be rebuilt to manifest the new data.
    // --------------------------------------------------------------------

    var record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point at POINT(3 4).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(_t.vw.MAP.layers.length).toEqual(3);

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
    expect(_t.vw.MAP.layers.length).toEqual(3);

  });


  it('should remove layers when the map is moved', function() {

    // --------------------------------------------------------------------
    // When the map is moved or zoomed and records are requested for the
    // new viewport, layers for records that are no longer present in the
    // collection - either because they no longer intersect the viewport
    // or because they were deleted - should be removed from the map.
    // --------------------------------------------------------------------

    var record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point at POINT(3 4).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(_t.vw.MAP.layers.length).toEqual(3);

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
    expect(_t.vw.MAP.layers.length).toEqual(2);

  });


  it('should render styles', function() {

    /*
     * Default:
     */

    // Fill color.
    expect(layer1.styleMap.styles['default'].defaultStyle.fillColor).
      toEqual('#444444');
    expect(layer2.styleMap.styles['default'].defaultStyle.fillColor).
      toEqual('#555555');

    // Stroke color.
    expect(layer1.styleMap.styles['default'].defaultStyle.strokeColor).
      toEqual('#777777');
    expect(layer2.styleMap.styles['default'].defaultStyle.strokeColor).
      toEqual('#888888');

    // Fill opacity
    expect(layer1.styleMap.styles['default'].defaultStyle.fillOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles['default'].defaultStyle.fillOpacity).
      toEqual(0.14);

    // Graphic opacity (same as fill opacity)
    expect(layer1.styleMap.styles['default'].defaultStyle.graphicOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles['default'].defaultStyle.graphicOpacity).
      toEqual(0.14);

    // Stroke opacity
    expect(layer1.styleMap.styles['default'].defaultStyle.strokeOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles['default'].defaultStyle.strokeOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles['default'].defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles['default'].defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles['default'].defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles['default'].defaultStyle.pointRadius).
      toEqual(26);

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

    // Graphic opacity (same as fill opacity)
    expect(layer1.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.17);

    // Stroke opacity
    expect(layer1.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(26);

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

    // Graphic opacity (same as fill opacity)
    expect(layer1.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.17);

    // Stroke opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(26);

  });


});
