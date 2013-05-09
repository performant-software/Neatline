
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Style Tab', function() {


  var el, def, tmp, sel, fx = {
    record: read('EditorRecord.record.json')
  };


  var getStyles = function() {
    def = NL.vw.MAP.editLayer.styleMap.styles['default'].defaultStyle;
    tmp = NL.vw.MAP.editLayer.styleMap.styles.temporary.defaultStyle;
    sel = NL.vw.MAP.editLayer.styleMap.styles.select.defaultStyle;
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fx.record);

    el = _.extend(NL.getRecordFormElements(), {
      setMinZoom: NL.vw.RECORD.$('a[name="set-min-zoom"]'),
      setMaxZoom: NL.vw.RECORD.$('a[name="set-max-zoom"]'),
      setFocus:   NL.vw.RECORD.$('a[name="set-focus"]')
    });

  });


  describe('style previewing', function() {

    // --------------------------------------------------------------------
    // When the record form model changes - either by a direct update to
    // the model or by a change/keyup event on the form inputs - the style
    // map on the edit layer should be rebuilt.
    // --------------------------------------------------------------------

    describe('Presenter', function() {

      it('input `change`', function() {
        el.presenter.val('None').trigger('change');
        var presenter = NL.vw.MAP.editLayer.nModel.get('presenter');
        expect(presenter).toEqual('None');
      });

    });

    describe('Fill Color', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('fill_color', '#ffffff');
      });

      it('input `change`', function() {
        el.fillColor.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.fillColor.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.fillColor).toEqual('#ffffff');
      });

    });

    describe('Fill Color (Selected)', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('fill_color_select', '#ffffff');
      });

      it('input `change`', function() {
        el.fillColorSelect.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.fillColorSelect.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(tmp.fillColor).toEqual('#ffffff');
        expect(sel.fillColor).toEqual('#ffffff');
      });

    });

    describe('Stroke Color', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('stroke_color', '#ffffff');
      });

      it('input `change`', function() {
        el.strokeColor.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeColor.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.strokeColor).toEqual('#ffffff');
      });

    });

    describe('Stroke Color (Selected)', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('stroke_color_select', '#ffffff');
      });

      it('input `change`', function() {
        el.strokeColorSelect.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeColorSelect.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(tmp.strokeColor).toEqual('#ffffff');
        expect(sel.strokeColor).toEqual('#ffffff');
      });

    });

    describe('Fill Opacity', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('fill_opacity', 0.5);
      });

      it('input `change`', function() {
        el.fillOpacity.val(0.5).trigger('change');
      });

      it('input `keyup`', function() {
        el.fillOpacity.val(0.5).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.fillOpacity).toEqual(0.5);
        expect(def.graphicOpacity).toEqual(0.5);
      });

    });

    describe('Fill Opacity (Selected)', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('fill_opacity_select', 0.5);
      });

      it('input `change`', function() {
        el.fillOpacitySelect.val('0.5').trigger('change');
      });

      it('input `keyup`', function() {
        el.fillOpacitySelect.val('0.5').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(tmp.fillOpacity).toEqual(0.5);
        expect(sel.fillOpacity).toEqual(0.5);
        expect(tmp.graphicOpacity).toEqual(0.5);
        expect(sel.graphicOpacity).toEqual(0.5);
      });

    });

    describe('Stroke Opacity', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('stroke_opacity', 0.5);
      });

      it('input `change`', function() {
        el.strokeOpacity.val(0.5).trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeOpacity.val(0.5).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.strokeOpacity).toEqual(0.5);
      });

    });

    describe('Stroke Opacity (Selected)', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('stroke_opacity_select', 0.5);
      });

      it('input `change`', function() {
        el.strokeOpacitySelect.val('0.5').trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeOpacitySelect.val('0.5').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(tmp.strokeOpacity).toEqual(0.5);
        expect(sel.strokeOpacity).toEqual(0.5);
      });

    });

    describe('Stroke Width', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('stroke_width', 50);
      });

      it('input `change`', function() {
        el.strokeWidth.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeWidth.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.strokeWidth).toEqual(50);
        expect(tmp.strokeWidth).toEqual(50);
        expect(sel.strokeWidth).toEqual(50);
      });

    });

    describe('Point Radius', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('point_radius', 50);
      });

      it('input `change`', function() {
        el.pointRadius.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.pointRadius.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.pointRadius).toEqual(50);
        expect(tmp.pointRadius).toEqual(50);
        expect(sel.pointRadius).toEqual(50);
      });

    });

    describe('point image', function() {

      it('model `set`', function() {
        NL.vw.RECORD.model.set('point_image', 'img.png');
      });

      it('input `change`', function() {
        el.pointImage.val('img.png').trigger('change');
      });

      it('input `keyup`', function() {
        el.pointImage.val('img.png').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(def.externalGraphic).toEqual('img.png');
        expect(tmp.externalGraphic).toEqual('img.png');
        expect(sel.externalGraphic).toEqual('img.png');
      });

    });

  });


  it('should populate min zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current" link for "Min Zoom" is clicked, the input
    // should be populated with the current zoom.
    // --------------------------------------------------------------------

    NL.setMapZoom(10);
    el.setMinZoom.trigger('click');

    // Input should be updated.
    expect(el.minZoom).toHaveValue('10');

    // Model should be updated.
    expect(NL.vw.RECORD.model.get('min_zoom')).toEqual('10');

  });


  it('should populate max zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current" link for "Max Zoom" is clicked, the input
    // should be populated with the current zoom.
    // --------------------------------------------------------------------

    NL.setMapZoom(10);
    el.setMaxZoom.trigger('click');

    // Input should be updated.
    expect(el.maxZoom).toHaveValue('10');

    // Model should be updated.
    expect(NL.vw.RECORD.model.get('max_zoom')).toEqual('10');

  });


  it('should populate default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the
    // default focus and zoom inputs should be populated.
    // --------------------------------------------------------------------

    NL.setMapCenter(1, 2, 3);
    el.setFocus.trigger('click');

    // Inputs should be updated.
    expect(el.mapFocus).toHaveValue('1,2');
    expect(el.mapZoom).toHaveValue('3');

    // Model should be updated.
    expect(NL.vw.RECORD.model.get('map_focus')).toEqual('1,2');
    expect(NL.vw.RECORD.model.get('map_zoom')).toEqual('3');

  });


});
