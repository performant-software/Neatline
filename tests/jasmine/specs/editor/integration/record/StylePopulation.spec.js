
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Style Population', function() {


  var el, fx = {
    record: read('EditorRecord.record.json')
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
