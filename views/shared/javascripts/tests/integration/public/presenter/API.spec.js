
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter API tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenter API', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  describe('show', function() {
    it('should forward the command when a handler exists');
    it('should catch the error when a handler does not exist');
  });


  describe('hide', function() {
    it('should forward the command when a handler exists');
    it('should catch the error when a handler does not exist');
  });


  describe('select', function() {
    it('should forward the command when a handler exists');
    it('should catch the error when a handler does not exist');
  });


  describe('unselect', function() {
    it('should forward the command when a handler exists');
    it('should catch the error when a handler does not exist');
  });


  it('should trigger the `activate` event');
  it('should trigger the `deactivate` event');


});
