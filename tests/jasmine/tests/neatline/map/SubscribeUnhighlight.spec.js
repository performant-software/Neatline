
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `unhighlight`', function() {


  var fixtures = {
    records: readFixtures('NeatlineMapSubscribe.records.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should unhighlight vector layer', function() {

    // ------------------------------------------------------------------------
    // When `unhighlight` is triggered with a record that has a vector layer
    // on the map, the map should unhighlight the features.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('highlight', { model: layer.neatline.model });
    Neatline.vent.trigger('unhighlight', { model: layer.neatline.model });
    NL.assertDefaultIntent(layer);

  });


  it('should not unhighlight vector layer for selected record', function() {

    // ------------------------------------------------------------------------
    // When `unhighlight` is triggered with a record that is selected on the
    // map, the features should not be unhighlighted.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getVectorLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('unhighlight', { model: layer.neatline.model });
    NL.assertSelectIntent(layer);

  });


  it('should unhighlight a WMS layer', function() {

    // ------------------------------------------------------------------------
    // When `unhighlight` is triggered with a record that has a WMS layer on
    // the map, the default opacity should be applied to the WMS layer.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getWmsLayers()[0];

    Neatline.vent.trigger('highlight', { model: layer.neatline.model });
    Neatline.vent.trigger('unhighlight', { model: layer.neatline.model });
    expect(layer.opacity).toEqual(0.5);

  });


  it('should unhighlight a WMS layer for a selected record', function() {

    // ------------------------------------------------------------------------
    // When `unhighlight` is triggered with a record that is selected on the
    // map, the opacity should not be changed.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);
    var layer = NL.v.map.getWmsLayers()[0];

    Neatline.vent.trigger('select', { model: layer.neatline.model });
    Neatline.vent.trigger('unhighlight', { model: layer.neatline.model });
    expect(layer.opacity).toEqual(0.6);

  });


});
