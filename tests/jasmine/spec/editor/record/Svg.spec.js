
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for SVG drawing in "Spatial" tab on record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form SVG', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();
    _t.openFirstRecordForm();

    els = {
      link:     _t.vw.record.$('a[href="#svg-modal"]'),
      svg:      _t.vw.record.$('textarea[name="svg"]'),
      density:  _t.vw.record.$('input[name="density"]'),
      cancel:   _t.vw.record.$('a[name="cancel"]'),
      parse:    _t.vw.record.$('a[name="parse"]'),
      modal:    _t.vw.record.$('#svg-modal')
    };

  });


  it('should show modal when "Enter Markup" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Enter Markup" link is clicked, the SVG input modal should
    // be displayed.
    // --------------------------------------------------------------------

    // Click on "Enter Markup".
    els.link.trigger('click');

    // Modal and overlay should be visible.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(els.modal).toHaveClass('in');

  });


  it('should close modal when "Cancel" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Cancel" button is clicked, the modal should disappear and
    // the form should return to its normal state.
    // --------------------------------------------------------------------

    // Click on "Enter Markup".
    els.link.trigger('click');

    // Click on "Cancel".
    els.cancel.trigger('click');

    // Modal should be closed.
    expect(els.modal).not.toHaveClass('in');

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
    els.svg.val(svg);
    els.parse.trigger('click');

    // `geometry` on handler should be set.
    expect(_t.vw.MAP.controls.svg.handler.geometry.equals(geo)).
      toBeTruthy();

  });


  it('should react to different density values', function() {

    // --------------------------------------------------------------------
    // The value of the "Density" input should be applied as the `DENSITY`
    // ratio in the SVG-to-WKT conversion.
    // --------------------------------------------------------------------

    // Set SVG.
    els.svg.val('<svg><circle r="10" cx="0" cy="0" /></svg>');

    // Set low density.
    els.density.val('1.0');
    els.parse.trigger('click');

    // Capture the number of points in the geometry.
    var c1 = _t.vw.MAP.controls.svg.handler.geometry.getVertices().length;

    // Set high density.
    els.density.val('2.0');
    els.parse.trigger('click');

    // Capture the number of points in the geometry.
    var c2 = _t.vw.MAP.controls.svg.handler.geometry.getVertices().length;

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
    els.svg.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    els.parse.trigger('click');

    // `toastr` should be called.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.svg.parse.success, null, _t.vw.EDITOR.options.toastr
    );

  });


  it('should close the modal when the parse succeeds', function() {

    // --------------------------------------------------------------------
    // When new SVG is successfully parsed, the modal should be closed.
    // --------------------------------------------------------------------

    // Parse valid SVG.
    els.svg.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    els.parse.trigger('click');

    // Modal should be hidden.
    expect(els.modal).not.toHaveClass('in');

  });


  it('should flash notification when the parse fails', function() {

    // --------------------------------------------------------------------
    // When new SVG is not parsed successfully, a failure notification
    // should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Parse invalid SVG.
    els.svg.val('invalid');
    els.parse.trigger('click');

    // `toastr` should be called.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.svg.parse.error, null, _t.vw.EDITOR.options.toastr
    );

  });


  it('should not close the modal when the parse fails', function() {

    // --------------------------------------------------------------------
    // When new SVG is not parsed successfully, the modal stay open.
    // --------------------------------------------------------------------

    // Click on "Enter Markup".
    els.link.trigger('click');

    // Parse invalid SVG.
    els.svg.val('invalid');
    els.parse.trigger('click');

    // Modal should be hidden.
    expect(els.modal).toHaveClass('in');

  });


});
