
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `unhighlight`', function() {


  var fx = {
    records: readFixtures('NeatlineMapSubscriptions.records.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should unhighlight features for highlighted layer', function() {

    // ------------------------------------------------------------------------
    // When `unhighlight` is triggered with a record that has a vector layer
    // on the map, the map should unhighlight the features.
    // ------------------------------------------------------------------------

    NL.respondMap200(fx.records);
    var layer = NL.vw.MAP.getVectorLayers()[0];
    
    Neatline.vent.trigger('highlight', { model: layer.nModel });
    Neatline.vent.trigger('unhighlight', { model: layer.nModel });
    NL.assertDefaultIntent(layer);
    
  });


  it('should not unhighlight features for selected layer', function() {

    // ------------------------------------------------------------------------
    // When `unhighlight` is triggered with a record that is selected on on
    // the map, the features should not be unhighlighted.
    // ------------------------------------------------------------------------

    NL.respondMap200(fx.records);
    var layer = NL.vw.MAP.getVectorLayers()[0];
    
    Neatline.vent.trigger('select', { model: layer.nModel });
    Neatline.vent.trigger('unhighlight', { model: layer.nModel });
    NL.assertSelectIntent(layer);

  });


});
