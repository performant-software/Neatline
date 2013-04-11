
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record browser tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records List', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('should list records', function() {

    // --------------------------------------------------------------------
    // The record browser pane should show a list of records.
    // --------------------------------------------------------------------

    _t.showRecordList(_t.json.records.list);

    // Get record list models and rows.
    var rows = _t.getRecordListRows(), models = _t.getRecordListModels();

    // Should show link to add new record.
    expect($(rows[0]).attr('href')).toEqual('#record/add');
    expect($(rows[0])).toHaveText('New Record');

    // Should list titles and bodies.
    expect($(rows[1]).attr('href')).toEqual('#record/'+models[0].id);
    expect($(rows[1]).find('.title')).toHaveText('title');
    expect($(rows[1]).find('.body')).toHaveText('body');

    // Show strip tags from titles and bodies.
    expect($(rows[2]).attr('href')).toEqual('#record/'+models[1].id);
    expect($(rows[2]).find('.title')).toHaveText('title with tags');
    expect($(rows[2]).find('.body')).toHaveText('body with tags');

    // Should show placeholder for empty titles.
    var placeholder = STRINGS.placeholders.title;
    expect($(rows[3]).attr('href')).toEqual('#record/'+models[2].id);
    expect($(rows[3]).find('.title')).toHaveText(placeholder);
    expect($(rows[3]).find('.body').text().trim()).toEqual('');

  });


});
