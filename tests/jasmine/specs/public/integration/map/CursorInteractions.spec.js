
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Cursor Interactions', function() {


  var layer1, layer2, fx = {
    records: readFixtures('PublicMapCursorInteractions.records.json')
  };


  beforeEach(function() {

    NL.loadNeatline();
    NL.respondMap200(fx.records);

    layer1 = NL.vw.MAP.getVectorLayers()[0];
    layer2 = NL.vw.MAP.getVectorLayers()[1];

  });


  afterEach(function() {
    expect(layer2.features[0].renderIntent).toEqual('default');
    expect(layer2.features[1].renderIntent).toEqual('default');
  });


  it('should highlight all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When cursor hovers on a feature, all of the features on the layer
    // should be redrawn with the `temporary` render intent.
    // --------------------------------------------------------------------

    NL.hoverOnMapFeature(layer1.features[0]);

    expect(layer1.features[0].renderIntent).toEqual('temporary');
    expect(layer1.features[1].renderIntent).toEqual('temporary');

  });


  it('should unhighlight all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When the cursor leaves a feature, all of the features on the layer
    // should be redrawn with the `default` render intent.
    // --------------------------------------------------------------------

    NL.hoverOnMapFeature(layer1.features[0]);
    NL.unHoverOnMapFeature();

    expect(layer1.features[0].renderIntent).toEqual('default');
    expect(layer1.features[1].renderIntent).toEqual('default');

  });


  it('should select all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When a feature is clicked, all of the features on the layer should
    // be redrawn with the `select` render intent.
    // --------------------------------------------------------------------

    NL.clickOnMapFeature(layer1.features[0]);

    expect(layer1.features[0].renderIntent).toEqual('select');
    expect(layer1.features[1].renderIntent).toEqual('select');

  });


  it('should unselect all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When the cursor clicks off a feature, all of the features on the
    // layer should be redrawn with the `default` render intent.
    // --------------------------------------------------------------------

    NL.clickOnMapFeature(layer1.features[0]);
    NL.clickOffMapFeature();

    expect(layer1.features[0].renderIntent).toEqual('default');
    expect(layer1.features[1].renderIntent).toEqual('default');

  });


});
