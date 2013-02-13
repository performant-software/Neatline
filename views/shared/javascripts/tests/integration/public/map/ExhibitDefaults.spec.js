
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for default map state on initialization.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Exhibit Defaults', function() {


  beforeEach(function() {

    loadFixtures('neatline-partial.html');

    // Mock the base layers.
    Neatline.global.base_layers = [
      {
        title:  'Layer1',
        id:     'Layer1',
        type:   'OpenStreetMap'
      },
      {
        title:  'Layer2',
        id:     'Layer2',
        type:   'OpenStreetMap'
      },
      {
        title:  'Layer3',
        id:     'Layer3',
        type:   'OpenStreetMap'
      }
    ];

  });


  it('should construct base layers', function() {

    // --------------------------------------------------------------------
    // When the exhibit loads, the map should create the layers defined by
    // the `base_layers` global.
    // --------------------------------------------------------------------

    // Start map.
    Neatline.Map.init();

    // Base layers should be added to map.
    expect(Neatline.Map.__view.map.layers[0].name).toEqual('Layer1');
    expect(Neatline.Map.__view.map.layers[1].name).toEqual('Layer2');
    expect(Neatline.Map.__view.map.layers[2].name).toEqual('Layer3');

  });


  it('should set default base layer', function() {

    // --------------------------------------------------------------------
    // When the exhibit loads, the map default to the base layer defined
    // by the `base_layer` global.
    // --------------------------------------------------------------------

    // Set the default base layer.
    Neatline.global.base_layer = 'Layer2';

    // Start map.
    Neatline.Map.init();

    // Default layer should be set.
    expect(Neatline.Map.__view.map.baseLayer.name).toEqual('Layer2');

  });


  it('should set exhibit default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the exhibit loads, the map should manifest the focus and zoom
    // defined by the `map_focus` and `map_zoom` global parameters.
    // --------------------------------------------------------------------

    // Set exhibit defaults.
    Neatline.global.map_focus = '1,2';
    Neatline.global.map_zoom = 10;

    // Start map.
    Neatline.Map.init();

    // Viewport should be set to default.
    var center = Neatline.Map.__view.map.getCenter();
    expect(Neatline.Map.__view.map.zoom).toEqual(10);
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(2);

  });


});
