
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Vector Layer Styles', function() {


  var layer1, layer2, fx = {
    records: readFixtures('PublicMapVectorStyles.records.json')
  };


  beforeEach(function() {

    NL.loadNeatline();
    NL.respondMap200(fx.records);

    layer1 = NL.vw.MAP.getVectorLayers()[0];
    layer2 = NL.vw.MAP.getVectorLayers()[1];

  });


  it('should construct style maps from record fields', function() {

    // --------------------------------------------------------------------
    // When vector layers are ingested, the style maps should be created
    // from record values.
    // --------------------------------------------------------------------

    var def = layer1.styleMap.styles['default'].defaultStyle;
    var tmp = layer1.styleMap.styles.temporary.defaultStyle;
    var sel = layer1.styleMap.styles.select.defaultStyle;

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


  describe('render intent manifestations', function() {

    afterEach(function() {
      NL.assertDefaultIntent(layer2);
    });

    it('should highlight all the features on the layer', function() {

      // ------------------------------------------------------------------
      // When cursor hovers on a feature, all features on the layer should
      // be redrawn with the `temporary` render intent.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(layer1.features[0]);
      NL.assertTemporaryIntent(layer1);

    });

    it('should unhighlight all the features on the layer', function() {

      // ------------------------------------------------------------------
      // When the cursor leaves a feature, all features on the layer
      // should be redrawn with the `default` render intent.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(layer1.features[0]);
      NL.unHoverOnMapFeature();
      NL.assertDefaultIntent(layer1);

    });

    it('should select all the features on the layer', function() {

      // ------------------------------------------------------------------
      // When a feature is clicked, all features on the layer should be
      // redrawn with the `select` render intent.
      // ------------------------------------------------------------------

      NL.clickOnMapFeature(layer1.features[0]);
      NL.assertSelectIntent(layer1);

    });

    it('should unselect all the features on the layer', function() {

      // ------------------------------------------------------------------
      // When the cursor clicks off a feature, all features on the layer
      // should be redrawn with the `default` render intent.
      // ------------------------------------------------------------------

      NL.clickOnMapFeature(layer1.features[0]);
      NL.clickOffMapFeature();
      NL.assertDefaultIntent(layer1);

    });

  });


});
