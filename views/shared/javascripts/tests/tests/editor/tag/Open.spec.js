
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for tag form open.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tag Form Open', function() {

  var tagRows;

  beforeEach(function() {

    _t.loadEditor();
    _t.showTagsList();

    // Get tag rows.
    tagRows = _t.getTagRows();

  });

  it('should open the form when a tag row is clicked', function() {

    // --------------------------------------------------------------------
    // When one of the tag listings in the left panel is clicked, the list
    // of tags should be replaced by the edit form.
    // --------------------------------------------------------------------

    // Click on record row.
    _t.click($(tagRows[0]));

    // Check for form, no records.
    expect(_t.el.editor).toContain(_t.el.tag);
    expect(_t.el.editor).not.toContain(_t.el.tags);

  });

  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When a tag edit form is opened, the inputs should be populated with
    // data from the record model.
    // --------------------------------------------------------------------

    // Open form.
    _t.click($(tagRows[0]));
    var inputs = _t.getTagFormElements();

    expect(inputs.lead).            toHaveText('tag1');
    expect(inputs.tag).             toHaveValue('tag1');
    expect(inputs.vectorColor).     toBeChecked();
    expect(inputs.strokeColor).     toBeChecked();
    expect(inputs.selectColor).     toBeChecked();
    expect(inputs.vectorOpacity).   toBeChecked();
    expect(inputs.selectOpacity).   toBeChecked();
    expect(inputs.strokeOpacity).   toBeChecked();
    expect(inputs.imageOpacity).    toBeChecked();
    expect(inputs.strokeWidth).     toBeChecked();
    expect(inputs.pointRadius).     toBeChecked();
    expect(inputs.pointImage).      toBeChecked();
    expect(inputs.minZoom).         toBeChecked();
    expect(inputs.maxZoom).         toBeChecked();
    expect(inputs.mapFocus).        toBeChecked();
    expect(inputs.mapZoom).         toBeChecked();

  });

});
