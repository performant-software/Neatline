
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Vector Layer Styling', function() {


  var layer, feature;


  beforeEach(function() {

    NL.loadNeatline();
    NL.respondMap200(NL.json.MapVectorLayers.records.styles);

    layer = NL.vw.MAP.getVectorLayers()[0];
    feature = layer.features[0];

  });


  it('should build style maps', function() {

    // --------------------------------------------------------------------
    // When vector layers are ingested, the style maps should be created
    // from record values.
    // --------------------------------------------------------------------

    var def = layer.styleMap.styles['default'].defaultStyle;
    var tmp = layer.styleMap.styles.temporary.defaultStyle;
    var sel = layer.styleMap.styles.select.defaultStyle;

    expect(def.fillColor).        toEqual('1');
    expect(tmp.fillColor).        toEqual('2');
    expect(sel.fillColor).        toEqual('2');

    expect(def.strokeColor).      toEqual('3');
    expect(tmp.strokeColor).      toEqual('4');
    expect(sel.strokeColor).      toEqual('4');

    expect(def.fillOpacity).      toEqual(0.5);
    expect(tmp.fillOpacity).      toEqual(0.6);
    expect(sel.fillOpacity).      toEqual(0.6);

    expect(def.graphicOpacity).   toEqual(0.5);
    expect(tmp.graphicOpacity).   toEqual(0.6);
    expect(sel.graphicOpacity).   toEqual(0.6);

    expect(def.strokeOpacity).    toEqual(0.7);
    expect(tmp.strokeOpacity).    toEqual(0.8);
    expect(sel.strokeOpacity).    toEqual(0.8);

    expect(def.strokeWidth).      toEqual(9);
    expect(tmp.strokeWidth).      toEqual(9);
    expect(sel.strokeWidth).      toEqual(9);

    expect(def.pointRadius).      toEqual(10);
    expect(tmp.pointRadius).      toEqual(10);
    expect(sel.pointRadius).      toEqual(10);

    expect(def.externalGraphic).  toEqual('11');
    expect(tmp.externalGraphic).  toEqual('11');
    expect(sel.externalGraphic).  toEqual('11');

  });

  it('should render `temporary` intent on highlight', function() {

    // --------------------------------------------------------------------
    // When the cursor hovers on a feature, the `temporary` style should
    // be applied to the geometry.
    // --------------------------------------------------------------------

    NL.hoverOnMapFeature(feature);

    expect(feature.renderIntent).toEqual('temporary');

  });

  it('should render `default` intent on unhighlight', function() {

    // --------------------------------------------------------------------
    // When the cursor hovers off a feature, the `default` style should be
    // applied to the geometry.
    // --------------------------------------------------------------------

    NL.hoverOnMapFeature(feature);
    NL.unHoverOnMapFeature();

    expect(feature.renderIntent).toEqual('default');

  });

  it('should render `select` intent on select', function() {

    // --------------------------------------------------------------------
    // When a feature is clicked, the `select` style should be applied to
    // the geometry.
    // --------------------------------------------------------------------

    NL.clickOnMapFeature(feature);

    expect(feature.renderIntent).toEqual('select');

  });


  it('should render `default` intent on unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is unselected, the `default` style should be applied
    // to the geometry.
    // --------------------------------------------------------------------

    NL.clickOnMapFeature(feature);
    NL.clickOffMapFeature();

    expect(feature.renderIntent).toEqual('default');

  });


});
