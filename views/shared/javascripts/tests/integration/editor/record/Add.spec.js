
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
      add:    _t.vw.records.$('a[href="#records/add"]'),
      save:   _t.vw.record.$('a[name="save"]'),
      lead:   _t.vw.record.$('p.lead')
    };

    // Add record.
    _t.click(els.add);

  });


  it('should show the form when "New Record" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with a new model with defined style values.
    // --------------------------------------------------------------------

    // Record form should be visible.
    expect(_t.el.editor).toContain(_t.el.record);

    // Lead should show placeholder title.
    expect(els.lead.text()).toEqual(STRINGS.placeholders.title);

    // Model should have exhibit id.
    var record = _t.vw.record.model;
    expect(record.get('exhibit_id')).toEqual(__exhibit.id);

    // Model should have defined styles.
    expect(_.isString(record.get('vector_color'))).   toBeTruthy();
    expect(_.isString(record.get('stroke_color'))).   toBeTruthy();
    expect(_.isString(record.get('select_color'))).   toBeTruthy();
    expect(_.isNumber(record.get('vector_opacity'))). toBeTruthy();
    expect(_.isNumber(record.get('stroke_opacity'))). toBeTruthy();
    expect(_.isNumber(record.get('select_opacity'))). toBeTruthy();
    expect(_.isNumber(record.get('image_opacity'))).  toBeTruthy();
    expect(_.isNumber(record.get('point_radius'))).   toBeTruthy();
    expect(_.isNumber(record.get('stroke_width'))).   toBeTruthy();

  });


  it('should generate well-formed POST request', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the form should issue a
    // POST request with the exhibit id.
    // --------------------------------------------------------------------

    // Click "Save".
    els.save.trigger('click');

    // Capture outoing request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Method should be POST.
    expect(request.method).toEqual('POST');

    // URL should be /record.
    expect(request.url).toEqual(__exhibit.api.record);

  });


  it('should update the route after first save', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the URL hash should be
    // updated to point to the records/:id resource for the new record.
    // --------------------------------------------------------------------

    // Click "Save".
    els.save.trigger('click');
    _t.respondNewRecord();

    // Get the id of the new record.
    var id = $.parseJSON(_t.json.record.add).id;

    // Route should be updated to records/:id.
    expect(Backbone.history.fragment).toEqual('records/'+id);

  });


});
