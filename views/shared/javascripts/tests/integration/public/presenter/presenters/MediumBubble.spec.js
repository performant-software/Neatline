
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for medium bubble presenter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Medium Bubble', function() {


  var layer, feature, els;


  beforeEach(function() {

    _t.loadNeatline();

    // Get layer and feature.
    layer = _t.vw.map.layers[0];
    feature = layer.features[0];

    // Set presenter.
    layer.nModel.set('presenter', 'MediumBubble');

    els = {
      title:  _t.vw.smallBubble.$('.title'),
      body:   _t.vw.smallBubble.$('.body')
    };

  });


  it('should show the body and reposition on select');
  it('should hide the body on unselect');


});
