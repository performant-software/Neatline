
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


  var el;


  beforeEach(function() {

    _t.loadEditor();

    el = {
      addButton:    _t.vw.RECORDS.$('a[href="#record/add"]'),
      closeButton:  _t.vw.RECORD.$('a[name="close"]'),
      saveButton:   _t.vw.RECORD.$('a[name="save"]'),
      styleTab:     _t.vw.RECORD.$('a[href="#record-style"]'),
      leadId:       _t.vw.RECORD.$('p.lead span.id'),
      leadTitle:    _t.vw.RECORD.$('p.lead span.title')
    };

  });


  it('should show the form when "New Record" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with a new model with defined style values.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(el.addButton);

    // Record form should be visible.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);

    // Form id should be empty.
    expect(el.leadId).toBeEmpty();

    // Form title should display placeholder.
    expect(el.leadTitle.text()).toEqual(STRINGS.placeholders.title);

    // Model should have exhibit id.
    var record = _t.vw.RECORD.model;
    expect(record.get('exhibit_id')).toEqual(Neatline.global.exhibit.id);

    // Model should have defined styles.
    expect(_.isString(record.get('presenter'))).      toBeTruthy();
    expect(_.isString(record.get('vector_color'))).   toBeTruthy();
    expect(_.isString(record.get('stroke_color'))).   toBeTruthy();
    expect(_.isString(record.get('select_color'))).   toBeTruthy();
    expect(_.isNumber(record.get('vector_opacity'))). toBeTruthy();
    expect(_.isNumber(record.get('stroke_opacity'))). toBeTruthy();
    expect(_.isNumber(record.get('select_opacity'))). toBeTruthy();
    expect(_.isNumber(record.get('point_radius'))).   toBeTruthy();
    expect(_.isNumber(record.get('stroke_width'))).   toBeTruthy();

  });


  it('should activate the "Text" tab', function() {

    // --------------------------------------------------------------------
    // When a new record is created, the "Text" tab should be activated,
    // even if a different tab was active when the form was last closed.
    // --------------------------------------------------------------------

    // Open form.
    _t.click($(_t.getRecordRows()[1]));

    // Click "Style" tab.
    el.styleTab.tab('show');

    // Close the form.
    el.closeButton.trigger('click');

    // Add record.
    _t.click(el.addButton);

    // "Text" should be active.
    _t.assertActiveTab('text');

  });

  it('should issue POST request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the form should issue a
    // POST request with the exhibit id.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(el.addButton);

    // Click "Save".
    el.saveButton.trigger('click');

    // Route should be /record, method POST.
    _t.assertLastRequestRoute(Neatline.global.record_api);
    _t.assertLastRequestMethod('POST');

    // Request should have exhibit id.
    expect(_t.getLastRequestParams().exhibit_id).toBeDefined();

  });


  it('should update the route after first save', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the URL hash should be
    // updated to point to the record/:id resource for the new record.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(el.addButton);

    // Click "Save".
    el.saveButton.trigger('click');
    _t.respondNewRecord();

    // Get the id of the record.
    var newId = _t.getNewRecordId();

    // Route should be updated to record/:id.
    expect(Backbone.history.fragment).toEqual('record/'+newId);

  });


});
