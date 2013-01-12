
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


  var recordRows, recordModels, feature1, feature2, els;


  beforeEach(function() {

    _t.loadEditor();

    // Get record rows and models.
    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordListModels();

    // Get features.
    feature1 = _t.vw.map.layers[0].features[0];
    feature2 = _t.vw.map.layers[1].features[0];

    els = {
      pan:    _t.vw.record.$('input[value="pan"]'),
      poly:   _t.vw.record.$('input[value="poly"]'),
      close:  _t.vw.record.$('a[name="close"]')
    };

  });


  it('should open the form when a record row is clicked', function() {

    // --------------------------------------------------------------------
    // When one of the record listings in the left panel is clicked, the
    // list of records should be replaced by the edit form.
    // --------------------------------------------------------------------

    // Click on record row.
    _t.click($(recordRows[0]));

    // Check for form, no records.
    expect(_t.el.editor).toContain(_t.el.record);
    expect(_t.el.editor).not.toContain(_t.el.records);

  });


  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When a record edit form is opened, the inputs should be populated
    // with data from the record model.
    // --------------------------------------------------------------------

    // Open form, get elements.
    _t.click($(recordRows[0]));
    var favicon = 'https://www.google.com/favicon.ico';
    var inputs = _t.getRecordFormElements();

    expect(inputs.lead).            toHaveText('title1');
    expect(inputs.title).           toHaveValue('title1');
    expect(inputs.body).            toHaveValue('body1');
    expect(inputs.coverage).        toHaveValue('POINT(1 2)');
    expect(inputs.vectorColor).     toHaveValue('1');
    expect(inputs.strokeColor).     toHaveValue('4');
    expect(inputs.selectColor).     toHaveValue('7');
    expect(inputs.vectorOpacity).   toHaveValue('10');
    expect(inputs.selectOpacity).   toHaveValue('13');
    expect(inputs.strokeOpacity).   toHaveValue('16');
    expect(inputs.imageOpacity).    toHaveValue('19');
    expect(inputs.strokeWidth).     toHaveValue('22');
    expect(inputs.pointRadius).     toHaveValue('25');
    expect(inputs.pointImage).      toHaveValue(favicon);
    expect(inputs.minZoom).         toHaveValue('28');
    expect(inputs.maxZoom).         toHaveValue('31');
    expect(inputs.mapFocus).        toHaveValue('100,200');
    expect(inputs.mapZoom).         toHaveValue('10');

  });


  it('should show the "Text" tab on first form open', function() {

    // --------------------------------------------------------------------
    // When a form is opened for the first time in an editing session, the
    // "Text" tab should be activated by default.
    // --------------------------------------------------------------------

    // Open form.
    _t.click($(recordRows[0]));

    // Check for visible "Text."
    expect($('#record-form-text')).toHaveClass('active');

    // "Spatial" and "Style" should be invisible.
    expect($('#record-form-spatial')).not.toHaveClass('active');
    expect($('#record-form-style')).not.toHaveClass('active');

  });


  it('should show form when a map feature is clicked', function() {

    // --------------------------------------------------------------------
    // When a vector geometry on the map is clicked and an edit form isn't
    // already open, the edit form that corresponds to the geometry should
    // be displayed in the left pane.
    // --------------------------------------------------------------------

    // Trigger click.
    _t.clickOnMapFeature(_t.vw.map.layers[0], feature1);

    // Check for form.
    expect(_t.el.editor).toContain(_t.el.record);
    expect(_t.vw.record.model.get('title')).toEqual('title1');

  });


  it('should not open new form in response to map click', function() {

    // --------------------------------------------------------------------
    // When an edit form is already open, clicking on a map feature that
    // corresponds to a different model from the one bound to the form
    // should _not_ open the new form. This makes it impossible to
    // accidentally switch to another edit form by clicking on a feature
    // that belongs to a different record while drawing shapes in close
    // proximity to other vectors.
    // --------------------------------------------------------------------

    // Trigger click on Record 1 feature.
    _t.clickOnMapFeature(_t.vw.map.layers[0], feature1);

    // Check for form.
    expect(_t.el.editor).toContain(_t.el.record);
    expect(_t.vw.record.model.get('title')).toEqual('title1');

    // Trigger click on Record 2 feature.
    _t.clickOnMapFeature(_t.vw.map.layers[0], feature2);

    // Check for unchanged form.
    expect(_t.vw.record.model.get('title')).toEqual('title1');

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
    _t.click($(recordRows[0]));

    // Get focus and zoom.
    var center  = _t.vw.map.map.getCenter();
    var zoom    = _t.vw.map.map.getZoom();

    // Check unchanged focus.
    expect(center.lon).toEqual(100);
    expect(center.lat).toEqual(200);
    expect(zoom).toEqual(10);

  });


  it('should not focus map when the form is opened via map', function() {

    // --------------------------------------------------------------------
    // When the user clicks on a map vector to open an edit form, the map
    // should _not_ jump to the default focus position for the record that
    // corresponds to the clicked geometry. This to prevent lurching,
    // disorienting leaps that can occur when the default zoom for the
    // clicked record is much wider or tighter than the current map zoom.
    // --------------------------------------------------------------------

    // Set center and zoom.
    _t.setMapCenter(200, 300, 15);

    // Trigger click on Record 1 feature.
    _t.clickOnMapFeature(_t.vw.map.layers[0], feature1);

    // Get focus and zoom.
    var center  = _t.vw.map.map.getCenter();
    var zoom    = _t.vw.map.map.getZoom();

    // Check unchanged focus.
    expect(center.lon).toEqual(200);
    expect(center.lat).toEqual(300);
    expect(zoom).toEqual(15);

  });


  it('should default to "Navigate" edit mode when opened', function() {

    // --------------------------------------------------------------------
    // The geometry editing controls should always revert to the default
    // "Navigate" mode when a form is opened, regardless of what the state
    // of the form was when it was last closed.
    // --------------------------------------------------------------------

    // Show form, check mode.
    _t.click($(recordRows[0]));
    expect(_t.vw.record.getEditMode()).toEqual('pan');

    // Activate "Polygon" control, check mode.
    els.pan[0].checked = false; els.poly[0].checked = true;
    expect(_t.vw.record.getEditMode()).toEqual('poly');

    // Re-open the form.
    els.close.trigger('click');
    _t.respondRecords();
    _t.openRecordForm();

    // Check mode.
    expect(_t.vw.record.getEditMode()).toEqual('pan');

  });


});
