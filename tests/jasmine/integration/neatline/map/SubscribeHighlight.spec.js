
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `highlight`', function() {


  var fixtures = {
    records: readFixtures('NeatlineMapSubscriptions.records.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should highlight features', function() {

    // ------------------------------------------------------------------------
    // When `highlight` is triggered with a record that has a vector layer on
    // the map, the map should highlight the features.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('highlight', { model: layer.nModel });
    NL.assertTemporaryIntent(layer);

  });


  it('should not highlight features for selected layer', function() {

    // ------------------------------------------------------------------------
    // When `highlight` is triggered with a record that is selected on the
    // map, the features should not be highlighted.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('select', { model: layer.nModel });
    Neatline.vent.trigger('highlight', { model: layer.nModel });
    NL.assertSelectIntent(layer);

  });


});
