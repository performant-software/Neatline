
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record list paginator.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Pagination', function() {


  beforeEach(function() {
    _t.loadEditor();
    __editor.perPage = 2;
  });


  it('should hide pagination when all records fit', function() {

    // --------------------------------------------------------------------
    // The paginators should not be displayed when the entire record list
    // can fit into a single screen.
    // --------------------------------------------------------------------

    __editor.perPage = 10;

    // Load 2 records.
    _t.navigate('records');
    _t.respondLast200(_t.json.records.p12);

    // Paginators should be hidden.
    expect(_t.el.records.find('.pagination')).toBeEmpty();

  });

  it('should render |xx|xxxx', function() {

    // --------------------------------------------------------------------
    // When the offset is 0, << should be disabled and link to #records
    // and >> should link forward.
    // --------------------------------------------------------------------

    // Load records 1-2.
    _t.navigate('records/search/start=0');
    _t.respondLast200(_t.json.records.p12);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` should be disabled and link to `records`.
    prev.each(function() {
      expect($(this).parent('li')).toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records');
    });

    // `>>` should link to next page.
    next.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=2');
    });

  });

  it('should render x|xx|xxx', function() {

    // --------------------------------------------------------------------
    // When the offset is between 0 and the page length, << should be
    // enabled and link to #records and >> should link forward.
    // --------------------------------------------------------------------

    // Load records 2-3.
    _t.navigate('records/search/start=1');
    _t.respondLast200(_t.json.records.p23);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` should link to `records`.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records');
    });

    // `>>` should link to next page.
    next.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=5');
    });

  });

  it('should render xx|xx|xx', function() {

    // --------------------------------------------------------------------
    // On an interior page, << and >> should link to the prev/next pages.
    // --------------------------------------------------------------------

    // Load records 3-4.
    _t.navigate('records/search/start=2');
    _t.respondLast200(_t.json.records.p34);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` should link to `records`.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records');
    });

    // `>>` should link to next page.
    next.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=4');
    });

  });

  it('should render xxxx|xx|', function() {

    // --------------------------------------------------------------------
    // On the last page, << should link back and >> should be disabled and
    // link to the current page.
    // --------------------------------------------------------------------

    // Load records 5-6.
    _t.navigate('records/search/start=4');
    _t.respondLast200(_t.json.records.p56);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` should link to previous page.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=2');
    });

    // `>>` should be disabled and link to the current page.
    next.each(function() {
      expect($(this).parent('li')).toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=4');
    });

  });

  it('should render xxxxx|x|', function() {

    // --------------------------------------------------------------------
    // When the offset is in the middle of the last page, << should link
    // back and >> should be disabled and link to the current page.
    // --------------------------------------------------------------------

    // Load record 6.
    _t.navigate('records/search/start=5');
    _t.respondLast200(_t.json.records.p6);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` should link to previous page.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=3');
    });

    // `>>` should be disabled and link to the current page.
    next.each(function() {
      expect($(this).parent('li')).toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=5');
    });

  });


});
