
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Router', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('#record/:id', function() {

    _t.navigate($(_t.getRecordRows()[1]).attr('href'));

    // Record form should be visible.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);

  });


  it('#record/add', function() {

    _t.navigate('record/add');

    // Record form should be visible.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);

  });


});
