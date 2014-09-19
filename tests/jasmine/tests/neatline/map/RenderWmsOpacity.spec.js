
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Render WMS Opacity', function() {


  var fixtures = {
    records: read('NeatlineMapRenderWmsOpacity.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
    NL.respondMap200(fixtures.records);

  });


  it('should render the default WMS opacity', function() {

    // ------------------------------------------------------------------------
    // WMS layer opacities should be set from the `fill_opacity` field.
    // ------------------------------------------------------------------------

    // Should set WMS layer opacity.
    expect(NL.v.map.getWmsLayers()[0].opacity).toEqual(0.5);

  });

  //it('should bump opacity on highlight', function() {

    //// ------------------------------------------------------------------------
    //// WMS layer opacities should be set from the `fill_opacity_select` field.
    //// ------------------------------------------------------------------------

    //var layer = NL.v.map.getWmsLayers()[0];
    //Neatline.vent.trigger('highlight', { model: layer.neatline.model });

    //// Should apply the selected opacity to the WMS layer.
    //expect(layer.opacity).toEqual(0.8);

  //});

    //it('should lower opacity on unhighlight', function() {

    //// ------------------------------------------------------------------------
    //// WMS layer opacities should be set from the `fill_opacity_select` field.
    //// ------------------------------------------------------------------------

    //var layer = NL.v.map.getWmsLayers()[0];
    //Neatline.vent.trigger('highlight', { model: layer.neatline.model });
    //Neatline.vent.trigger('unhighlight', { model: layer.neatline.model });

    //// Should lower opacity to the default for the WMS layer.
    //expect(layer.opacity).toEqual(0.5);

  //});

  //it('should bump opacity on select', function() {

    //// ------------------------------------------------------------------------
    //// WMS layer opacities should be set from the `fill_opacity_select` field.
    //// ------------------------------------------------------------------------

    //var layer = NL.v.map.getWmsLayers()[0];
    //Neatline.vent.trigger('select', { model: layer.neatline.model });

    //// Should apply the selected opacity to the WMS layer.
    //expect(layer.opacity).toEqual(0.8);

  //});

  it('should lower opacity on unselect', function() {

    // ------------------------------------------------------------------------
    // WMS layer opacities should be set from the `fill_opacity_select` field.
    // ------------------------------------------------------------------------

    var layer = NL.v.map.getWmsLayers()[0];
    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('unselect', { model: layer.neatline.model });

    // Should lower opacity to the default for the WMS layer.
    expect(layer.opacity).toEqual(0.5);

  });

  it('should not unhighlight a selected record', function() {

    // ------------------------------------------------------------------------
    // WMS layer opacities should be set from the `fill_opacity_select` field.
    // ------------------------------------------------------------------------

    var layer = NL.v.map.getWmsLayers()[0];
    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('unhighlight', { model: layer.neatline.model });

    // Should lower opacity to the default for the WMS layer.
    expect(layer.opacity).toEqual(0.8);

  });


});
