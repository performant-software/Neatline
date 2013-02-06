
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

      labels: {
        text:     _t.vw.record.$('a[href="#record-form-text"]'),
        spatial:  _t.vw.record.$('a[href="#record-form-spatial"]'),
        style:    _t.vw.record.$('a[href="#record-form-style"]')
      },

      tabs: {
        text:     _t.vw.record.$('#record-form-text'),
        spatial:  _t.vw.record.$('#record-form-spatial'),
        style:    _t.vw.record.$('#record-form-style')
      },

      add:        _t.vw.records.$('a[href="#records/add"]'),
      close:      _t.vw.record.$('a[name="close"]'),
      save:       _t.vw.record.$('a[name="save"]'),
      lead:       _t.vw.record.$('p.lead')
    };

  });


  it('should show the form when "New Record" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with a new model with defined style values.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(els.add);

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


  it('should activate the "Text" tab', function() {

    // --------------------------------------------------------------------
    // When a new record is created, the "Text" tab should be activated,
    // even if a different tab was active when the form was last closed.
    // --------------------------------------------------------------------

    // Open form.
    _t.click($(_t.getRecordRows()[1]));

    // Click "Style" tab.
    els.labels.style.tab('show');

    // Close the form.
    els.close.trigger('click');

    // Add record.
    _t.click(els.add);

    // "Text" tab should be active.
    expect(els.labels.text.parent('li')).toHaveClass('active');
    expect(els.tabs.text).toHaveClass('active');

    // "Spatial" should be inactive.
    expect(els.labels.spatial.parent('li')).not.toHaveClass('active');
    expect(els.tabs.spatial).not.toHaveClass('active');

    // "Style" should be inactive.
    expect(els.labels.style.parent('li')).not.toHaveClass('active');
    expect(els.tabs.style).not.toHaveClass('active');

  });

  it('should issue POST request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the form should issue a
    // POST request with the exhibit id.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(els.add);

    // Click "Save".
    els.save.trigger('click');

    // Route should be /record, method POST.
    _t.assertLastRequestRoute(__exhibit.api.record);
    _t.assertLastRequestMethod('POST');

    // Request should have exhibit id.
    expect(_t.getLastRequestParams().exhibit_id).toBeDefined();

  });


  it('should update the route after first save', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the URL hash should be
    // updated to point to the records/:id resource for the new record.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(els.add);

    // Click "Save".
    els.save.trigger('click');
    _t.respondNewRecord();

    // Get the id of the record.
    var newId = _t.getNewRecordId();

    // Route should be updated to records/:id.
    expect(Backbone.history.fragment).toEqual('records/'+newId);

  });


});
