
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
    expect(_.isString(record.get('fill_color'))).     toBeTruthy();
    expect(_.isString(record.get('select_color'))).   toBeTruthy();
    expect(_.isString(record.get('stroke_color'))).   toBeTruthy();
    expect(_.isNumber(record.get('fill_opacity'))).   toBeTruthy();
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
    _t.click($(_t.getRecordListRows()[1]));

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
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('POST');

    // Request should have exhibit id.
    expect(_t.getLastRequestParams().exhibit_id).toBeDefined();

  });


  it('should update the route after save', function() {

    // --------------------------------------------------------------------
    // When a record is saved, the URL hash should be updated to point to
    // the id-specific resource for the record. For example, if the "Text"
    // tab is active, the route should change from `#record/add/text` to:
    //
    // `#record/<id>/text`
    //
    // When the "Map" tab is active:
    //
    // `#record/<id>/map`
    //
    // etc.
    // --------------------------------------------------------------------

    // Add record.
    _t.click(el.addButton);

    // Walk tab slugs.
    _.each(_t.getTabSlugs(), function(slug) {

      // Click on the tab.
      var tab = _t.vw.RECORD.$('a[href="#record-'+slug+'"]')
      tab.trigger('click');

      // Click "Save".
      el.saveButton.trigger('click');
      _t.respondLast200(_t.json.record.add);

      // Route should be updated.
      var id = $.parseJSON(_t.json.record.add).id;
      expect(Backbone.history.fragment).toEqual('record/'+id+'/'+slug);

    });

  });


});
