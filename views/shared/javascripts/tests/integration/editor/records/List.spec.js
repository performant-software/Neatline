
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


  var recordRows, recordModels;


  beforeEach(function() {

    _t.loadEditor();

    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordListModels();

  });


  it('should list records', function() {

    // --------------------------------------------------------------------
    // At #records, a list of records should be rendered in the editor.
    // --------------------------------------------------------------------

    // Record titles and bodies should be listed.
    expect(recordRows.length).toEqual(4);
    expect($(recordRows[1]).find('.title').text()).
      toEqual('title1');
    expect($(recordRows[1]).find('.body').text()).
      toEqual('body1')
    expect($(recordRows[2]).find('.title').text()).
      toEqual('title2');
    expect($(recordRows[2]).find('.body').text()).
      toEqual('body2');
    expect($(recordRows[3]).find('.title').text()).
      toEqual('title3')
    expect($(recordRows[3]).find('.body').text()).
      toEqual('body3');

    // Record edit form links should be listed.
    expect($(recordRows[0]).attr('href')).
      toEqual('#records/add');
    expect($(recordRows[1]).attr('href')).
      toEqual('#records/'+recordModels[0].get('id'));
    expect($(recordRows[2]).attr('href')).
      toEqual('#records/'+recordModels[1].get('id'));
    expect($(recordRows[3]).attr('href')).
      toEqual('#records/'+recordModels[2].get('id'));

  });


});
