
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Vector Layer Viewport Focusing', function() {


  var fx = {
    records: read('PublicMapLayersVectorViewportFocusing.records.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should not focus when vector layer is clicked', function() {

    // --------------------------------------------------------------------
    // When a map feature is clicked, the map should _not_ focus on the
    // record that corresponds to the clicked feature. This prevents
    // disorienting leaps that occur when the default zoom for the record
    // is much higher is much higher or lower the current map zoom.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.records);
    var feature = NL.vw.MAP.getVectorLayers()[0].features[0];

    // Set center and zoom.
    NL.setMapCenter(200, 300, 15);

    // Click on feature.
    NL.clickOnMapFeature(feature);

    // Focus should be unchanged.
    NL.assertMapViewport(200, 300, 15);

  });


});
