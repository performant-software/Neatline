
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map `select` Event Subscription (WMS Layers)', function() {


  var fx = {
    noFocus: read('PublicMapSubscribeSelectWms.noFocus.json'),
    focus:   read('PublicMapSubscribeSelectWms.focus.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should not focus for model with WMS but no focus', function() {

    // --------------------------------------------------------------------
    // When a record is selected that has a WMS layer but no defined focus
    // or zoom, the map should _not_ focus, since the record will have the
    // generic coverage that covers the whole map, which, when focused on,
    // has the effect of zooming out to the highest level.
    // --------------------------------------------------------------------

    var model = NL.recordFromJson(fx.noFocus);

    // Set center and zoom.
    NL.setMapCenter(200, 300, 15);

    // Select record with WMS layer, no focus.
    Neatline.vent.trigger('select', { model: model });

    // Map should not focus.
    NL.assertMapViewport(200, 300, 15);

  });


  it('should focus for model with WMS and focus', function() {

    // --------------------------------------------------------------------
    // When a record is selected that has a WMS layer and defined focus
    // and zoom values, the map should apply the defaults as usual.
    // --------------------------------------------------------------------

    var model = NL.recordFromJson(fx.focus);

    // Set center and zoom.
    NL.setMapCenter(200, 300, 15);

    // Select record with WMS layer and focus.
    Neatline.vent.trigger('select', { model: model });

    // Map should focus.
    NL.assertMapViewport(100, 200, 10);

  });


});
