
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Vector Styles', function() {


  var layer1, layer2, fx = {
    records: readFixtures('NeatlineMapVectorStyles.json')
  };


  beforeEach(function() {

    NL.loadNeatline();
    NL.respondMap200(fx.records);

    layer1 = NL.v.map.getVectorLayers()[0];
    layer2 = NL.v.map.getVectorLayers()[1];

  });


  it('should construct style maps from record fields', function() {

    // ------------------------------------------------------------------------
    // When vector layers are ingested, the style maps should be created from
    // record values.
    // ------------------------------------------------------------------------

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

      // ----------------------------------------------------------------------
      // When the cursor hovers on a feature, all features on the layer should
      // be redrawn with the `temporary` render intent.
      // ----------------------------------------------------------------------

      // Hover on a feature.
      NL.hoverOnMapFeature(layer1.features[0]);

      // The feature should be highlighted.
      NL.assertTemporaryIntent(layer1);

    });

    it('should not highlight when map is being panned', function() {

      // ----------------------------------------------------------------------
      // When the map is being panned, features should not be highlighted on
      // mouseenter. This prevents an interaction that can cause features to
      // become "stuck" in highlight mode - when the map is dragged quickly, a
      // gap can open up between the position of the cursor on the screen and
      // the position of the underlying tiles, which makes it possible for the
      // cursor to drift onto a feature. When the drag ends, the cursor can
      // then snap back outside of the feature as the tiles catch up with the
      // positionof the cursor, but without triggering `mouseleave`, leaving
      // the feature highlighted until the user manually hovers/un-hovers.
      // ----------------------------------------------------------------------

      // Start panning the map.
      NL.triggerMapMoveStart();

      // Hover on a feature.
      NL.hoverOnMapFeature(layer1.features[0]);

      // The layer should not be highlighted.
      NL.assertDefaultIntent(layer1);

    });

    it('should not highlight when map is being loaded', function() {

      // ----------------------------------------------------------------------
      // When records are being loaded from the server, features should not be
      // highlighted on mouseenter. This prevents features from getting stuck
      // in highlight mode when the highlight control is reset in response to
      // the arrival of a new set of records between the time when the cursor
      // enters and exits a feature.
      // ----------------------------------------------------------------------

      // Pan the map, triggering an extent query.
      NL.triggerMapMoveStart(); NL.triggerMapMoveEnd();

      // Hover on a feature.
      NL.hoverOnMapFeature(layer1.features[0]);

      // The layer should not be highlighted.
      NL.assertDefaultIntent(layer1);

      // Complete the query.
      NL.respondMap200(fx.records);

      // Hover on a feature again.
      NL.hoverOnMapFeature(layer1.features[0]);

      // The layer should resume highlighting.
      NL.assertTemporaryIntent(layer1);

    });

    it('should unhighlight all the features on the layer', function() {

      // ----------------------------------------------------------------------
      // When the cursor leaves a feature, all sibling features should be
      // redrawn with the `default` render intent.
      // ----------------------------------------------------------------------

      // Hover on a feature.
      NL.hoverOnMapFeature(layer1.features[0]);

      // Hover off the feature.
      NL.unHoverOnMapFeature();

      // The layer should not be highlighted.
      NL.assertDefaultIntent(layer1);

    });

    it('should select all the features on the layer', function() {

      // ----------------------------------------------------------------------
      // When a feature is clicked, all sibling features on the layer should
      // be redrawn with the `select` render intent.
      // ----------------------------------------------------------------------

      // Click on a feature.
      NL.clickOnMapFeature(layer1.features[0]);

      // The layer should be selected.
      NL.assertSelectIntent(layer1);

    });

    it('should unselect all the features on the layer', function() {

      // ----------------------------------------------------------------------
      // When the cursor clicks off a feature, all sibling features on the
      // layer should be redrawn with the `default` render intent.
      // ----------------------------------------------------------------------

      // Click on a feature, then click off.
      NL.clickOnMapFeature(layer1.features[0]);
      NL.clickOffMapFeature();

      // The layer should not be selected.
      NL.assertDefaultIntent(layer1);

    });

  });


});
