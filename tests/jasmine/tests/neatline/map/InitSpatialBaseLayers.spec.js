
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Initialize Spatial Base Layers', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapInitSpatialBaseLayers.html');
  });


  it('should construct base layers', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the map should build all of the base layers
    // defined in the `spatial_layers` global.
    // ------------------------------------------------------------------------

    var layers = NL.v.map.map.getLayersBy('isBaseLayer', true);

    expect(layers[3].name).toEqual('OpenStreetMap');
    expect(layers[2].name).toEqual('Stamen Toner');
    expect(layers[1].name).toEqual('Stamen Watercolor');
    expect(layers[0].name).toEqual('Stamen Terrain');

    expect(layers.length).toEqual(4);

  });


  it('should set default base layer', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the map should set the defalt base layer to
    // the layer with the `id` defined by the `spatial_layer` global.
    // ------------------------------------------------------------------------

    expect(NL.v.map.map.baseLayer.name).toEqual('Stamen Toner');

  });


});
