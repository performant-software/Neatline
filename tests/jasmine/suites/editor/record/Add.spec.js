
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Add', function() {


  var el, fx =  {
    records: readFixtures('EditorRecordAdd.records.json'),
    record:  readFixtures('EditorRecordAdd.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.respondRecordList200(fx.records);

    el = {
      addButton:    NL.vw.RECORDS.$('a[href="#record/add"]'),
      closeButton:  NL.vw.RECORD.$('a[name="close"]'),
      saveButton:   NL.vw.RECORD.$('a[name="save"]'),
      styleTab:     NL.vw.RECORD.$('a[href="#record-style"]'),
      leadId:       NL.vw.RECORD.$('p.lead span.id'),
      leadTitle:    NL.vw.RECORD.$('p.lead span.title')
    };

  });


  it('should show the form when "New Record" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with a new model with defined style values.
    // --------------------------------------------------------------------

    // Add record.
    NL.click(el.addButton);

    // Record form should be visible.
    expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.RECORD.$el);

    // Form id should be empty.
    expect(el.leadId).toBeEmpty();

    // Form title should display placeholder.
    expect(el.leadTitle).toHaveText(STRINGS.record.placeholders.title);

    // Model should have exhibit id.
    var record = NL.vw.RECORD.model;
    expect(record.get('exhibit_id')).toEqual(Neatline.global.exhibit.id);

    // Model should have defined styles.
    expect(_.isString(record.get('presenter'))).            toBeTruthy();
    expect(_.isString(record.get('fill_color'))).           toBeTruthy();
    expect(_.isString(record.get('fill_color_select'))).    toBeTruthy();
    expect(_.isString(record.get('stroke_color'))).         toBeTruthy();
    expect(_.isString(record.get('stroke_color_select'))).  toBeTruthy();
    expect(_.isNumber(record.get('fill_opacity'))).         toBeTruthy();
    expect(_.isNumber(record.get('fill_opacity_select'))).  toBeTruthy();
    expect(_.isNumber(record.get('stroke_opacity'))).       toBeTruthy();
    expect(_.isNumber(record.get('stroke_opacity_select'))).toBeTruthy();
    expect(_.isNumber(record.get('point_radius'))).         toBeTruthy();
    expect(_.isNumber(record.get('stroke_width'))).         toBeTruthy();

  });


  it('should activate the "Text" tab', function() {

    // --------------------------------------------------------------------
    // When a new record is created, the "Text" tab should be activated,
    // even if a different tab was active when the form was last closed.
    // --------------------------------------------------------------------

    // Open form.
    NL.click($(NL.getRecordListRows()[1]));

    // Click "Style" tab.
    el.styleTab.tab('show');

    // Close the form.
    el.closeButton.trigger('click');

    // Add record.
    NL.click(el.addButton);

    // "Text" should be active.
    NL.assertActiveTab('text');

  });

  it('should issue POST request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When a record is saved for the first time, the form should issue a
    // POST request with the exhibit id.
    // --------------------------------------------------------------------

    // Add record.
    NL.click(el.addButton);

    // Click "Save".
    el.saveButton.trigger('click');

    // Route should be /record, method POST.
    NL.assertLastRequestRoute(Neatline.global.records_api);
    NL.assertLastRequestMethod('POST');

    // Request should have exhibit id.
    expect(NL.getLastRequestParams().exhibit_id).toBeDefined();

  });


  it('should not double-load layer for newly-saved record', function() {

    // --------------------------------------------------------------------
    // Once the new record is saved on the server, it will start arriving
    // in result sets for viewport queries, including the one kicked off
    // immediately after the first save succeeds. Since the new record is
    // already represented on the map by the edit layer, a new layer for
    // the saved record should not be built in addition to the edit layer.
    // --------------------------------------------------------------------

    // Add record, save.
    NL.click(el.addButton);
    el.saveButton.trigger('click');

    // Respond to save with new id.
    NL.respondLast200(fx.record);

    // Respond to map refresh with new collection.
    NL.respondLast200(fx.records);

    // Should not double-load the new record.
    NL.assertVectorLayerCount(1);

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

    _.each(NL.getTabSlugs(), function(slug) {

      // Open new form with the tab.
      NL.navigate('record/add/'+slug);

      // Click "Save".
      el.saveButton.trigger('click');
      NL.respondLast200(fx.record);

      // Route should be updated.
      var id = $.parseJSON(fx.record).id;
      expect(Backbone.history.fragment).toEqual('record/'+id+'/'+slug);

    });

  });


});
