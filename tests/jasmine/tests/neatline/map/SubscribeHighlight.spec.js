
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `highlight`', function() {


  var fixtures = {
    records: readFixtures('NeatlineMapSubscribe.records.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
    NL.respondMap200(fixtures.records);
  });


  it('should highlight a vector layer', function() {

    // ------------------------------------------------------------------------
    // When `highlight` is triggered with a record that has a vector layer on
    // the map, the map should highlight the features.
    // ------------------------------------------------------------------------

    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('highlight', { model: layer.neatline.model });
    NL.assertTemporaryIntent(layer);

  });


  it('should not highlight a vector layer if selected', function() {

    // ------------------------------------------------------------------------
    // When `highlight` is triggered with a record that is selected on the
    // map, the features should not be highlighted.
    // ------------------------------------------------------------------------

    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('highlight', { model: layer.neatline.model });
    NL.assertSelectIntent(layer);

  });


  it('should highlight a WMS layer', function() {

    // ------------------------------------------------------------------------
    // When `highlight` is triggered with a record that has a WMS layer on the
    // map, the selected opacity should be applied to the WMS layer.
    // ------------------------------------------------------------------------

    var layer = NL.v.map.getWmsLayers()[0];

    Neatline.vent.trigger('highlight', { model: layer.neatline.model });
    expect(layer.opacity).toEqual(0.6);

  });


});
