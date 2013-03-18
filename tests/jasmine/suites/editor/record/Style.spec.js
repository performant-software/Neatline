
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


  var el, standard, temporary, select;


  var getStyles = function() {
    var styles  = _t.vw.MAP.editLayer.styleMap.styles;
    standard    = styles['default'].defaultStyle;
    temporary   = styles.temporary.defaultStyle;
    select      = styles.select.defaultStyle;
  };


  beforeEach(function() {

    _t.loadEditor();
    _t.showFirstRecordForm();

    el = {
      presenter:      _t.vw.RECORD.$('select[name="presenter"]'),
      fillColor:      _t.vw.RECORD.$('input[name="fill-color"]'),
      selectColor:    _t.vw.RECORD.$('input[name="select-color"]'),
      strokeColor:    _t.vw.RECORD.$('input[name="stroke-color"]'),
      fillOpacity:    _t.vw.RECORD.$('input[name="fill-opacity"]'),
      strokeOpacity:  _t.vw.RECORD.$('input[name="stroke-opacity"]'),
      selectOpacity:  _t.vw.RECORD.$('input[name="select-opacity"]'),
      strokeWidth:    _t.vw.RECORD.$('input[name="stroke-width"]'),
      pointRadius:    _t.vw.RECORD.$('input[name="point-radius"]'),
      pointImage:     _t.vw.RECORD.$('input[name="point-image"]'),
      minZoom:        _t.vw.RECORD.$('input[name="min-zoom"]'),
      maxZoom:        _t.vw.RECORD.$('input[name="max-zoom"]'),
      mapFocus:       _t.vw.RECORD.$('input[name="map-focus"]'),
      mapZoom:        _t.vw.RECORD.$('input[name="map-zoom"]'),
      setMinZoom:     _t.vw.RECORD.$('a[name="set-min-zoom"]'),
      setMaxZoom:     _t.vw.RECORD.$('a[name="set-max-zoom"]'),
      setFocus:       _t.vw.RECORD.$('a[name="set-focus"]')
    };

    model = _t.vw.MAP.editLayer.nModel;

  });


  describe('presenter', function() {

    it('should update on `change`', function() {
      el.presenter.val('None').trigger('change');
      expect(_t.vw.MAP.editLayer.nModel.get('presenter')).toEqual('None');
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
      expect(standard.fillColor).toEqual('#ffffff');
    });

  });


  describe('line color', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('stroke_color', '#ffffff');
    });

    it('should update on `change`', function() {
      el.strokeColor.val('#ffffff').trigger('change');
    });

    it('should update on `keyup`', function() {
      el.strokeColor.val('#ffffff').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(standard.strokeColor).toEqual('#ffffff');
    });

  });


  describe('selected color', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('select_color', '#ffffff');
    });

    it('should update on `change`', function() {
      el.selectColor.val('#ffffff').trigger('change');
    });

    it('should update on `keyup`', function() {
      el.selectColor.val('#ffffff').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(temporary.fillColor).toEqual('#ffffff');
      expect(select.fillColor).toEqual('#ffffff');
    });

  });


  describe('shape opacity', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('fill_opacity', 50);
    });

    it('should update on `change`', function() {
      el.fillOpacity.val(50).trigger('change');
    });

    it('should update on `keyup`', function() {
      el.fillOpacity.val(50).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(standard.fillOpacity).toEqual(0.5);
      expect(standard.graphicOpacity).toEqual(0.5);
    });

  });


  describe('line opacity', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('stroke_opacity', 50);
    });

    it('should update on `change`', function() {
      el.strokeOpacity.val(50).trigger('change');
    });

    it('should update on `keyup`', function() {
      el.strokeOpacity.val(50).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(standard.strokeOpacity).toEqual(0.5);
      expect(temporary.strokeOpacity).toEqual(0.5);
      expect(select.strokeOpacity).toEqual(0.5);
    });

  });


  describe('selected opacity', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('select_opacity', 50);
    });

    it('should update on `change`', function() {
      el.selectOpacity.val(50).trigger('change');
    });

    it('should update on `keyup`', function() {
      el.selectOpacity.val(50).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(temporary.fillOpacity).toEqual(0.5);
      expect(select.fillOpacity).toEqual(0.5);
    });

  });


  describe('line width', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('stroke_width', 50);
    });

    it('should update on `change`', function() {
      el.strokeWidth.val(50).trigger('change');
    });

    it('should update on `keyup`', function() {
      el.strokeWidth.val(50).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(standard.strokeWidth).toEqual(50);
      expect(temporary.strokeWidth).toEqual(50);
      expect(select.strokeWidth).toEqual(50);
    });

  });


  describe('point radius', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('point_radius', 50);
    });

    it('should update on `change`', function() {
      el.pointRadius.val(50).trigger('change');
    });

    it('should update on `keyup`', function() {
      el.pointRadius.val(50).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(standard.pointRadius).toEqual(50);
      expect(temporary.pointRadius).toEqual(50);
      expect(select.pointRadius).toEqual(50);
    });

  });


  describe('point image', function() {

    it('model `set`', function() {
      _t.vw.RECORD.model.set('point_image', 'img.png');
    });

    it('should update on `change`', function() {
      el.pointImage.val('img.png').trigger('change');
    });

    it('should update on `keyup`', function() {
      el.pointImage.val('img.png').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(standard.externalGraphic).toEqual('img.png');
      expect(temporary.externalGraphic).toEqual('img.png');
      expect(select.externalGraphic).toEqual('img.png');
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
