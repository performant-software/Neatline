
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record add flow.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Add', function() {

  var els;

  beforeEach(function() {

    _t.loadEditor();

    els = {
      add:    _t.vw.menu.$('a[href="#records/add"]'),
      title:  _t.vw.record.$('textarea[name="title"]'),
      lead:   _t.vw.record.$('p.lead')
    };

  });

  it('should show the form when "New Record" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with the model for the new record.
    // --------------------------------------------------------------------

    // "New Record."
    _t.click(els.add);

    // Capture outoing request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('POST');
    expect(request.url).toEqual(__exhibit.api.records);
    _t.respondNewRecord();

    // Check for form, no records.
    expect(_t.el.editor).toContain(_t.el.record);

  });

  it('should display placeholder in form header', function() {

    // --------------------------------------------------------------------
    // When an edit form is displayed for a record that has a null title
    // (as is the case when a new record is created), a placeholder title
    // should be displayed in the form header.
    // --------------------------------------------------------------------

    // "New Record."
    _t.click(els.add);
    _t.respondNewRecord();

    // Check for placeholder.
    expect(els.lead.text()).toEqual(STRINGS.placeholders.title);

  });

});
