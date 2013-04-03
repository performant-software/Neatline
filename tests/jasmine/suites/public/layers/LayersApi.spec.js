
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Layer API tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Base Layers API', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should return `null` when a handler does not exist', function() {

    // --------------------------------------------------------------------
    // When a layer is requested that has a type that is not supported by
    // any of the handlers, the request should return null.
    // --------------------------------------------------------------------

    // Request layer type for which no handler exists.
    var layer = Neatline.request('LAYERS:getLayer', {
      type: 'LayerType'
    });

    expect(layer).toBeNull();

  });


  it('should return a layer when a handler exists', function() {

    // --------------------------------------------------------------------
    // When a layer is requested that has a type that is supported by one
    // of the handlers, the request should return the layer.
    // --------------------------------------------------------------------

    // Register a handler for `LayerType` that returns `true`.
    Neatline.reqres.setHandler('LAYERS:LayerType', function() {
      return true;
    });

    // Request a `LayerType` layer.
    var layer = Neatline.request('LAYERS:getLayer', {
      type: 'LayerType'
    });

    expect(layer).toBeTruthy();

  });


});
