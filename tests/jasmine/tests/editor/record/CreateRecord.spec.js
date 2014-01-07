
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Create Record', function() {


  var el, fixtures =  {
    records: read('EditorRecordCreateRecord.records.json'),
    record:  read('EditorRecordCreateRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.respondRecordList200(fixtures.records);

    elements = {
      addButton:    NL.v.records.$('a[href="#record/add"]'),
      closeButton:  NL.v.record.$('a[name="close"]'),
      saveButton:   NL.v.record.$('a[name="save"]'),
      styleTab:     NL.v.record.$('a[href="#record-style"]'),
      leadId:       NL.v.record.$('p.lead span.id'),
      leadTitle:    NL.v.record.$('p.lead span.title')
    };

  });


  it('should show the form when "New Record" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "New Record" button is clicked, the record form should be
    // displayed with a new model with defined style values.
    // ------------------------------------------------------------------------

    // Add record.
    NL.click(elements.addButton);

    // Record form should be visible.
    expect(NL.v.editor.__ui.editor).toContain(NL.v.record.$el);

    // Record ID should be empty.
    expect(elements.leadId).toBeEmpty();

    // Title should display placeholder.
    expect(elements.leadTitle).toHaveText(
      Neatline.g.neatline.strings.record.placeholders.title
    );

    // Get the form model.
    var record = NL.v.record.model;

    // Model should have defined styles.
    expect(_.isString(record.get('presenter'))).              toBeTruthy();
    expect(_.isString(record.get('fill_color'))).             toBeTruthy();
    expect(_.isString(record.get('fill_color_select'))).      toBeTruthy();
    expect(_.isString(record.get('stroke_color'))).           toBeTruthy();
    expect(_.isString(record.get('stroke_color_select'))).    toBeTruthy();
    expect(_.isNumber(record.get('fill_opacity'))).           toBeTruthy();
    expect(_.isNumber(record.get('fill_opacity_select'))).    toBeTruthy();
    expect(_.isNumber(record.get('stroke_opacity'))).         toBeTruthy();
    expect(_.isNumber(record.get('stroke_opacity_select'))).  toBeTruthy();
    expect(_.isNumber(record.get('point_radius'))).           toBeTruthy();
    expect(_.isNumber(record.get('stroke_width'))).           toBeTruthy();

  });


  it('should activate the "Text" tab', function() {

    // ------------------------------------------------------------------------
    // When a new record is created, the "Text" tab should be activated, even
    // if a different tab was active when the form was last closed.
    // ------------------------------------------------------------------------

    // Open form.
    NL.click($(NL.getRecordListRows()[0]));

    // Click "Style" tab.
    elements.styleTab.tab('show');

    // Close the form.
    elements.closeButton.trigger('click');

    // Add record.
    NL.click(elements.addButton);

    // "Text" should be active.
    NL.assertActiveTab('text');

  });


  it('should issue POST request when "Save" is clicked', function() {

    // ------------------------------------------------------------------------
    // When a record is saved for the first time, the form should issue a POST
    // request with the exhibit id.
    // ------------------------------------------------------------------------

    // Add record.
    NL.click(elements.addButton);

    // Click "Save".
    elements.saveButton.trigger('click');

    // Route should be /record, method POST.
    NL.assertLastRequestRoute(Neatline.g.neatline.record_api);
    NL.assertLastRequestMethod('POST');

    // Request should have exhibit id.
    expect(NL.getLastRequestParams().exhibit_id).toBeDefined();

  });


  it('should not double-load layer for newly-saved record', function() {

    // ------------------------------------------------------------------------
    // Once the new record is saved on the server, it will start arriving in
    // result sets for viewport queries, including the one triggered after the
    // first save succeeds. Since the new record is already represented on the
    // map by the edit layer, a new layer for the saved record should not be
    // built in addition to the edit layer.
    // ------------------------------------------------------------------------

    // Add record, save.
    NL.click(elements.addButton);
    elements.saveButton.trigger('click');

    // Respond to save with new id.
    NL.respondLast200(fixtures.record);

    // Respond to map refresh with new collection.
    NL.respondLast200(fixtures.records);

    // Should not double-load the new record.
    NL.assertVectorLayerCount(1);

  });


  it('should update the route after save', function() {

    // ------------------------------------------------------------------------
    // When a record is saved, the URL hash should be updated to point to the
    // id-specific resource for the record. For example, if the "Text" tab is
    // active, the route should change from `#record/add/text` to:
    //
    // `#record/<id>/text`
    //
    // When the "Map" tab is active:
    //
    // `#record/<id>/map`
    //
    // etc.
    // ------------------------------------------------------------------------

    _.each(NL.getTabSlugs(), function(slug) {

      // Open new form with the tab.
      NL.navigate('record/add/'+slug);

      // Click "Save".
      elements.saveButton.trigger('click');
      NL.respondLast200(fixtures.record);

      // Route should be updated.
      var id = $.parseJSON(fixtures.record).id;
      expect(Backbone.history.fragment).toEqual('record/'+id+'/'+slug);

    });

  });


});
