
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


  var mapLayers, layer1, layer2, layer3;


  beforeEach(function() {

    _t.loadNeatline();

    mapLayers = _t.getVectorLayers();
    layer1 = mapLayers[0];
    layer2 = mapLayers[1];
    layer3 = mapLayers[2];

  });


  it('should render layers for models', function() {

    // --------------------------------------------------------------------
    // When the exhibit started, the map should query and render records.
    // --------------------------------------------------------------------

    expect(mapLayers.length).toEqual(3);
    expect(layer1.features[0].geometry.x).toEqual(1);
    expect(layer1.features[0].geometry.y).toEqual(2);
    expect(layer2.features[0].geometry.x).toEqual(3);
    expect(layer2.features[0].geometry.y).toEqual(4);
    expect(layer3.features[0].geometry.x).toEqual(5);
    expect(layer3.features[0].geometry.y).toEqual(6);
  });


  it('should update layers when the map is moved', function() {

    // --------------------------------------------------------------------
    // The records collection should be reloaded when the map is moved.
    // --------------------------------------------------------------------

    var record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point at POINT(3 4).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(_t.getVectorLayers().length).toEqual(3);

    _t.triggerMapMove();
    _t.respondLast200(_t.json.records.changed);

    record2Layer = _t.getVectorLayerByTitle('title2');

    // Record2 point at POINT(7 8).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(7);
    expect(record2Layer.features[0].geometry.y).toEqual(8);
    expect(_t.getVectorLayers().length).toEqual(3);

    _t.triggerMapMove();
    _t.respondLast200(_t.json.records.removed);

    // Record2 point removed.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();
    expect(_t.getVectorLayers().length).toEqual(2);

  });

  // it('should not remove data for frozen record', function() {

  //   // --------------------------------------------------------------------
  //   // When a record is set to frozen (for example, when the edit form for
  //   // the record is open in the editor), the layer1 for the record should
  //   // not be removed if a new data set is ingested in which the record is
  //   // absent. This is to prevent new, unsaved changes to the geometry
  //   // from being lost when the map is moved.
  //   // --------------------------------------------------------------------

  //   // At start, title2 layer1 exists.
  //   var record2Layer = _t.getVectorLayerByTitle('title2');
  //   expect(record2Layer).toBeDefined();

  //   // Set title2 frozen.
  //   _t.vw.map.freeze(record2Layer.nId);

  //   // Trigger a map move, inject data without title2.
  //   _t.refreshMap(_t.removedRecord2Json);

  //   // title2 layer1 still exists.
  //   expect(_t.getVectorLayerByTitle('title2')).toBeDefined();

  // });


  it('should render styles', function() {

    /*
     * Default:
     */

    // Fill color.
    expect(layer1.styleMap.styles.default.defaultStyle.fillColor).
      toEqual('1');
    expect(layer2.styleMap.styles.default.defaultStyle.fillColor).
      toEqual('2');

    // Stroke color.
    expect(layer1.styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('4');
    expect(layer2.styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('5');

    // Fill opacity
    expect(layer1.styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.10);
    expect(layer2.styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.11);

    // Stroke opacity
    expect(layer1.styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.17);

    // Graphic opacity
    expect(layer1.styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(26);

    /*
     * Select:
     */

    // Fill color.
    expect(layer1.styleMap.styles.select.defaultStyle.fillColor).
      toEqual('7');
    expect(layer2.styleMap.styles.select.defaultStyle.fillColor).
      toEqual('8');

    // Stroke color.
    expect(layer1.styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('4');
    expect(layer2.styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('5');

    // Fill opacity
    expect(layer1.styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.14);

    // Stroke opacity
    expect(layer1.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.17);

    // Graphic opacity
    expect(layer1.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.select.defaultStyle.graphicOpacity).
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
      toEqual('7');
    expect(layer2.styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('8');

    // Stroke color.
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('4');
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('5');

    // Fill opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.14);

    // Stroke opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.17);

    // Graphic opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.temporary.defaultStyle.graphicOpacity).
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
