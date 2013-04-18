
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Pagination', function() {


  beforeEach(function() {
    _t.loadEditor();
    Neatline.global.page_length = 2;
  });


  it('should hide pagination when all records fit', function() {

    // --------------------------------------------------------------------
    // The paginators should not be displayed when the entire record list
    // can fit into a single screen.
    // --------------------------------------------------------------------

    Neatline.global.page_length = 10;

    // Load 2 records.
    _t.navigate('records');
    _t.respondLast200(_t.json.RecordsPagination.records.p12);

    // Paginators should be hidden.
    expect(_t.vw.RECORDS.$el).not.toContain('.pagination');

  });

  describe('|xx|xxxx', function() {

    // --------------------------------------------------------------------
    // << (disabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 1-2.
      _t.navigate('records/search/query=x+y/start=0');
      _t.respondLast200(_t.json.RecordsPagination.records.p12);

      // << disabled, >> enabled.
      _t.assertPaginationPrevDisabled();
      _t.assertPaginationNextEnabled();

      // << links to query page 1, >> to next page.
      _t.assertPaginationPrevRoute('#records/search/query=x+y');
      _t.assertPaginationNextRoute('#records/search/query=x+y/start=2');

    });

    it('without search query', function() {

      // Load records 1-2.
      _t.navigate('records/search/start=0');
      _t.respondLast200(_t.json.RecordsPagination.records.p12);

      // << disabled, >> enabled.
      _t.assertPaginationPrevDisabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> to next page.
      _t.assertPaginationPrevRoute('#records');
      _t.assertPaginationNextRoute('#records/search/start=2');

    });

  });

  describe('x|xx|xxx', function() {

    // --------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 2-3.
      _t.navigate('records/search/query=x+y/start=1');
      _t.respondLast200(_t.json.RecordsPagination.records.p23);

      // << enabled, >> enabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      _t.assertPaginationPrevRoute('#records/search/query=x+y');
      _t.assertPaginationNextRoute('#records/search/query=x+y/start=3');

    });

    it('without search query', function() {

      // Load records 2-3.
      _t.navigate('records/search/start=1');
      _t.respondLast200(_t.json.RecordsPagination.records.p23);

      // << enabled, >> enabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      _t.assertPaginationPrevRoute('#records');
      _t.assertPaginationNextRoute('#records/search/start=3');

    });

  });

  describe('xx|xx|xx', function() {

    // --------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 3-4.
      _t.navigate('records/search/query=x+y/start=2');
      _t.respondLast200(_t.json.RecordsPagination.records.p34);

      // << enabled, >> enabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      _t.assertPaginationPrevRoute('#records/search/query=x+y');
      _t.assertPaginationNextRoute('#records/search/query=x+y/start=4');

    });

    it('without search query', function() {

      // Load records 3-4.
      _t.navigate('records/search/start=2');
      _t.respondLast200(_t.json.RecordsPagination.records.p34);

      // << enabled, >> enabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      _t.assertPaginationPrevRoute('#records');
      _t.assertPaginationNextRoute('#records/search/start=4');

    });

  });

  describe('xxxx|xx|', function() {

    // --------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load records 5-6.
      _t.navigate('records/search/query=x+y/start=4');
      _t.respondLast200(_t.json.RecordsPagination.records.p56);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      _t.assertPaginationPrevRoute('#records/search/query=x+y/start=2');
      _t.assertPaginationNextRoute('#records/search/query=x+y/start=4');

    });

    it('without search query', function() {

      // Load records 5-6.
      _t.navigate('records/search/start=4');
      _t.respondLast200(_t.json.RecordsPagination.records.p56);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      _t.assertPaginationPrevRoute('#records/search/start=2');
      _t.assertPaginationNextRoute('#records/search/start=4');

    });

  });

  describe('xxxxx|x|', function() {

    // --------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // --------------------------------------------------------------------

    it('with search query', function() {

      // Load record 6.
      _t.navigate('records/search/query=x+y/start=5');
      _t.respondLast200(_t.json.RecordsPagination.records.p6);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      _t.assertPaginationPrevRoute('#records/search/query=x+y/start=3');
      _t.assertPaginationNextRoute('#records/search/query=x+y/start=5');

    });

    it('without search query', function() {

      // Load record 6.
      _t.navigate('records/search/start=5');
      _t.respondLast200(_t.json.RecordsPagination.records.p6);

      // << enabled, >> disabled.
      _t.assertPaginationPrevEnabled();
      _t.assertPaginationNextDisabled();

      // << links to previous page, >> links to next page.
      _t.assertPaginationPrevRoute('#records/search/start=3');
      _t.assertPaginationNextRoute('#records/search/start=5');

    });

  });


});
