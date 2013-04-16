
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble map interaction tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Static Bubble Map Interactions', function() {


  var el, layers, feature1, feature2;


  beforeEach(function() {

    _t.loadNeatline();
    _t.respondMap200(_t.json.StaticBubble.records);

    layers = _t.vw.MAP.getVectorLayers();
    feature1 = layers[0].features[0];
    feature2 = layers[1].features[0];

  });


  it('should hide the bubble by default');

  describe('highlight', function() {
    it('should show the title, not the body');
    it('should not override a selected record');
  });

  describe('unlighlight', function() {
    it('should hide the bubble if it is not selected');
    it('should not hide the bubble if it is selected');
  });

  decribe('select', function() {
    it('should show body and close "X" if body is non-null');
    it('should not show body and close "X" if body is null');
    it('should override a selected record');
  });

  describe('close', function() {
    it('should close when close "X" is clicked');
    it('should close when a feature is unselected');
  });


});
