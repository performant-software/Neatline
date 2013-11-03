
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Broker', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  describe('highlight', function() {
    it('should do nothing when no record is currently highlighted');
    it('should unhighlight a currently-highlighted record');
  });


  describe('select', function() {
    it('should do nothing when no record is currently selected');
    it('should unselect a currently-selected record');
  });


});
