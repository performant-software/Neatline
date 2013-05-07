
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Open', function() {


  var el, recordModels, feature1, feature2;


  beforeEach(function() {

    NL.loadEditor();
    NL.respondAll200(NL.json.RecordFormOpen.records);

    recordModels = NL.getRecordListModels();
    feature1 = NL.vw.MAP.getVectorLayers()[0].features[0];
    feature2 = NL.vw.MAP.getVectorLayers()[1].features[0];

    el = {
      pan:    NL.vw.RECORD.$('input[value="pan"]'),
      poly:   NL.vw.RECORD.$('input[value="poly"]'),
      close:  NL.vw.RECORD.$('a[name="close"]')
    };

  });


  describe('model binding', function() {

    var model;

    afterEach(function() {

      // The form should be displayed and populated with data.
      expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.RECORD.$el);
      expect(NL.vw.RECORD.model.id).toEqual(model.id);

    });

    it('when a record row is clicked', function() {

      // ------------------------------------------------------------------
      // When one of the listings in the record browser is clicked, the
      // existing model should be bound to the form immediately.
      // ------------------------------------------------------------------

      model = recordModels[0];

      // Click on a record listing.
      NL.click($(NL.getRecordListRows()[1]));

    });

    it('when a loaded record is requested by a route', function() {

      // ------------------------------------------------------------------
      // When a record that has already been loaded into the browser is
      // requested by a route, the existing model should be bound to the
      // form immediately.
      // ------------------------------------------------------------------

      model = recordModels[0];

      // Request an already-loaded record.
      NL.navigate('record/'+recordModels[0].id);

    });

    it('when an unloaded record is requested by a route', function() {

      // ------------------------------------------------------------------
      // When a record that has _not_ already been loaded into the browser
      // is requested by a route, the record should be loaded.
      // ------------------------------------------------------------------

      model = NL.recordFromJson(NL.json.RecordForm.record);

      // Request unloaded record.
      NL.navigate('record/999');

      // Respond to the GET request.
      NL.respondLast200(NL.json.RecordForm.record);

    });

    it('when a map feature is clicked', function() {

      // ------------------------------------------------------------------
      // When a map feature is clicked, the feature's parent model should
      // be bound to the form immediately.
      // ------------------------------------------------------------------

      model = NL.vw.MAP.getVectorLayers()[0].nModel;

      // Click on map feature.
      NL.clickOnMapFeature(feature1);

    });

    it('when a record is selected', function() {

      // ------------------------------------------------------------------
      // When the `select` event is triggered (for example, but a click on
      // a map feature), the model should be bound to the form.
      // ------------------------------------------------------------------

      model = NL.vw.MAP.getVectorLayers()[0].nModel;

      // Select the model.
      Neatline.vent.trigger('select', { model: model });

    });

  });


  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When a record edit form is opened, the inputs should be populated
    // with data from the record model.
    // --------------------------------------------------------------------

    NL.showRecordForm(NL.json.RecordForm.record);

    var id = JSON.parse(NL.json.RecordForm.record).id;
    var inputs = NL.getRecordFormElements();

    expect(inputs.id).              toHaveText('#'+id+':'),
    expect(inputs.titleHeader).     toHaveText('title');
    expect(inputs.titleInput).      toHaveValue('title');
    expect(inputs.body).            toHaveValue('body');
    expect(inputs.itemId).          toHaveValue('1');
    expect(inputs.coverage).        toHaveValue('POINT(1 2)');
    expect(inputs.tags).            toHaveValue('tags');
    expect(inputs.widgets.val()).   toEqual(['Widget1','Widget3']);
    expect(inputs.presenter).       toHaveValue('Presenter2');
    expect(inputs.fillColor).       toHaveValue('#111111');
    expect(inputs.selectColor).     toHaveValue('#222222');
    expect(inputs.strokeColor).     toHaveValue('#333333');
    expect(inputs.fillOpacity).     toHaveValue('4');
    expect(inputs.selectOpacity).   toHaveValue('5');
    expect(inputs.strokeOpacity).   toHaveValue('6');
    expect(inputs.strokeWidth).     toHaveValue('7');
    expect(inputs.pointRadius).     toHaveValue('8');
    expect(inputs.zindex).          toHaveValue('9');
    expect(inputs.weight).          toHaveValue('10');
    expect(inputs.startDate).       toHaveValue('11');
    expect(inputs.endDate).         toHaveValue('12');
    expect(inputs.afterDate).       toHaveValue('13');
    expect(inputs.beforeDate).      toHaveValue('14');
    expect(inputs.pointImage).      toHaveValue('15');
    expect(inputs.wmsAddress).      toHaveValue('16');
    expect(inputs.wmsLayers).       toHaveValue('17');
    expect(inputs.minZoom).         toHaveValue('18');
    expect(inputs.maxZoom).         toHaveValue('19');
    expect(inputs.mapFocus).        toHaveValue('20');
    expect(inputs.mapZoom).         toHaveValue('21');

  });


  it('should populate null `widgets` value', function() {

    // --------------------------------------------------------------------
    // When a record with a null `widgets` value is bound to the form, all
    // options in the "Widgets" select should be toggled off.
    // --------------------------------------------------------------------

    // Open first record.
    NL.navigate('record/'+recordModels[0].id);

    // Null out `widgets` field.
    recordModels[1].set('widgets', null);

    // Open the form, get elements.
    NL.navigate('record/'+recordModels[1].id);
    var inputs = NL.getRecordFormElements();

    // All widgets should be deselected.
    expect(inputs.widgets.val()).toBeNull();

  });


  it('should not change form model in response to map click', function() {

    // --------------------------------------------------------------------
    // When an edit form is already open, clicking on a map feature that
    // corresponds to a different model from the one bound to the form
    // should _not_ open the new form. This makes it impossible to
    // accidentally switch to another edit form by clicking on a feature
    // that belongs to a different record while drawing shapes in close
    // proximity to other vectors.
    // --------------------------------------------------------------------

    // Trigger click on Record 1 feature.
    NL.clickOnMapFeature(feature1);

    // Record form should be displayed.
    expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.RECORD.$el);
    expect(NL.vw.RECORD.model.get('title')).toEqual('title1');

    // Trigger click on Record 2 feature.
    NL.clickOnMapFeature(feature2);

    // Form should not display new model.
    expect(NL.vw.RECORD.model.get('title')).toEqual('title1');

  });


  it('should focus map when the form is opened via editor', function() {

    // --------------------------------------------------------------------
    // When the edit form is opened in response to a click on one of the
    // listings in the record browser, the map should focus on the record.
    // --------------------------------------------------------------------

    // Set center and zoom.
    NL.setMapCenter(200, 300, 15);

    // Open form.
    NL.click($(NL.getRecordListRows()[1]));

    // Should focus on record.
    NL.assertMapViewport(100, 200, 10);

  });


});
