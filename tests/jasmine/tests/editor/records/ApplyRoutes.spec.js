
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records | Apply Routes', function() {


  var elements;


  beforeEach(function() {

    NL.loadEditor();

    elements = {
      records: NL.v.exhibit.$('li[data-slug="records"]')
    };

  });


  describe('#records', function() {

    afterEach(function() {

      // Tabs, search, records should be visible.
      expect(NL.v.editor.__ui.editor).toContain(NL.v.exhibit.$el);
      expect(NL.v.editor.__ui.editor).toContain(NL.v.search.$el);
      expect(NL.v.editor.__ui.editor).toContain(NL.v.records.$el);

      // "Records" tab should be active.
      expect(elements.records).toHaveClass('active');

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

    it('start', function() {
      NL.navigate('records/search/start=50');
    });

    it('query and start', function() {
      NL.navigate('records/search/query=test/start=50');
    });

  });


});
