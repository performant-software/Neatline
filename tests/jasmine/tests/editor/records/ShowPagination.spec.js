
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records | Show Pagination', function() {


  var fixtures = {
    p12: read('EditorRecordsShowPagination.p12.json'),
    p23: read('EditorRecordsShowPagination.p23.json'),
    p34: read('EditorRecordsShowPagination.p34.json'),
    p56: read('EditorRecordsShowPagination.p56.json'),
    p6:  read('EditorRecordsShowPagination.p6.json')
  };


  beforeEach(function() {
    NL.loadEditor();
    Neatline.g.neatline.per_page = 2;
  });


  it('should hide pagination when all records fit', function() {

    // ------------------------------------------------------------------------
    // The paginators should not be displayed when the entire record list can
    // fit into a single screen.
    // ------------------------------------------------------------------------

    Neatline.g.neatline.per_page = 10;

    // Load 2 records.
    NL.navigate('browse');
    NL.respondLast200(fixtures.p12);

    // Paginators should be hidden.
    expect(NL.v.records.$el).not.toContainHtml('.pagination');

  });

  describe('|xx|xxxx', function() {

    // ------------------------------------------------------------------------
    // << (disabled, 1st page), >> (enabled, next page).
    // ------------------------------------------------------------------------

    it('with search query', function() {

      // Load records 1-2.
      NL.navigate('browse/query=x+y/start=0');
      NL.respondLast200(fixtures.p12);

      // << disabled, >> enabled.
      NL.assertPaginationPrevDisabled();
      NL.assertPaginationNextEnabled();

      // << links to query page 1, >> to next page.
      NL.assertPaginationPrevRoute('#browse/query=x+y');
      NL.assertPaginationNextRoute('#browse/query=x+y/start=2');

    });

    it('without search query', function() {

      // Load records 1-2.
      NL.navigate('browse/start=0');
      NL.respondLast200(fixtures.p12);

      // << disabled, >> enabled.
      NL.assertPaginationPrevDisabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> to next page.
      NL.assertPaginationPrevRoute('#browse');
      NL.assertPaginationNextRoute('#browse/start=2');

    });

  });

  describe('x|xx|xxx', function() {

    // ------------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // ------------------------------------------------------------------------

    it('with search query', function() {

      // Load records 2-3.
      NL.navigate('browse/query=x+y/start=1');
      NL.respondLast200(fixtures.p23);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#browse/query=x+y');
      NL.assertPaginationNextRoute('#browse/query=x+y/start=3');

    });

    it('without search query', function() {

      // Load records 2-3.
      NL.navigate('browse/start=1');
      NL.respondLast200(fixtures.p23);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#browse');
      NL.assertPaginationNextRoute('#browse/start=3');

    });

  });

  describe('xx|xx|xx', function() {

    // ------------------------------------------------------------------------
    // << (enabled, 1st page), >> (enabled, next page).
    // ------------------------------------------------------------------------

    it('with search query', function() {

      // Load records 3-4.
      NL.navigate('browse/query=x+y/start=2');
      NL.respondLast200(fixtures.p34);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#browse/query=x+y');
      NL.assertPaginationNextRoute('#browse/query=x+y/start=4');

    });

    it('without search query', function() {

      // Load records 3-4.
      NL.navigate('browse/start=2');
      NL.respondLast200(fixtures.p34);

      // << enabled, >> enabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextEnabled();

      // << links to page 1, >> links to next page.
      NL.assertPaginationPrevRoute('#browse');
      NL.assertPaginationNextRoute('#browse/start=4');

    });

  });

  describe('xxxx|xx|', function() {

    // ------------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // ------------------------------------------------------------------------

    it('with search query', function() {

      // Load records 5-6.
      NL.navigate('browse/query=x+y/start=4');
      NL.respondLast200(fixtures.p56);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      NL.assertPaginationPrevRoute('#browse/query=x+y/start=2');
      NL.assertPaginationNextRoute('#browse/query=x+y/start=4');

    });

    it('without search query', function() {

      // Load records 5-6.
      NL.navigate('browse/start=4');
      NL.respondLast200(fixtures.p56);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      NL.assertPaginationPrevRoute('#browse/start=2');
      NL.assertPaginationNextRoute('#browse/start=4');

    });

  });

  describe('xxxxx|x|', function() {

    // ------------------------------------------------------------------------
    // << (enabled, previous page), >> (disabled, current page).
    // ------------------------------------------------------------------------

    it('with search query', function() {

      // Load record 6.
      NL.navigate('browse/query=x+y/start=5');
      NL.respondLast200(fixtures.p6);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to current page.
      NL.assertPaginationPrevRoute('#browse/query=x+y/start=3');
      NL.assertPaginationNextRoute('#browse/query=x+y/start=5');

    });

    it('without search query', function() {

      // Load record 6.
      NL.navigate('browse/start=5');
      NL.respondLast200(fixtures.p6);

      // << enabled, >> disabled.
      NL.assertPaginationPrevEnabled();
      NL.assertPaginationNextDisabled();

      // << links to previous page, >> links to next page.
      NL.assertPaginationPrevRoute('#browse/start=3');
      NL.assertPaginationNextRoute('#browse/start=5');

    });

  });


});
