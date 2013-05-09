
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form SVG', function() {


  var el, fx = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fx.record);

    el = {
      link:     NL.vw.RECORD.$('a[href="#svg-modal"]'),
      svg:      NL.vw.RECORD.$('textarea[name="svg"]'),
      density:  NL.vw.RECORD.$('input[name="density"]'),
      cancel:   NL.vw.RECORD.$('a[name="cancel"]'),
      parse:    NL.vw.RECORD.$('a[name="parse"]'),
      modal:    NL.vw.RECORD.$('#svg-modal')
    };

  });


  it('should show modal when "Enter Markup" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Enter Markup" link is clicked, the SVG input modal should
    // be displayed.
    // --------------------------------------------------------------------

    // Click "Enter Markup".
    el.link.trigger('click');

    // Modal and overlay should be visible.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(el.modal).toHaveClass('in');

  });


  it('should close modal when "Cancel" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Cancel" button is clicked, the modal should disappear and
    // the form should return to its normal state.
    // --------------------------------------------------------------------

    // Click "Enter Markup".
    el.link.trigger('click');

    // Click "Cancel".
    el.cancel.trigger('click');

    // Modal should be closed.
    expect(el.modal).not.toHaveClass('in');

  });


  it('should set SVG geometry when "Parse" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Parse SVG" button is clicked, the markup in the textarea
    // should be parsed and the map handler geometry should be updated.
    // --------------------------------------------------------------------

    var formatWKT = new OpenLayers.Format.WKT();
    var svg = '<svg><polygon points="1,2 3,4 5,6" /></svg>';
    var geo = OpenLayers.Geometry.fromWKT(SVGtoWKT.convert(svg));

    // Update SVG.
    el.svg.val(svg);
    el.parse.trigger('click');

    // `geometry` on handler should be set.
    expect(NL.vw.MAP.controls.svg.handler.geometry.equals(geo)).
      toBeTruthy();

  });


  it('should react to different density values', function() {

    // --------------------------------------------------------------------
    // The value of the "Density" input should be applied as the `DENSITY`
    // ratio in the SVG-to-WKT conversion.
    // --------------------------------------------------------------------

    // Set SVG.
    el.svg.val('<svg><circle r="10" cx="0" cy="0" /></svg>');

    // Set low density.
    el.density.val('1.0');
    el.parse.trigger('click');

    // Capture the number of points in the geometry.
    var c1 = NL.vw.MAP.controls.svg.handler.geometry.getVertices().length;

    // Set high density.
    el.density.val('2.0');
    el.parse.trigger('click');

    // Capture the number of points in the geometry.
    var c2 = NL.vw.MAP.controls.svg.handler.geometry.getVertices().length;

    // Should be more points.
    expect(c2).toBeGreaterThan(c1);

  });


  it('should flash notification when the parse succeeds', function() {

    // --------------------------------------------------------------------
    // When new SVG is successfully parsed, a success notification should
    // be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Parse valid SVG.
    el.svg.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    el.parse.trigger('click');

    // Should flash success.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.svg.parse.success
    );

  });


  it('should close the modal when the parse succeeds', function() {

    // --------------------------------------------------------------------
    // When new SVG is successfully parsed, the modal should be closed.
    // --------------------------------------------------------------------

    // Parse valid SVG.
    el.svg.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    el.parse.trigger('click');

    // Modal should be hidden.
    expect(el.modal).not.toHaveClass('in');

  });


  it('should flash notification when the parse fails', function() {

    // --------------------------------------------------------------------
    // When new SVG is not parsed successfully, a failure notification
    // should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Parse invalid SVG.
    el.svg.val('invalid');
    el.parse.trigger('click');

    // Should flash error.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.svg.parse.error
    );

  });


  it('should not close the modal when the parse fails', function() {

    // --------------------------------------------------------------------
    // When new SVG is not parsed successfully, the modal stay open.
    // --------------------------------------------------------------------

    // Click "Enter Markup".
    el.link.trigger('click');

    // Parse invalid SVG.
    el.svg.val('invalid');
    el.parse.trigger('click');

    // Modal should be hidden.
    expect(el.modal).toHaveClass('in');

  });


});
