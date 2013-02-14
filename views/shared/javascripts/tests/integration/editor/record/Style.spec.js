
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


  var els, standard, temporary, select;


  var getStyles = function() {
    var styles  = _t.vw.map.editLayer.styleMap.styles;
    standard    = styles.default.defaultStyle;
    temporary   = styles.temporary.defaultStyle;
    select      = styles.select.defaultStyle;
  }


  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    els = {
      presenter:      _t.vw.record.$('select[name="presenter"]'),
      vectorColor:    _t.vw.record.$('input[name="vector-color"]'),
      strokeColor:    _t.vw.record.$('input[name="stroke-color"]'),
      selectColor:    _t.vw.record.$('input[name="select-color"]'),
      vectorOpacity:  _t.vw.record.$('input[name="vector-opacity"]'),
      strokeOpacity:  _t.vw.record.$('input[name="stroke-opacity"]'),
      selectOpacity:  _t.vw.record.$('input[name="select-opacity"]'),
      imageOpacity:   _t.vw.record.$('input[name="image-opacity"]'),
      strokeWidth:    _t.vw.record.$('input[name="stroke-width"]'),
      pointRadius:    _t.vw.record.$('input[name="point-radius"]'),
      pointImage:     _t.vw.record.$('input[name="point-image"]'),
      minZoom:        _t.vw.record.$('input[name="min-zoom"]'),
      maxZoom:        _t.vw.record.$('input[name="max-zoom"]'),
      mapFocus:       _t.vw.record.$('input[name="map-focus"]'),
      mapZoom:        _t.vw.record.$('input[name="map-zoom"]'),
      setMinZoom:     _t.vw.record.$('a[name="set-min-zoom"]'),
      setMaxZoom:     _t.vw.record.$('a[name="set-max-zoom"]'),
      setFocus:       _t.vw.record.$('a[name="set-focus"]')
    };

    model = _t.vw.map.editLayer.nModel;

  });


  describe('presenter', function() {

    it('should update on `change`', function() {
      els.presenter.val('None').trigger('change');
      expect(_t.vw.map.editLayer.nModel.get('presenter')).toEqual('None');
    });

  });


  describe('shape color', function() {

    it('should update on `change`', function() {
      els.vectorColor.val('#ffffff').trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.vectorColor.val('#ffffff').trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.fillColor).toEqual('#ffffff');
    });

  });


  describe('line color', function() {

    it('should update on `change`', function() {
      els.strokeColor.val('#ffffff').trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.strokeColor.val('#ffffff').trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.strokeColor).toEqual('#ffffff');
    });

  });


  describe('selected color', function() {

    it('should update on `change`', function() {
      els.selectColor.val('#ffffff').trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.selectColor.val('#ffffff').trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(temporary.fillColor).toEqual('#ffffff');
      expect(select.fillColor).toEqual('#ffffff');
    });

  });


  describe('shape opacity', function() {

    it('should update on `change`', function() {
      els.vectorOpacity.val(50).trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.vectorOpacity.val(50).trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.fillOpacity).toEqual(0.5);
    });

  });


  describe('line opacity', function() {

    it('should update on `change`', function() {
      els.strokeOpacity.val(50).trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.strokeOpacity.val(50).trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.strokeOpacity).toEqual(0.5);
      expect(temporary.strokeOpacity).toEqual(0.5);
      expect(select.strokeOpacity).toEqual(0.5);
    });

  });


  describe('selected opacity', function() {

    it('should update on `change`', function() {
      els.selectOpacity.val(50).trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.selectOpacity.val(50).trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(temporary.fillOpacity).toEqual(0.5);
      expect(select.fillOpacity).toEqual(0.5);
    });

  });


  describe('image opacity', function() {

    it('should update on `change`', function() {
      els.imageOpacity.val(50).trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.imageOpacity.val(50).trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.graphicOpacity).toEqual(0.5);
      expect(temporary.graphicOpacity).toEqual(0.5);
      expect(select.graphicOpacity).toEqual(0.5);
    });

  });


  describe('line width', function() {

    it('should update on `change`', function() {
      els.strokeWidth.val(50).trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.strokeWidth.val(50).trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.strokeWidth).toEqual(50);
      expect(temporary.strokeWidth).toEqual(50);
      expect(select.strokeWidth).toEqual(50);
    });

  });


  describe('point radius', function() {

    it('should update on `change`', function() {
      els.pointRadius.val(50).trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.pointRadius.val(50).trigger('keyup');
      getStyles();
    });

    afterEach(function() {
      expect(standard.pointRadius).toEqual(50);
      expect(temporary.pointRadius).toEqual(50);
      expect(select.pointRadius).toEqual(50);
    });

  });


  describe('point radius', function() {

    it('should update on `change`', function() {
      els.pointImage.val('img.png').trigger('change');
      getStyles();
    });

    it('should update on `keyup`', function() {
      els.pointImage.val('img.png').trigger('keyup');
      getStyles();
    });

    afterEach(function() {
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

    _t.setMapZoom(1);
    els.setMinZoom.trigger('click');

    // Input should be updated.
    expect(els.minZoom).toHaveValue('1');

    // Model should be updated.
    expect(_t.vw.record.model.get('min_zoom')).toEqual('1');

  });


  it('should populate max zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current" link for "Max Zoom" is clicked, the input
    // should be populated with the current zoom.
    // --------------------------------------------------------------------

    _t.setMapZoom(1);
    els.setMaxZoom.trigger('click');

    // Input should be updated.
    expect(els.maxZoom).toHaveValue('1');

    // Model should be updated.
    expect(_t.vw.record.model.get('max_zoom')).toEqual('1');

  });


  it('should populate default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the
    // "Focus Coordinates" and "Focus Zoom" inputs should be populated.
    // --------------------------------------------------------------------

    _t.setMapCenter(1, 2, 3);
    els.setFocus.trigger('click');

    // Inputs should be updated.
    expect(els.mapFocus).toHaveValue('1,2');
    expect(els.mapZoom).toHaveValue(3);

    // Model should be updated.
    expect(_t.vw.record.model.get('map_focus')).toEqual('1,2');
    expect(_t.vw.record.model.get('map_zoom')).toEqual('3');

  });


});
