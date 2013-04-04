
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form style tab.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Style Tab', function() {


  var el, std, tmp, sel;


  var getStyles = function() {
    std = _t.vw.MAP.editLayer.styleMap.styles['default'].defaultStyle;
    tmp = _t.vw.MAP.editLayer.styleMap.styles.temporary.defaultStyle;
    sel = _t.vw.MAP.editLayer.styleMap.styles.select.defaultStyle;
  };


  beforeEach(function() {

    _t.loadEditor();
    _t.showFirstRecordForm();

    el = _.extend(_t.getRecordFormElements(), {
      setMinZoom: _t.vw.RECORD.$('a[name="set-min-zoom"]'),
      setMaxZoom: _t.vw.RECORD.$('a[name="set-max-zoom"]'),
      setFocus:   _t.vw.RECORD.$('a[name="set-focus"]')
    });

  });


  describe('style previewing', function() {

    // --------------------------------------------------------------------
    // When the record form model changes - either by a direct update to
    // the model or by a change/keyup event on the form inputs - the style
    // map on the edit layer should be rebuilt.
    // --------------------------------------------------------------------

    describe('presenter', function() {

      it('should update on `change`', function() {
        el.presenter.val('None').trigger('change');
        var presenter = _t.vw.MAP.editLayer.nModel.get('presenter');
        expect(presenter).toEqual('None');
      });

    });

    describe('shape color', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('fill_color', '#ffffff');
      });

      it('input `change`', function() {
        el.fillColor.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.fillColor.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.fillColor).toEqual('#ffffff');
      });

    });

    describe('line color', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('stroke_color', '#ffffff');
      });

      it('input `change`', function() {
        el.strokeColor.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeColor.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.strokeColor).toEqual('#ffffff');
      });

    });

    describe('selected color', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('select_color', '#ffffff');
      });

      it('input `change`', function() {
        el.selectColor.val('#ffffff').trigger('change');
      });

      it('input `keyup`', function() {
        el.selectColor.val('#ffffff').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(tmp.fillColor).toEqual('#ffffff');
        expect(sel.fillColor).toEqual('#ffffff');
      });

    });

    describe('shape opacity', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('fill_opacity', 50);
      });

      it('input `change`', function() {
        el.fillOpacity.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.fillOpacity.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.fillOpacity).toEqual(0.5);
        expect(std.graphicOpacity).toEqual(0.5);
      });

    });

    describe('line opacity', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('stroke_opacity', 50);
      });

      it('input `change`', function() {
        el.strokeOpacity.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeOpacity.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.strokeOpacity).toEqual(0.5);
        expect(tmp.strokeOpacity).toEqual(0.5);
        expect(sel.strokeOpacity).toEqual(0.5);
      });

    });

    describe('selected opacity', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('select_opacity', 50);
      });

      it('input `change`', function() {
        el.selectOpacity.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.selectOpacity.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(tmp.fillOpacity).toEqual(0.5);
        expect(sel.fillOpacity).toEqual(0.5);
      });

    });

    describe('line width', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('stroke_width', 50);
      });

      it('input `change`', function() {
        el.strokeWidth.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.strokeWidth.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.strokeWidth).toEqual(50);
        expect(tmp.strokeWidth).toEqual(50);
        expect(sel.strokeWidth).toEqual(50);
      });

    });

    describe('point radius', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('point_radius', 50);
      });

      it('input `change`', function() {
        el.pointRadius.val(50).trigger('change');
      });

      it('input `keyup`', function() {
        el.pointRadius.val(50).trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.pointRadius).toEqual(50);
        expect(tmp.pointRadius).toEqual(50);
        expect(sel.pointRadius).toEqual(50);
      });

    });

    describe('point image', function() {

      it('model `set`', function() {
        _t.vw.RECORD.model.set('point_image', 'img.png');
      });

      it('input `change`', function() {
        el.pointImage.val('img.png').trigger('change');
      });

      it('input `keyup`', function() {
        el.pointImage.val('img.png').trigger('keyup');
      });

      afterEach(function() {
        getStyles();
        expect(std.externalGraphic).toEqual('img.png');
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

    _t.setMapZoom(10);
    el.setMinZoom.trigger('click');

    // Input should be updated.
    expect(el.minZoom).toHaveValue('10');

    // Model should be updated.
    expect(_t.vw.RECORD.model.get('min_zoom')).toEqual('10');

  });


  it('should populate max zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current" link for "Max Zoom" is clicked, the input
    // should be populated with the current zoom.
    // --------------------------------------------------------------------

    _t.setMapZoom(10);
    el.setMaxZoom.trigger('click');

    // Input should be updated.
    expect(el.maxZoom).toHaveValue('10');

    // Model should be updated.
    expect(_t.vw.RECORD.model.get('max_zoom')).toEqual('10');

  });


  it('should populate default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the
    // default focus and zoom inputs should be populated.
    // --------------------------------------------------------------------

    _t.setMapCenter(1, 2, 3);
    el.setFocus.trigger('click');

    // Inputs should be updated.
    expect(el.mapFocus).toHaveValue('1,2');
    expect(el.mapZoom).toHaveValue('3');

    // Model should be updated.
    expect(_t.vw.RECORD.model.get('map_focus')).toEqual('1,2');
    expect(_t.vw.RECORD.model.get('map_zoom')).toEqual('3');

  });


});
