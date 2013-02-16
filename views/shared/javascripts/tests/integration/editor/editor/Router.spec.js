
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Router', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  describe('#records', function() {

    afterEach(function() {

      // Menu, search, records should be visible.
      expect(_t.el.editor).toContain(_t.el.menu);
      expect(_t.el.editor).toContain(_t.el.search);
      expect(_t.el.editor).toContain(_t.el.records);

      // "Records" tab should be active.
      expect(_t.vw.menu.__ui.tabs.records).toHaveClass('active');

    });

    it('default', function() {
      _t.navigate('records');
    });

    it('query', function() {
      _t.navigate('records/search/query=test');
    });

    it('offset', function() {
      _t.navigate('records/search/start=50');
    });

    it('query and offset', function() {
      _t.navigate('records/search/query=test/start=50');
    });

  });


  it('#record/:id', function() {

    _t.navigate($(_t.getRecordRows()[1]).attr('href'));

    // Record form should be visible.
    expect(_t.el.editor).toContain(_t.el.record);

  });


  it('#record/add', function() {

    _t.navigate('records/add');

    // Record form should be visible.
    expect(_t.el.editor).toContain(_t.el.record);

  });


  it('#styles', function() {

    _t.navigate('styles');

    // Style editor should be visible.
    expect(_t.el.editor).toContain(_t.el.menu);
    expect(_t.el.editor).toContain(_t.el.styles);

    // "Stylesheet" tab should be active.
    expect(_t.vw.menu.__ui.tabs.styles).toHaveClass('active');

  });


  it('#exhibit', function() {

    _t.navigate('exhibit');

    // Style editor should be visible.
    expect(_t.el.editor).toContain(_t.el.menu);
    expect(_t.el.editor).toContain(_t.el.exhibit);

    // "Exhibit" tab should be active.
    expect(_t.vw.menu.__ui.tabs.exhibit).toHaveClass('active');

  });


});
