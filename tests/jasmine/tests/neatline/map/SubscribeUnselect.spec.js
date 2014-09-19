
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `unselect`', function() {


  var fixtures = {
    records: readFixtures('NeatlineMapSubscribe.records.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should unselect a vector layer', function() {

    // ------------------------------------------------------------------------
    // When `unselect` is triggered with a record that has a vector layer on
    // the map, the map should unhighlight the features.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('unselect', { model: layer.neatline.model });
    NL.assertDefaultIntent(layer);

  });


  it('should select a WMS layer', function() {

    // ------------------------------------------------------------------------
    // If the record has a WMS layer, the opacity should be bumped back down
    // to the default fill opacity.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getWmsLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('unselect', { model: layer.neatline.model });
    expect(layer.opacity).toEqual(0.5);

  });


});
