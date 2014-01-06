
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Preview Styles', function() {


  // --------------------------------------------------------------------------
  // When the form model changes - either by a direct update to the model or
  // by a change or event on the form inputs - the style map on the edit layer
  // should be rebuilt with the updated value.
  // --------------------------------------------------------------------------


  var inputs, def, tmp, sel, fixtures = {
    record: read('EditorRecord.record.json')
  };


  var getStyles = function() {
    def = NL.v.map.editLayer.styleMap.styles['default'].defaultStyle;
    tmp = NL.v.map.editLayer.styleMap.styles.temporary.defaultStyle;
    sel = NL.v.map.editLayer.styleMap.styles.select.defaultStyle;
  };


  beforeEach(function() {
    NL.loadEditor();
    NL.showRecordForm(fixtures.record);
    inputs = NL.getRecordFormElements();
  });


  describe('Presenter', function() {

    it('input `change`', function() {
      inputs.presenter.val('None').trigger('change');
      var presenter = NL.v.map.editLayer.neatline.model.get('presenter');
      expect(presenter).toEqual('None');
    });

  });


  describe('Fill Color', function() {

    it('model `set`', function() {
      NL.v.record.model.set('fill_color', '#ffffff');
    });

    it('input `change`', function() {
      inputs.fillColor.val('#ffffff').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.fillColor.val('#ffffff').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(def.fillColor).toEqual('#ffffff');
    });

  });


  describe('Fill Color (Selected)', function() {

    it('model `set`', function() {
      NL.v.record.model.set('fill_color_select', '#ffffff');
    });

    it('input `change`', function() {
      inputs.fillColorSelect.val('#ffffff').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.fillColorSelect.val('#ffffff').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(tmp.fillColor).toEqual('#ffffff');
      expect(sel.fillColor).toEqual('#ffffff');
    });

  });


  describe('Stroke Color', function() {

    it('model `set`', function() {
      NL.v.record.model.set('stroke_color', '#ffffff');
    });

    it('input `change`', function() {
      inputs.strokeColor.val('#ffffff').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.strokeColor.val('#ffffff').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(def.strokeColor).toEqual('#ffffff');
    });

  });


  describe('Stroke Color (Selected)', function() {

    it('model `set`', function() {
      NL.v.record.model.set('stroke_color_select', '#ffffff');
    });

    it('input `change`', function() {
      inputs.strokeColorSelect.val('#ffffff').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.strokeColorSelect.val('#ffffff').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(tmp.strokeColor).toEqual('#ffffff');
      expect(sel.strokeColor).toEqual('#ffffff');
    });

  });


  describe('Fill Opacity', function() {

    it('model `set`', function() {
      NL.v.record.model.set('fill_opacity', 0.5);
    });

    it('input `change`', function() {
      inputs.fillOpacity.val(0.5).trigger('change');
    });

    it('input `keyup`', function() {
      inputs.fillOpacity.val(0.5).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(def.fillOpacity).toEqual(0.5);
      expect(def.graphicOpacity).toEqual(0.5);
    });

  });


  describe('Fill Opacity (Selected)', function() {

    it('model `set`', function() {
      NL.v.record.model.set('fill_opacity_select', 0.5);
    });

    it('input `change`', function() {
      inputs.fillOpacitySelect.val('0.5').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.fillOpacitySelect.val('0.5').trigger('keyup');
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
      NL.v.record.model.set('stroke_opacity', 0.5);
    });

    it('input `change`', function() {
      inputs.strokeOpacity.val(0.5).trigger('change');
    });

    it('input `keyup`', function() {
      inputs.strokeOpacity.val(0.5).trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(def.strokeOpacity).toEqual(0.5);
    });

  });


  describe('Stroke Opacity (Selected)', function() {

    it('model `set`', function() {
      NL.v.record.model.set('stroke_opacity_select', 0.5);
    });

    it('input `change`', function() {
      inputs.strokeOpacitySelect.val('0.5').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.strokeOpacitySelect.val('0.5').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(tmp.strokeOpacity).toEqual(0.5);
      expect(sel.strokeOpacity).toEqual(0.5);
    });

  });


  describe('Stroke Width', function() {

    it('model `set`', function() {
      NL.v.record.model.set('stroke_width', 50);
    });

    it('input `change`', function() {
      inputs.strokeWidth.val(50).trigger('change');
    });

    it('input `keyup`', function() {
      inputs.strokeWidth.val(50).trigger('keyup');
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
      NL.v.record.model.set('point_radius', 50);
    });

    it('input `change`', function() {
      inputs.pointRadius.val(50).trigger('change');
    });

    it('input `keyup`', function() {
      inputs.pointRadius.val(50).trigger('keyup');
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
      NL.v.record.model.set('point_image', 'img.png');
    });

    it('input `change`', function() {
      inputs.pointImage.val('img.png').trigger('change');
    });

    it('input `keyup`', function() {
      inputs.pointImage.val('img.png').trigger('keyup');
    });

    afterEach(function() {
      getStyles();
      expect(def.externalGraphic).toEqual('img.png');
      expect(tmp.externalGraphic).toEqual('img.png');
      expect(sel.externalGraphic).toEqual('img.png');
    });

  });


});
