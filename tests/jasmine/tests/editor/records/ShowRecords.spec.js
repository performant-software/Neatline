
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records | Show Records', function() {


  var fixtures = {
    defaultList: read('EditorRecordsShowRecords.defaultList.json'),
    titleTags:   read('EditorRecordsShowRecords.titleTags.json'),
    emptyTitle:  read('EditorRecordsShowRecords.emptyTitle.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should load records when exhibit starts', function() {

    // ------------------------------------------------------------------------
    // The record browser pane should show a list of records.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.defaultList);

    var rows = NL.getRecordListRows();

    // Should show titles and bodies.
    expect($(rows[0]).find('.title')).toHaveText('title1');
    expect($(rows[0]).find('.body')).toHaveText('body1');
    expect($(rows[1]).find('.title')).toHaveText('title2');
    expect($(rows[1]).find('.body')).toHaveText('body2');
    expect($(rows[2]).find('.title')).toHaveText('title3');
    expect($(rows[2]).find('.body')).toHaveText('body3');

    var record1 = NL.getRecordListModelByTitle('title1');
    var record2 = NL.getRecordListModelByTitle('title2');
    var record3 = NL.getRecordListModelByTitle('title3');

    // Should link to edit forms.
    expect($(rows[0]).attr('href')).toEqual('#edit/'+record1.id);
    expect($(rows[1]).attr('href')).toEqual('#edit/'+record2.id);
    expect($(rows[2]).attr('href')).toEqual('#edit/'+record3.id);

  });


  it('should strip tags in titles', function() {

    // ------------------------------------------------------------------------
    // HTML tags in record titles should be stripped out.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.titleTags);
    var rows = NL.getRecordListRows();

    // Should strip out HTML tags.
    expect($(rows[0]).find('.title')).toHaveText('title');

  });


  it('should show placeholders for empty titles', function() {

    // ------------------------------------------------------------------------
    // Empty titles should be replaced as placeholders.
    // ------------------------------------------------------------------------

    NL.respondRecordList200(fixtures.emptyTitle);
    var rows = NL.getRecordListRows();

    // Should strip out HTML tags.
    expect($(rows[0]).find('.title')).toHaveText(
      Neatline.g.neatline.strings.record.placeholders.title
    );

  });


});
