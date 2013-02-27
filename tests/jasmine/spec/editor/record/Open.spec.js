
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

    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordListModels();

    feature1  = _t.vw.MAP.layers[0].features[0];
    feature2  = _t.vw.MAP.layers[1].features[0];

    els = {

      pan:        _t.vw.record.$('input[value="pan"]'),
      poly:       _t.vw.record.$('input[value="poly"]'),
      close:      _t.vw.record.$('a[name="close"]'),

      labels: {
        text:     _t.vw.record.$('a[href="#record-form-text"]'),
        spatial:  _t.vw.record.$('a[href="#record-form-spatial"]'),
        style:    _t.vw.record.$('a[href="#record-form-style"]')
      },

      tabs: {
        text:     _t.vw.record.$('#record-form-text'),
        spatial:  _t.vw.record.$('#record-form-spatial'),
        style:    _t.vw.record.$('#record-form-style')
      }

    };

  });


  it('should open the form when a record row is clicked', function() {

    // --------------------------------------------------------------------
    // When one of the record listings in the left panel is clicked, the
    // list of records should be replaced by the edit form.
    // --------------------------------------------------------------------

    // Click on record row.
    _t.click($(recordRows[1]));

    // Record form should be displayed.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.el.record);
    expect(_t.vw.EDITOR.__ui.editor).not.toContain(_t.el.records);

  });


  it('should open the form when /records/:id is requested', function() {

    // --------------------------------------------------------------------
    // The record form should be displayed when /records/:id is accessed.
    // --------------------------------------------------------------------

    // Click on record row.
    _t.navigate($(recordRows[1]).attr('href'));

    // Record form should be displayed.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.el.record);
    expect(_t.vw.EDITOR.__ui.editor).not.toContain(_t.el.records);

  });


  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When a record edit form is opened, the inputs should be populated
    // with data from the record model.
    // --------------------------------------------------------------------

    // Open form, get elements.
    _t.click($(recordRows[1]));
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
    expect(inputs.presenter).       toHaveValue('StaticBubble');
    expect(inputs.vectorColor).     toHaveValue('#444444');
    expect(inputs.strokeColor).     toHaveValue('#777777');
    expect(inputs.selectColor).     toHaveValue('#101010');
    expect(inputs.vectorOpacity).   toHaveValue('13');
    expect(inputs.selectOpacity).   toHaveValue('16');
    expect(inputs.strokeOpacity).   toHaveValue('19');
    expect(inputs.strokeWidth).     toHaveValue('22');
    expect(inputs.pointRadius).     toHaveValue('25');
    expect(inputs.pointImage).      toHaveValue('28');
    expect(inputs.minZoom).         toHaveValue('31');
    expect(inputs.maxZoom).         toHaveValue('34');
    expect(inputs.mapFocus).        toHaveValue('100,200');
    expect(inputs.mapZoom).         toHaveValue('10');

  });


  it('should show the "Text" tab on first form open', function() {

    // --------------------------------------------------------------------
    // When a form is opened for the first time in an editing session, the
    // "Text" tab should be activated by default.
    // --------------------------------------------------------------------

    // Open form.
    _t.click($(recordRows[1]));

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


  it('should show form when a map feature is clicked', function() {

    // --------------------------------------------------------------------
    // When a vector geometry on the map is clicked and an edit form isn't
    // already open, the edit form that corresponds to the geometry should
    // be displayed in the left pane.
    // --------------------------------------------------------------------

    // Trigger click.
    _t.clickOnMapFeature(feature1);

    // Record form should be displayed.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.el.record);
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
    _t.clickOnMapFeature(feature1);

    // Record form should be displayed.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.el.record);
    expect(_t.vw.record.model.get('title')).toEqual('title1');

    // Trigger click on Record 2 feature.
    _t.clickOnMapFeature(feature2);

    // Form should not display new model.
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
    _t.click($(recordRows[1]));

    // Get focus and zoom.
    var center  = _t.vw.MAP.map.getCenter();
    var zoom    = _t.vw.MAP.map.getZoom();

    // Focus should be unchanged.
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
    _t.clickOnMapFeature(feature1);

    // Get focus and zoom.
    var center  = _t.vw.MAP.map.getCenter();
    var zoom    = _t.vw.MAP.map.getZoom();

    // Focus should be unchanged.
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
    _t.click($(recordRows[1]));
    expect(_t.vw.spatial.getEditMode()).toEqual('pan');

    // Activate "Polygon" control, check mode.
    els.pan[0].checked = false; els.poly[0].checked = true;
    expect(_t.vw.spatial.getEditMode()).toEqual('poly');

    // Close the form.
    els.close.trigger('click');
    _t.respondRecords();

    // Re-open the form.
    _t.openFirstRecordForm();

    // "Navigate" mode should be active.
    expect(_t.vw.spatial.getEditMode()).toEqual('pan');

  });


});
