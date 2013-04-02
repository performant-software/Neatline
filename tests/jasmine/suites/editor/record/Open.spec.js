
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form open.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Open', function() {


  var el, recordRows, recordModels, feature1, feature2;


  beforeEach(function() {

    _t.loadEditor();

    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordListModels();

    feature1  = _t.vw.MAP.layers[0].features[0];
    feature2  = _t.vw.MAP.layers[1].features[0];

    el = {
      pan:    _t.vw.RECORD.$('input[value="pan"]'),
      poly:   _t.vw.RECORD.$('input[value="poly"]'),
      close:  _t.vw.RECORD.$('a[name="close"]')
    };

  });


  describe('model binding', function() {

    var model;

    afterEach(function() {

      // The form should be displayed and  populated with data.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
      expect(_t.vw.RECORD.model.get('id')).toEqual(model.get('id'));

    });

    it('when a record row is clicked', function() {

      // ------------------------------------------------------------------
      // When one of the listings in the record browser is clicked, the
      // existing model should be bound to the form immediately.
      // ------------------------------------------------------------------

      model = recordModels[0];

      // Click on a record listing.
      _t.click($(recordRows[1]));

    });

    it('when a loaded record is requested by a route', function() {

      // ------------------------------------------------------------------
      // When a record that has already been loaded into the browser is
      // requested by a route, the existing model should be bound to the
      // form immediately.
      // ------------------------------------------------------------------

      model = recordModels[0];

      // Request an already-loaded record.
      _t.navigate('record/'+recordModels[0].get('id'));

    });

    it('when an unloaded record is requested by a route', function() {

      // ------------------------------------------------------------------
      // When a record that has _not_ already been loaded into the browser
      // is requested by a route, the record should be loaded.
      // ------------------------------------------------------------------

      model = _t.buildModelFromJson(_t.json.record.standard);

      // Request unloaded record.
      _t.navigate('record/999');

      // Respond to the GET request.
      _t.respondLast200(_t.json.record.standard);

    });

    it('when a map feature is clicked', function() {

      // ------------------------------------------------------------------
      // When a map feature is clicked, the feature's parent model should
      // be bound to the form immediately.
      // ------------------------------------------------------------------

      model = _t.vw.MAP.layers[0].nModel;

      // Click on map feature.
      _t.clickOnMapFeature(feature1);

    });

  });


  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When a record edit form is opened, the inputs should be populated
    // with data from the record model.
    // --------------------------------------------------------------------

    // Open form, get elements.
    _t.navigate('record/'+recordModels[0].get('id'));
    var inputs = _t.getRecordFormElements();

    // Get the form model id.
    var id = recordModels[0].get('id');

    expect(inputs.id).              toHaveText('#'+id+':'),
    expect(inputs.titleHeader).     toHaveText('title1');
    expect(inputs.titleInput).      toHaveValue('title1');
    expect(inputs.body).            toHaveValue('body1');
    expect(inputs.itemId).          toHaveValue('1');
    expect(inputs.coverage).        toHaveValue('POINT(1 2)');
    expect(inputs.tags).            toHaveValue('tags1');
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
    expect(inputs.weight).          toHaveValue('9');
    expect(inputs.startDate).       toHaveValue('10');
    expect(inputs.endDate).         toHaveValue('11');
    expect(inputs.pointImage).      toHaveValue('12');
    expect(inputs.wmsAddress).      toHaveValue('13');
    expect(inputs.wmsLayers).       toHaveValue('14');
    expect(inputs.minZoom).         toHaveValue('15');
    expect(inputs.maxZoom).         toHaveValue('16');
    expect(inputs.showAfterDate).   toHaveValue('17');
    expect(inputs.showBeforeDate).  toHaveValue('18');
    expect(inputs.mapFocus).        toHaveValue('100,200');
    expect(inputs.mapZoom).         toHaveValue('10');

  });


  it('should populate null `widgets` value', function() {

    // --------------------------------------------------------------------
    // When a record with a null `widgets` value is bound to the form, all
    // options in the "Widgets" select should be toggled off.
    // --------------------------------------------------------------------

    // Open first record.
    _t.navigate('record/'+recordModels[0].get('id'));

    // Null out `widgets` field.
    recordModels[1].set('widgets', null);

    // Open the form, get elements.
    _t.navigate('record/'+recordModels[1].get('id'));
    var inputs = _t.getRecordFormElements();

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
    _t.clickOnMapFeature(feature1);

    // Record form should be displayed.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
    expect(_t.vw.RECORD.model.get('title')).toEqual('title1');

    // Trigger click on Record 2 feature.
    _t.clickOnMapFeature(feature2);

    // Form should not display new model.
    expect(_t.vw.RECORD.model.get('title')).toEqual('title1');

  });


  it('should focus map when the form is opened via editor', function() {

    // --------------------------------------------------------------------
    // When an edit form is opened by way of the records pane (when the
    // user clicks on one of the listings), the map should focus on the
    // geometry vectors for that record.
    // --------------------------------------------------------------------

    // Set center and zoom.
    _t.setMapCenter(200, 300, 15);

    // Open form.
    _t.click($(recordRows[1]));

    // Focus should be unchanged.
    _t.assertMapViewport(100, 200, 10);

  });


  it('should not focus map when the form is opened via map', function() {

    // --------------------------------------------------------------------
    // When the user clicks on a map vector to open an edit form, the map
    // should _not_ jump to the default focus position for the record that
    // corresponds to the clicked geometry. This to prevent disorienting
    // leaps that can occur when the default zoom for the clicked record
    // is much wider or tighter than the current map zoom.
    // --------------------------------------------------------------------

    // Set center and zoom.
    _t.setMapCenter(200, 300, 15);

    // Trigger click on Record 1 feature.
    _t.clickOnMapFeature(feature1);

    // Focus should be unchanged.
    _t.assertMapViewport(200, 300, 15);

  });


});
