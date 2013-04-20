
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records List', function() {


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should load records when exhibit starts', function() {

    // --------------------------------------------------------------------
    // The record browser pane should show a list of records.
    // --------------------------------------------------------------------

    NL.respondRecordList200(NL.json.RecordsList.records.regular);
    var models = NL.getRecordListModels(), rows = NL.getRecordListRows();

    // Should show titles and bodies.
    expect($(rows[0])).toHaveText('New Record');
    expect($(rows[1]).find('.title')).toHaveText('title1');
    expect($(rows[1]).find('.body')).toHaveText('body1');
    expect($(rows[2]).find('.title')).toHaveText('title2');
    expect($(rows[2]).find('.body')).toHaveText('body2');
    expect($(rows[3]).find('.title')).toHaveText('title3');
    expect($(rows[3]).find('.body')).toHaveText('body3');

    // Should link to edit forms.
    expect($(rows[0]).attr('href')).toEqual('#record/add');
    expect($(rows[1]).attr('href')).toEqual('#record/'+models[0].id);
    expect($(rows[2]).attr('href')).toEqual('#record/'+models[1].id);
    expect($(rows[3]).attr('href')).toEqual('#record/'+models[2].id);

  });


  it('should strip tags in titles', function() {

    // --------------------------------------------------------------------
    // HTML tags in record titles should be stripped out.
    // --------------------------------------------------------------------

    NL.respondRecordList200(NL.json.RecordsList.records.html);
    var rows = NL.getRecordListRows();

    // Should strip out HTML tags.
    expect($(rows[1]).find('.title')).toHaveText('title');

  });


  it('should show placeholders for empty titles', function() {

    // --------------------------------------------------------------------
    // Empty titles should be replaced as placeholders.
    // --------------------------------------------------------------------

    NL.respondRecordList200(NL.json.RecordsList.records.empty);
    var rows = NL.getRecordListRows();

    // Should strip out HTML tags.
    expect($(rows[1]).find('.title')).toHaveText(
      STRINGS.record.placeholders.title
    );

  });


});
