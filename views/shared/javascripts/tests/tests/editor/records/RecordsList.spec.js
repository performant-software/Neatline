
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


  var recordRows, models;

  // Get fixtures.
  beforeEach(function() {

    _t.loadEditor();
    _t.navigate('records');

    // Get record rows and models.
    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordModels();

  });

  it('should list records', function() {

    // --------------------------------------------------------------------
    // When the editor application starts, the record listings should be
    // rendered in the left editing pane.
    // --------------------------------------------------------------------

    // Check listings.
    expect(recordRows.length).toEqual(3);
    expect($(recordRows[0]).find('.record-title').text()).
      toEqual('title1');
    expect($(recordRows[0]).find('.record-body').text()).
      toEqual('body1');
    expect($(recordRows[1]).find('.record-title').text()).
      toEqual('title2');
    expect($(recordRows[1]).find('.record-body').text()).
      toEqual('body2');
    expect($(recordRows[2]).find('.record-title').text()).
      toEqual('title3');
    expect($(recordRows[2]).find('.record-body').text()).
      toEqual('body3');

    // Check links.
    expect($(recordRows[0]).attr('href')).
      toEqual('#records/'+recordModels[0].get('id'));
    expect($(recordRows[1]).attr('href')).
      toEqual('#records/'+recordModels[1].get('id'));
    expect($(recordRows[2]).attr('href')).
      toEqual('#records/'+recordModels[2].get('id'));

  });

});
