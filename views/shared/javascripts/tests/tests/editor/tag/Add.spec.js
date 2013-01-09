
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for tag add flow.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tag Form Add', function() {

  var els;

  beforeEach(function() {

    _t.loadEditor();

    els = {
      add:    _t.vw.menu.$('a[href="#tags/add"]'),
      title:  _t.vw.tag.$('textarea[name="tag"]'),
      lead:   _t.vw.tag.$('p.lead')
    };

  });

  it('should show the form when "New Tag" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Tag" button is clicked, the tag form should be shown
    // with the model for the new record.
    // --------------------------------------------------------------------

    // "New Tag."
    _t.click(els.add);

    // Capture outoing request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('POST');
    expect(request.url).toEqual(__editor.api.tags);
    _t.respondNewTag();

    // Check for form, no records.
    expect(_t.el.editor).toContain(_t.el.tag);

  });

  it('should display placeholder in form header', function() {

    // --------------------------------------------------------------------
    // When an edit form is displayed for a tag that has a null tag (as is
    // the case when a new tag is created), a placeholder tag should be
    // displayed in the form header.
    // --------------------------------------------------------------------

    // "New Record."
    _t.click(els.add);
    _t.respondNewTag();

    // Check for placeholder.
    expect(els.lead.text()).toEqual(STRINGS.placeholders.title);

  });

});
