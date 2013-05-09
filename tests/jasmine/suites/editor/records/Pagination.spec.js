
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Pagination', function() {


  var fx = {
    p12: readFixtures('EditorRecordsPagination.p12.json'),
    p23: readFixtures('EditorRecordsPagination.p23.json'),
    p34: readFixtures('EditorRecordsPagination.p34.json'),
    p56: readFixtures('EditorRecordsPagination.p56.json'),
    p6:  readFixtures('EditorRecordsPagination.p6.json')
  }


  beforeEach(function() {
    NL.loadEditor();
    Neatline.global.page_length = 2;
  });


  it('should hide pagination when all records fit', function() {

    // --------------------------------------------------------------------
    // The paginators should not be displayed when the entire record list
    // can fit into a single screen.
    // --------------------------------------------------------------------

    Neatline.global.page_length = 10;

    // Load 2 records.
    NL.navigate('records');
    NL.respondLast200(fx.p12);

    // Paginators should be hidden.
    expect(NL.vw.RECORDS.$el).not.toContain('.pagination');

  });

  describe('|xx|xxxx', function() {

    // --------------------------------------------------------------------
    // << (disabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 1-2.
      NL.navigate('records/search/query=x+y/start=0');
      NL.respondLast200(fx.p12);

      // << disabled, >> enabled.
      NL.assertPaginationPrevDisabled();
      NL.assertPaginationNextEnabled();

      // << links to query page 1, >> to next page.
      NL.assertPaginationPrevRoute('#records/search/query=x+y');
      NL.assertPaginationNextRoute('#records/search/query=x+y/start=2');

    });

    it('without search query', function() {

      // Load records 1-2.
      NL.navigate('records/search/start=0');
      NL.respondLast200(fx.p12);

      // << disabled, >> enabled.
      NL.assertPaginationPrevDisabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> to next page.
      NL.assertPaginationPrevRoute('#records');
      NL.assertPaginationNextRoute('#records/search/start=2');

    });

  });

  describe('x|xx|xxx', function() {

    // --------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 2-3.
      NL.navigate('records/search/query=x+y/start=1');
      NL.respondLast200(fx.p23);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#records/search/query=x+y');
      NL.assertPaginationNextRoute('#records/search/query=x+y/start=3');

    });

    it('without search query', function() {

      // Load records 2-3.
      NL.navigate('records/search/start=1');
      NL.respondLast200(fx.p23);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#records');
      NL.assertPaginationNextRoute('#records/search/start=3');

    });

  });

  describe('xx|xx|xx', function() {

    // --------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 3-4.
      NL.navigate('records/search/query=x+y/start=2');
      NL.respondLast200(fx.p34);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#records/search/query=x+y');
      NL.assertPaginationNextRoute('#records/search/query=x+y/start=4');

    });

    it('without search query', function() {

      // Load records 3-4.
      NL.navigate('records/search/start=2');
      NL.respondLast200(fx.p34);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#records');
      NL.assertPaginationNextRoute('#records/search/start=4');

    });

  });

  describe('xxxx|xx|', function() {

    // --------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 5-6.
      NL.navigate('records/search/query=x+y/start=4');
      NL.respondLast200(fx.p56);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      NL.assertPaginationPrevRoute('#records/search/query=x+y/start=2');
      NL.assertPaginationNextRoute('#records/search/query=x+y/start=4');

    });

    it('without search query', function() {

      // Load records 5-6.
      NL.navigate('records/search/start=4');
      NL.respondLast200(fx.p56);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      NL.assertPaginationPrevRoute('#records/search/start=2');
      NL.assertPaginationNextRoute('#records/search/start=4');

    });

  });

  describe('xxxxx|x|', function() {

    // --------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load record 6.
      NL.navigate('records/search/query=x+y/start=5');
      NL.respondLast200(fx.p6);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      NL.assertPaginationPrevRoute('#records/search/query=x+y/start=3');
      NL.assertPaginationNextRoute('#records/search/query=x+y/start=5');

    });

    it('without search query', function() {

      // Load record 6.
      NL.navigate('records/search/start=5');
      NL.respondLast200(fx.p6);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to next page.
      NL.assertPaginationPrevRoute('#records/search/start=3');
      NL.assertPaginationNextRoute('#records/search/start=5');

    });

  });


});
