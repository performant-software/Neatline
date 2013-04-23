
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Outgoing Events', function() {


  var layer, feature, vent;


  beforeEach(function() {

    NL.loadNeatline();
    NL.respondMap200(NL.json.MapOutgoingEvents.records);

    layer = NL.vw.MAP.getVectorLayers()[0];
    feature = layer.features[0];

    vent = spyOn(Neatline.vent, 'trigger');

  });


  it('should publish `highlight` on feature highlight', function() {

    // --------------------------------------------------------------------
    // When the cursor hovers on a feature, the `highlight` event should
    // be published with the feature's model.
    // --------------------------------------------------------------------

    NL.hoverOnMapFeature(feature);

    expect(vent).toHaveBeenCalledWith('highlight', {
      model:  layer.nModel,
      source: 'MAP'
    });

  });


  it('should publish `unhighlight` on feature unhighlight', function() {

    // --------------------------------------------------------------------
    // When the cursor leaves a feature, the `unhighlight` event should be
    // published with the feature's model.
    // --------------------------------------------------------------------

    NL.hoverOnMapFeature(feature);
    NL.unHoverOnMapFeature();

    expect(vent).toHaveBeenCalledWith('unhighlight', {
      model:  layer.nModel,
      source: 'MAP'
    });

  });


  it('should publish `select` on feature select', function() {

    // --------------------------------------------------------------------
    // When a feature is clicked, the `select` event should be published
    // with the feature's model.
    // --------------------------------------------------------------------

    NL.clickOnMapFeature(feature);

    expect(vent).toHaveBeenCalledWith('select', {
      model:  layer.nModel,
      source: 'MAP'
    });

  });


  it('should publish `unselect` on feature unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is unselected by a click elsewhere on the map, the
    // `unselect` event should be published with the feature's model.
    // --------------------------------------------------------------------

    NL.clickOnMapFeature(feature);
    NL.clickOffMapFeature();

    expect(vent).toHaveBeenCalledWith('unselect', {
      model:  layer.nModel,
      source: 'MAP'
    });

  });


});
