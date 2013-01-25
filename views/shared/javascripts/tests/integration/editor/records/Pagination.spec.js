
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record list paginator.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Pagination', function() {


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

  it('|xx|xxxx', function() {

    // --------------------------------------------------------------------
    // << (disabled, #records), >> (enabled, next page).
    // --------------------------------------------------------------------

    // Load records 1-2.
    _t.navigate('records/search/start=0');
    _t.respondLast200(_t.json.records.p12);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` disabled, links to `#records`.
    prev.each(function() {
      expect($(this).parent('li')).toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records');
    });

    // `>>` enabled, links to next page.
    next.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=2');
    });

  });

  it('x|xx|xxx', function() {

    // --------------------------------------------------------------------
    // << (enabled, #records), >> (enabled, next page).
    // --------------------------------------------------------------------

    // Load records 2-3.
    _t.navigate('records/search/start=1');
    _t.respondLast200(_t.json.records.p23);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` enabled, links to `#records`.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records');
    });

    // `>>` enabled, links to next page.
    next.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=5');
    });

  });

  it('xx|xx|xx', function() {

    // --------------------------------------------------------------------
    // << (enabled, #records), >> (enabled, next page).
    // --------------------------------------------------------------------

    // Load records 3-4.
    _t.navigate('records/search/start=2');
    _t.respondLast200(_t.json.records.p34);

    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` enabled, links to `#records`.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records');
    });

    // `>>` enabled, links to next page.
    next.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=4');
    });

  });

  it('xxxx|xx|', function() {

    // --------------------------------------------------------------------
    // << (enabled, prev page), >> (disabled, current page).
    // --------------------------------------------------------------------

    // Load records 5-6.
    _t.navigate('records/search/start=4');
    _t.respondLast200(_t.json.records.p56);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` enabled, links to previous page.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=2');
    });

    // `>>` disabled, links to current page.
    next.each(function() {
      expect($(this).parent('li')).toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=4');
    });

  });

  it('xxxxx|x|', function() {

    // --------------------------------------------------------------------
    // << (enabled, prev page), >> (disabled, current page).
    // --------------------------------------------------------------------

    // Load record 6.
    _t.navigate('records/search/start=5');
    _t.respondLast200(_t.json.records.p6);

    // Get <</>> arrows.
    var pagination = _t.el.records.find('.pagination');
    var prev = pagination.find('.prev');
    var next = pagination.find('.next');

    // `<<` enabled, links to previous page.
    prev.each(function() {
      expect($(this).parent('li')).not.toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=3');
    });

    // `>>` disabled, links to current page.
    next.each(function() {
      expect($(this).parent('li')).toHaveClass('disabled');
      expect($(this)).toHaveAttr('href', '#records/search/start=5');
    });

  });


});
