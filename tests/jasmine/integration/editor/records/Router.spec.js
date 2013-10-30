
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records | Router', function() {


  var el;


  beforeEach(function() {

    NL.loadEditor();

    el = {
      records: NL.vw.EXHIBIT.$('li[data-slug="records"]')
    };

  });


  describe('#records', function() {

    afterEach(function() {

      // Tabs, search, records should be visible.
      expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.EXHIBIT.$el);
      expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.SEARCH.$el);
      expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.RECORDS.$el);

      // "Records" tab should be active.
      expect(el.records).toHaveClass('active');

    });

    it('empty', function() {
      NL.navigate('');
    });

    it('default', function() {
      NL.navigate('records');
    });

    it('query', function() {
      NL.navigate('records/search/query=test');
    });

    it('offset', function() {
      NL.navigate('records/search/start=50');
    });

    it('query and offset', function() {
      NL.navigate('records/search/query=test/start=50');
    });

  });


});
