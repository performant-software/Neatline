
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Base Layers', function() {


  beforeEach(function() {

    loadFixtures('neatline-partial.html');

    Neatline.g.neatline.base_layers = [
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
    // When the exhibit starts, the map should construct all of the base
    // layers defined in the `base_layers` global.
    // --------------------------------------------------------------------

    NL.startApplication();
    NL.aliasNeatline();

    expect(NL.vw.MAP.map.layers[0].name).toEqual('Layer1');
    expect(NL.vw.MAP.map.layers[1].name).toEqual('Layer2');
    expect(NL.vw.MAP.map.layers[2].name).toEqual('Layer3');

  });


  it('should set default base layer', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should set the defalt base layer
    // to the layer with the `id` defined by the `base_layer` global.
    // --------------------------------------------------------------------

    Neatline.g.neatline.exhibit.base_layer = 'Layer2';

    NL.startApplication();
    NL.aliasNeatline();

    expect(NL.vw.MAP.map.baseLayer.name).toEqual('Layer2');

  });


});
