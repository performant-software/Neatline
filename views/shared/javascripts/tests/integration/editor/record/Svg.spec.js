
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
    _t.openRecordForm();

    els = {
      link:   _t.vw.record.$('a[href="#svg-modal"]'),
      input:  _t.vw.record.$('textarea[name="svg"]'),
      cancel: _t.vw.record.$('a[name="cancel"]'),
      parse:  _t.vw.record.$('a[name="parse"]'),
      modal:  _t.vw.record.$('#svg-modal')
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


  it('should set SVG geometry when "Parse SVG" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Parse SVG" button is clicked, the markup in the textarea
    // should be parsed and the map handler geometry should be updated.
    // --------------------------------------------------------------------

    var formatWKT = new OpenLayers.Format.WKT();
    var svg = '<svg><polygon points="1,2 3,4 5,6" /></svg>';
    var geo = OpenLayers.Geometry.fromWKT(SVGtoWKT.convert(svg));

    // Update SVG.
    els.input.val(svg);
    els.parse.trigger('click');

    // `geometry` on handler should be set.
    expect(_t.vw.map.controls.svg.handler.geometry.equals(geo)).
      toBeTruthy();

  });


  it('should flash notification when the parse succeeds', function() {

    // --------------------------------------------------------------------
    // When new SVG is successfully parsed, a success notification should
    // be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Parse valid SVG.
    els.input.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    els.parse.trigger('click');

    // `toastr` should be called.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.svg.parse.success, null, _t.vw.editor.options.toastr
    );

  });


  it('should close the modal when the parse succeeds', function() {

    // --------------------------------------------------------------------
    // When new SVG is successfully parsed, the modal should be closed.
    // --------------------------------------------------------------------

    // Parse valid SVG.
    els.input.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
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
    els.input.val('invalid');
    els.parse.trigger('click');

    // `toastr` should be called.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.svg.parse.error, null, _t.vw.editor.options.toastr
    );

  });


  it('should not close the modal when the parse fails', function() {

    // --------------------------------------------------------------------
    // When new SVG is not parsed successfully, the modal stay open.
    // --------------------------------------------------------------------

    // Click on "Enter Markup".
    els.link.trigger('click');

    // Parse invalid SVG.
    els.input.val('invalid');
    els.parse.trigger('click');

    // Modal should be hidden.
    expect(els.modal).toHaveClass('in');

  });


});
