
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Typecast Numbers', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should cast numeric fields to Numbers', function() {

    // ----------------------------------------------------------------------
    // All numeric fields should be cast to Numbers on `get`.
    // ----------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({
      item_id:                '1',
      fill_opacity:           '2',
      fill_opacity_select:    '3',
      stroke_opacity:         '4',
      stroke_opacity_select:  '5',
      point_radius:           '6',
      stroke_width:           '7',
      zindex:                 '8',
      weight:                 '9',
      min_zoom:               '10',
      max_zoom:               '11',
      map_zoom:               '12'
    });

    expect(record.get('item_id')).                toEqual(1);
    expect(record.get('fill_opacity')).           toEqual(2);
    expect(record.get('fill_opacity_select')).    toEqual(3);
    expect(record.get('stroke_opacity')).         toEqual(4);
    expect(record.get('stroke_opacity_select')).  toEqual(5);
    expect(record.get('point_radius')).           toEqual(6);
    expect(record.get('stroke_width')).           toEqual(7);
    expect(record.get('zindex')).                 toEqual(8);
    expect(record.get('weight')).                 toEqual(9);
    expect(record.get('min_zoom')).               toEqual(10);
    expect(record.get('max_zoom')).               toEqual(11);
    expect(record.get('map_zoom')).               toEqual(12);

  });


});
