
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Sync Model', function() {


  var fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {
    NL.loadEditor();
    NL.showRecordForm(fixtures.record);
  });


  it('should sync the edit layer model', function() {

    // ------------------------------------------------------------------------
    // When the record form is updated, the corresponding attributes on the
    // `neatline.model` reference on the map edit layer should be updated.
    // ------------------------------------------------------------------------

    var inputs = NL.getRecordFormElements();
    var widgets = ['Widget2','Widget3'];

    inputs.itemId.              val('1').           trigger('change');
    inputs.slug.                val('2').           trigger('change');
    inputs.titleInput.          val('3').           trigger('change');
    inputs.body.                val('4').           trigger('change');
    inputs.coverage.            val('5').           trigger('change');
    inputs.tags.                val('6').           trigger('change');
    inputs.widgets.             val(widgets).       trigger('change');
    inputs.presenter.           val('Presenter3').  trigger('change');
    inputs.fillColor.           val('#777777').     trigger('change');
    inputs.fillColorSelect.     val('#888888').     trigger('change');
    inputs.strokeColor.         val('#999999').     trigger('change');
    inputs.strokeColorSelect.   val('#999999').     trigger('change');
    inputs.fillOpacity.         val('0.10').        trigger('change');
    inputs.fillOpacitySelect.   val('0.11').        trigger('change');
    inputs.strokeOpacity.       val('0.12').        trigger('change');
    inputs.strokeOpacitySelect. val('0.13').        trigger('change');
    inputs.strokeWidth.         val('14').          trigger('change');
    inputs.pointRadius.         val('15').          trigger('change');
    inputs.zindex.              val('16').          trigger('change');
    inputs.weight.              val('17').          trigger('change');
    inputs.startDate.           val('18').          trigger('change');
    inputs.endDate.             val('19').          trigger('change');
    inputs.afterDate.           val('20').          trigger('change');
    inputs.beforeDate.          val('21').          trigger('change');
    inputs.pointImage.          val('22').          trigger('change');
    inputs.wmsAddress.          val('23').          trigger('change');
    inputs.wmsLayers.           val('24').          trigger('change');
    inputs.minZoom.             val('25').          trigger('change');
    inputs.maxZoom.             val('26').          trigger('change');
    inputs.mapFocus.            val('27').          trigger('change');
    inputs.mapZoom.             val('28').          trigger('change');

    var model = NL.v.map.editLayer.neatline.model;

    expect(model.get('item_id')).               toEqual(1);
    expect(model.get('slug')).                  toEqual('2');
    expect(model.get('title')).                 toEqual('3');
    expect(model.get('body')).                  toEqual('4');
    expect(model.get('coverage')).              toEqual('5');
    expect(model.get('tags')).                  toEqual('6');
    expect(model.get('widgets')).               toEqual('Widget2,Widget3');
    expect(model.get('presenter')).             toEqual('Presenter3');
    expect(model.get('fill_color')).            toEqual('#777777');
    expect(model.get('fill_color_select')).     toEqual('#888888');
    expect(model.get('stroke_color')).          toEqual('#999999');
    expect(model.get('stroke_color_select')).   toEqual('#999999');
    expect(model.get('fill_opacity')).          toEqual(0.10);
    expect(model.get('fill_opacity_select')).   toEqual(0.11);
    expect(model.get('stroke_opacity')).        toEqual(0.12);
    expect(model.get('stroke_opacity_select')). toEqual(0.13);
    expect(model.get('stroke_width')).          toEqual(14);
    expect(model.get('point_radius')).          toEqual(15);
    expect(model.get('zindex')).                toEqual(16);
    expect(model.get('weight')).                toEqual(17);
    expect(model.get('start_date')).            toEqual('18');
    expect(model.get('end_date')).              toEqual('19');
    expect(model.get('after_date')).            toEqual('20');
    expect(model.get('before_date')).           toEqual('21');
    expect(model.get('point_image')).           toEqual('22');
    expect(model.get('wms_address')).           toEqual('23');
    expect(model.get('wms_layers')).            toEqual('24');
    expect(model.get('min_zoom')).              toEqual(25);
    expect(model.get('max_zoom')).              toEqual(26);
    expect(model.get('map_focus')).             toEqual('27');
    expect(model.get('map_zoom')).              toEqual(28);

  });


});
