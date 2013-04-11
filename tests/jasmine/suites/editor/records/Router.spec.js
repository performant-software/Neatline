
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Router', function() {


  var el;


  beforeEach(function() {

    _t.loadEditor();

    el = {
      records: _t.vw.EXHIBIT.$('li[data-slug="records"]')
    };

  });


  describe('#records', function() {

    afterEach(function() {

      // Tabs, search, records should be visible.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.EXHIBIT.$el);
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.SEARCH.$el);
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORDS.$el);

      // "Records" tab should be active.
      expect(el.records).toHaveClass('active');

    });

    it('empty', function() {
      _t.navigate('');
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


});
