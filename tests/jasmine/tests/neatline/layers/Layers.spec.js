
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('API | Layers', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should return nothing when a handler does not exist', function() {

    // ------------------------------------------------------------------------
    // When a layer is requested with a type that is not supported by any of
    // the handlers, the request should return `undefined`.
    // ------------------------------------------------------------------------

    var layer = Neatline.request('MAP:LAYERS:getLayer', {
      type: 'LayerType'
    });

    expect(layer).toBeUndefined();

  });


  it('should return a layer when a handler exists', function() {

    // ------------------------------------------------------------------------
    // When a layer is requested with a type that is supported by any of the
    // handlers, the request should return the layer.
    // ------------------------------------------------------------------------

    Neatline.reqres.setHandler('MAP:LAYERS:LayerType', function() {
      return true;
    });

    var layer = Neatline.request('MAP:LAYERS:getLayer', {
      type: 'LayerType'
    });

    expect(layer).toBeTruthy();

  });


});
