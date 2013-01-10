
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Unit tests for `set` on tag model.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tag Model `set`', function() {

  var model;

  beforeEach(function() {
    model = new Neatline.Editor.Shared.Tag.Model();
  });

  it('should set boolean values as 0/1', function() {

    // --------------------------------------------------------------------
    // When `set` is passed a boolean, the value should be cast to 0/1.
    // --------------------------------------------------------------------

    model.set('test', true);
    expect(model.get('test')).toEqual(1);
    model.set('test', false);
    expect(model.get('test')).toEqual(0);

  });

});
