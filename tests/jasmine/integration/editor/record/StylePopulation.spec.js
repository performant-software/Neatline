
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form | Style Population', function() {


  var elements, fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);

    elements = _.extend(NL.getRecordFormElements(), {
      setMinZoom: NL.v.record.$('a[name="set-min-zoom"]'),
      setMaxZoom: NL.v.record.$('a[name="set-max-zoom"]'),
      setFocus:   NL.v.record.$('a[name="set-focus"]')
    });

  });


  it('should populate min zoom', function() {

    // ------------------------------------------------------------------------
    // When the "Use Current" link for "Min Zoom" is clicked, the input should
    // be populated with the current zoom.
    // ------------------------------------------------------------------------

    NL.setMapZoom(10);
    elements.setMinZoom.trigger('click');

    // Input should be updated.
    expect(elements.minZoom).toHaveValue('10');

    // Model should be updated.
    expect(NL.v.record.model.get('min_zoom')).toEqual(10);

  });


  it('should populate max zoom', function() {

    // ------------------------------------------------------------------------
    // When the "Use Current" link for "Max Zoom" is clicked, the input should
    // be populated with the current zoom.
    // ------------------------------------------------------------------------

    NL.setMapZoom(10);
    elements.setMaxZoom.trigger('click');

    // Input should be updated.
    expect(elements.maxZoom).toHaveValue('10');

    // Model should be updated.
    expect(NL.v.record.model.get('max_zoom')).toEqual(10);

  });


  it('should populate default focus and zoom', function() {

    // ------------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the map
    // focus and zoom inputs should be populated.
    // ------------------------------------------------------------------------

    NL.setMapCenter(1, 2, 3);
    elements.setFocus.trigger('click');

    // Inputs should be updated.
    expect(elements.mapFocus).toHaveValue('1,2');
    expect(elements.mapZoom).toHaveValue('3');

    // Model should be updated.
    expect(NL.v.record.model.get('map_focus')).toEqual('1,2');
    expect(NL.v.record.model.get('map_zoom')).toEqual(3);

  });


});
