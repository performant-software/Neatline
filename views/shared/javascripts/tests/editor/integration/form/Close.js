
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form close.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Open/Close', function() {

  var recordRows, mapLayers, models, feature1, feature2;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Get records rows.
    recordRows = _t.getRecordRows();

  });

  it('should close the form when "Close" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Close" button at the bottom of the record edit form is
    // clicked, the form should disappear and the records list should be
    // re-rendered in the content pane.
    // --------------------------------------------------------------------

    // Open form, click close.
    $(recordRows[0]).trigger('click');
    _t.formView.closeButton.trigger('click');

    // Check for records list, no form.
    expect(_t.recordsView.$el).not.toContain(_t.formView.form);
    expect(_t.recordsView.$el).toContain(_t.recordsView.ul);

    // 3 records in browser pane.
    recordRows = _t.getRecordRows();
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

  });

});
