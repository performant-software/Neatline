
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Schema', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should cast numeric fields to Numbers', function() {

    // ----------------------------------------------------------------------
    // All numeric fields should be cast to Numbers on `get`.
    // ----------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({
      fill_opacity:           '1',
      fill_opacity_select:    '2',
      stroke_opacity:         '3',
      stroke_opacity_select:  '4',
      point_radius:           '5',
      stroke_width:           '6',
      zindex:                 '7',
      weight:                 '8',
      min_zoom:               '9',
      max_zoom:               '10',
      map_zoom:               '11'
    });

    expect(record.get('fill_opacity')).           toEqual(1);
    expect(record.get('fill_opacity_select')).    toEqual(2);
    expect(record.get('stroke_opacity')).         toEqual(3);
    expect(record.get('stroke_opacity_select')).  toEqual(4);
    expect(record.get('point_radius')).           toEqual(5);
    expect(record.get('stroke_width')).           toEqual(6);
    expect(record.get('zindex')).                 toEqual(7);
    expect(record.get('weight')).                 toEqual(8);
    expect(record.get('min_zoom')).               toEqual(9);
    expect(record.get('max_zoom')).               toEqual(10);
    expect(record.get('map_zoom')).               toEqual(11);

  });


});
