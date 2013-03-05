
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form tabs.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Tabs', function() {


  var el;


  beforeEach(function() {

    _t.loadEditor();

    el = {
      text:     _t.vw.RECORD.$('a[href="#record-text"]'),
      spatial:  _t.vw.RECORD.$('a[href="#record-spatial"]'),
      style:    _t.vw.RECORD.$('a[href="#record-style"]')
    };

  });


  it('should update route for unsaved record');
  it('should update route for saved record');


});
