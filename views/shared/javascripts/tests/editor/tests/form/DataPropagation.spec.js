
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form data propagation after save.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Data I/O', function() {

  var recordRows, mapLayers, feature;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Get rows.
    recordRows = _t.getRecordRows();

    // Get layers.
    mapLayers = _t.getVectorLayers();
    feature = mapLayers[0].features[0];

  });

  afterEach(function() {

    // Enter new values into the form.
    _t.textTabView.title.           val('Title 2');
    _t.textTabView.body.            val('Body 2.');
    _t.styleTabView.vectorColor.    val('#222222');
    _t.styleTabView.strokeColor.    val('#555555');
    _t.styleTabView.selectColor.    val('#888888');
    _t.styleTabView.vectorOpacity.  val('2');
    _t.styleTabView.selectOpacity.  val('5');
    _t.styleTabView.strokeOpacity.  val('8');
    _t.styleTabView.imageOpacity.   val('11');
    _t.styleTabView.strokeWidth.    val('14');
    _t.styleTabView.pointRadius.    val('17');
    _t.styleTabView.minZoom.        val('20');
    _t.styleTabView.maxZoom.        val('23');
    _t.styleTabView.pointGraphic.   val('file2.png');
    _t.spatialTabView.coverage.     val('POINT(3 4)');

    // Click "Save" button.
    _t.formView.saveButton.trigger('click');

    // Check for updated data in map collection.
    var record = _t.mapColl.get(mapLayers[0].nId);
    expect(record.get('title')).toEqual('Title 2');
    expect(record.get('description')).toEqual('Body 2.');
    expect(record.get('vector_color')).toEqual('#222222');
    expect(record.get('stroke_color')).toEqual('#555555');
    expect(record.get('select_color')).toEqual('#888888');
    expect(record.get('vector_opacity')).toEqual(2);
    expect(record.get('select_opacity')).toEqual(5);
    expect(record.get('stroke_opacity')).toEqual(8);
    expect(record.get('graphic_opacity')).toEqual(11);
    expect(record.get('stroke_width')).toEqual(14);
    expect(record.get('point_radius')).toEqual(17);
    expect(record.get('min_zoom')).toEqual(20);
    expect(record.get('max_zoom')).toEqual(23);
    expect(record.get('point_image')).toEqual('file2.png');
    expect(record.get('coverage')).toEqual('POINT(3 4)');

    // Check for updated data in records collection.
    record = _t.recordsColl.get(mapLayers[0].nId);
    expect(record.get('title')).toEqual('Title 2');
    expect(record.get('description')).toEqual('Body 2.');
    expect(record.get('vector_color')).toEqual('#222222');
    expect(record.get('stroke_color')).toEqual('#555555');
    expect(record.get('select_color')).toEqual('#888888');
    expect(record.get('vector_opacity')).toEqual(2);
    expect(record.get('select_opacity')).toEqual(5);
    expect(record.get('stroke_opacity')).toEqual(8);
    expect(record.get('graphic_opacity')).toEqual(11);
    expect(record.get('stroke_width')).toEqual(14);
    expect(record.get('point_radius')).toEqual(17);
    expect(record.get('min_zoom')).toEqual(20);
    expect(record.get('max_zoom')).toEqual(23);
    expect(record.get('point_image')).toEqual('file2.png');
    expect(record.get('coverage')).toEqual('POINT(3 4)');

  });

  it('should update collections when form opened via map', function() {

    // --------------------------------------------------------------------
    // When the edit form for a record is opened by a click on a geoemtry
    // on the map, saved updates to the form should be propagated to the
    // corresponding model in the editor and map records collections.
    // --------------------------------------------------------------------

    // Click on map feature.
    _t.clickOnMapFeature(mapLayers[0], feature);

  });

  it('should update collections when form opened via editor', function() {

    // --------------------------------------------------------------------
    // When the edit form for a record is opened by a click on a record
    // row listing in the editor, saved updates to the form should be
    // propagated to the corresponding model in the editor and map records
    // collections.
    // --------------------------------------------------------------------

    // Click on record row.
    $(recordRows[0]).trigger('click');

  });

});
