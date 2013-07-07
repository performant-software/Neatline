
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Spatial Layers', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapSpatialLayers.exhibit.html');
  });


  it('should construct base layers', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should construct all of the base
    // layers defined in the `spatial_layers` global.
    // --------------------------------------------------------------------

    expect(NL.vw.MAP.map.layers[0].name).toEqual('OpenStreetMap');
    expect(NL.vw.MAP.map.layers[1].name).toEqual('Google Physical');
    expect(NL.vw.MAP.map.layers[2].name).toEqual('Google Streets');
    expect(NL.vw.MAP.map.layers[3].name).toEqual('Google Hybrid');
    expect(NL.vw.MAP.map.layers[4].name).toEqual('Google Satellite');
    expect(NL.vw.MAP.map.layers[5].name).toEqual('Stamen Toner');
    expect(NL.vw.MAP.map.layers[6].name).toEqual('Stamen Watercolor');
    expect(NL.vw.MAP.map.layers[7].name).toEqual('Stamen Terrain');

  });


  it('should set default base layer', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should set the defalt base layer
    // to the layer with the `id` defined by the `spatial_layer` global.
    // --------------------------------------------------------------------

    expect(NL.vw.MAP.map.baseLayer.name).toEqual('OpenStreetMap');

  });


});
