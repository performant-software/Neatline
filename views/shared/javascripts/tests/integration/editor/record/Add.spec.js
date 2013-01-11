
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
      save:   _t.vw.record.$('a[name="save"]'),
      lead:   _t.vw.record.$('p.lead')
    };

    // Add record.
    _t.click(els.add);

  });


  it('should show the form when "New Record" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with the model for the new record.
    // --------------------------------------------------------------------

    expect(_t.el.editor).toContain(_t.el.record);

  });


  it('should display placeholder in form header', function() {

    // --------------------------------------------------------------------
    // When an edit form is displayed for a record that has a null title
    // (as is the case when a new record is created), a placeholder title
    // should be displayed in the form header.
    // --------------------------------------------------------------------

    expect(els.lead.text()).toEqual(STRINGS.placeholders.title);

  });


  it('should generate well-formed POST request', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the form should issue a
    // POST request with the new data.
    // --------------------------------------------------------------------

    els.save.trigger('click');

    // Capture outoing request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('POST');
    expect(request.url).toEqual(__exhibit.api.record);

  });


});
