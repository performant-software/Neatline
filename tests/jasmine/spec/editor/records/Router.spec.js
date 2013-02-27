
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


  var els;


  beforeEach(function() {

    _t.loadEditor();

    els = {
      records: _t.vw.tabs.$('li.records')
    };

  });


  describe('#records', function() {

    afterEach(function() {

      // Tabs, search, records should be visible.
      expect(_t.el.editor).toContain(_t.el.tabs);
      expect(_t.el.editor).toContain(_t.el.search);
      expect(_t.el.editor).toContain(_t.el.records);

      // "Records" tab should be active.
      expect(els.records).toHaveClass('active');

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
