
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map cursor events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Cursor Events', function() {


  var layer, feature, vent;


  beforeEach(function() {

    _t.loadNeatline();
    _t.respondLast200(_t.json.MapCursorEvents.records);

    layer = _t.vw.MAP.getVectorLayers()[0];
    feature = layer.features[0];

    vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

  });


  it('should render and publish feature hover', function() {

    _t.hoverOnMapFeature(feature);

    expect(feature.renderIntent).toEqual('temporary');
    expect(vent).toHaveBeenCalledWith('MAP:highlight', layer.nModel);

  });


  it('should render and publish feature unhover', function() {

    _t.hoverOnMapFeature(feature);
    _t.unHoverOnMapFeature();

    expect(feature.renderIntent).toEqual('default');
    expect(vent).toHaveBeenCalledWith('MAP:unhighlight', layer.nModel);

  });


  it('should render and publish feature select', function() {

    _t.clickOnMapFeature(feature);

    expect(feature.renderIntent).toEqual('select');
    expect(vent).toHaveBeenCalledWith('MAP:select', layer.nModel);

  });


  it('should render and publish feature unselect', function() {

    _t.clickOnMapFeature(feature);
    _t.clickOffMapFeature();

    expect(feature.renderIntent).toEqual('default');
    expect(vent).toHaveBeenCalledWith('MAP:unselect', layer.nModel);

  });


});
