
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form data propagation after save.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Data Propagation', function() {

  var recordRows, mapLayers, layer, feature;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Get rows.
    recordRows = _t.getRecordRows();

    // Get layers and feature.
    mapLayers = _t.getVectorLayers();
    layer = mapLayers[0];
    feature = layer.features[0];

  });

  it('should update models when form opened via map', function() {

    // ------------------------------------------------------------------
    // When the edit form is opened by clicking on a map feature and
    // changes are made to the form, the updates to the model should be
    // saved into the collection housed by the `Records` module and the
    // updated values should be immediately manifested in the editor. For
    // example, if the title and description of the record are changed in
    // the form, then after the form is saved and closed the new values
    // should be manifested in the listing for the record.
    // ------------------------------------------------------------------

    // Click on map feature.
    _t.clickOnMapFeature(layer, feature);

    // Enter new values into the form.
    _t.textTabView.title.           val('Title Updated');
    _t.textTabView.body.            val('Body updated.');
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
    _t.respondLast200('');

    // Check for updated data in records collection.
    record = _t.recordsColl.get(mapLayers[0].nId);
    expect(record.get('title')).            toEqual('Title Updated');
    expect(record.get('description')).      toEqual('Body updated.');
    expect(record.get('vector_color')).     toEqual('#222222');
    expect(record.get('stroke_color')).     toEqual('#555555');
    expect(record.get('select_color')).     toEqual('#888888');
    expect(record.get('vector_opacity')).   toEqual(2);
    expect(record.get('select_opacity')).   toEqual(5);
    expect(record.get('stroke_opacity')).   toEqual(8);
    expect(record.get('graphic_opacity')).  toEqual(11);
    expect(record.get('stroke_width')).     toEqual(14);
    expect(record.get('point_radius')).     toEqual(17);
    expect(record.get('min_zoom')).         toEqual(20);
    expect(record.get('max_zoom')).         toEqual(23);
    expect(record.get('point_image')).      toEqual('file2.png');
    expect(record.get('coverage')).         toEqual('POINT(3 4)');

    // Close the form.
    _t.formView.closeButton.trigger('click');

    // Get rows, check for values.
    recordRows = _t.getRecordRows();
    expect($(recordRows[0]).find('.record-title').text()).
      toEqual('Title Updated');
    expect($(recordRows[0]).find('.record-body').text()).
      toEqual('Body updated.');

  });

  it('should update models when form opened via editor', function() {

    // ------------------------------------------------------------------
    // When the edit form is opened by clicking on a record listing in the
    // editor and changes are made to the form, the updates to the model
    // should be saved into the collection housed by the `Map` module and
    // the updated values should be immediately manifested on the map. For
    // example, if the title and description of the record are changed in
    // the form, then after the form is saved and closed the new values
    // should be manifested in the map bubble for the record.
    // ------------------------------------------------------------------

    // Click on record row.
    $(recordRows[0]).trigger('click');

    // Enter new values into the form.
    _t.textTabView.title.           val('Title Updated');
    _t.textTabView.body.            val('Body updated.');
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
    _t.respondLast200('');

    // Check for updated data in map collection.
    var record = _t.mapColl.get(mapLayers[0].nId);
    expect(record.get('title')).            toEqual('Title Updated');
    expect(record.get('description')).      toEqual('Body updated.');
    expect(record.get('vector_color')).     toEqual('#222222');
    expect(record.get('stroke_color')).     toEqual('#555555');
    expect(record.get('select_color')).     toEqual('#888888');
    expect(record.get('vector_opacity')).   toEqual(2);
    expect(record.get('select_opacity')).   toEqual(5);
    expect(record.get('stroke_opacity')).   toEqual(8);
    expect(record.get('graphic_opacity')).  toEqual(11);
    expect(record.get('stroke_width')).     toEqual(14);
    expect(record.get('point_radius')).     toEqual(17);
    expect(record.get('min_zoom')).         toEqual(20);
    expect(record.get('max_zoom')).         toEqual(23);
    expect(record.get('point_image')).      toEqual('file2.png');
    expect(record.get('coverage')).         toEqual('POINT(3 4)');

    // Open the bubble for the record.
    _t.hoverOnMapFeature(layer, feature);

    // Check for updated title and description.
    expect(_t.bubbleView.title.text()).toEqual('Title Updated');
    expect(_t.bubbleView.description.text()).toEqual('Body updated.');

  });

  it('should update the form header with a new title', function() {

    // --------------------------------------------------------------------
    // When the edit form is saved with a new title value, the header of
    // the form should be immediately updated to the new value.
    // --------------------------------------------------------------------

    // Click on record row.
    $(recordRows[0]).trigger('click');

    // Change title, save.
    _t.textTabView.title.val('Title Updated');
    _t.formView.saveButton.trigger('click');
    _t.respondLast200('');

    // Check for updated header.
    expect(_t.formView.lead.text()).toEqual('Title Updated');

  });

});
