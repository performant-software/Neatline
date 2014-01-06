
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Import SVG', function() {


  var elements, fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);

    elements = {
      link:   NL.v.mapTab.$('a[href="#svg-modal"]'),
      cancel: NL.v.mapTab.svgModal.find('a[name="cancel"]'),
      parse:  NL.v.mapTab.svgModal.find('a[name="parse"]')
    };

  });


  it('should show modal when "Enter Markup" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Enter Markup" link is clicked, the SVG input modal should be
    // displayed.
    // ------------------------------------------------------------------------

    // Click "Enter Markup".
    elements.link.trigger('click');

    // Modal and overlay should be visible.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(NL.v.mapTab.svgModal).toHaveClass('in');

  });


  it('should close modal when "Cancel" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Cancel" button is clicked, the modal should disappear and the
    // form should return to its normal state.
    // ------------------------------------------------------------------------

    // Click "Enter Markup".
    elements.link.trigger('click');

    // Click "Cancel".
    elements.cancel.trigger('click');

    // Modal should be closed.
    expect(NL.v.mapTab.svgModal).not.toHaveClass('in');

  });


  it('should set SVG geometry when "Parse" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Parse SVG" button is clicked, the markup should be parsed and
    // the map handler geometry should be updated.
    // ------------------------------------------------------------------------

    var formatWKT = new OpenLayers.Format.WKT();
    var svg = '<svg><polygon points="1,2 3,4 5,6" /></svg>';
    var geo = OpenLayers.Geometry.fromWKT(SVGtoWKT.convert(svg));

    // Update SVG.
    NL.v.mapTab.svgContent.val(svg);
    elements.parse.trigger('click');

    // `geometry` on handler should be set.
    expect(NL.v.map.controls.svg.handler.geometry.equals(geo)).toBeTruthy();

  });


  it('should react to different density values', function() {

    // ------------------------------------------------------------------------
    // The value of the "Density" input should be used as the `DENSITY` ratio
    // in the SVG-to-WKT conversion.
    // ------------------------------------------------------------------------

    // Set SVG.
    NL.v.mapTab.svgContent.val('<svg><circle r="10" cx="0" cy="0" /></svg>');

    // Set low density.
    NL.v.mapTab.svgDensity.val('1.0');
    elements.parse.trigger('click');

    // Capture the number of points in the geometry.
    var c1 = NL.v.map.controls.svg.handler.geometry.getVertices().length;

    // Set high density.
    NL.v.mapTab.svgDensity.val('2.0');
    elements.parse.trigger('click');

    // Capture the number of points in the geometry.
    var c2 = NL.v.map.controls.svg.handler.geometry.getVertices().length;

    // Should be more points.
    expect(c2).toBeGreaterThan(c1);

  });


  it('should show notification when the parse succeeds', function() {

    // ------------------------------------------------------------------------
    // When the SVG parses, a success notification should be displayed.
    // ------------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Parse valid SVG.
    NL.v.mapTab.svgContent.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    elements.parse.trigger('click');

    // Should flash success.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.svg.parse.success
    );

  });


  it('should close the modal when the parse succeeds', function() {

    // ------------------------------------------------------------------------
    // When the SVG is successfully parsed, the modal should be closed.
    // ------------------------------------------------------------------------

    // Parse valid SVG.
    NL.v.mapTab.svgContent.val('<svg><polygon points="1,2 3,4 5,6" /></svg>');
    elements.parse.trigger('click');

    // Modal should be hidden.
    expect(NL.v.mapTab.svgModal).not.toHaveClass('in');

  });


  it('should flash notification when the parse fails', function() {

    // ------------------------------------------------------------------------
    // When the SVG doesn't parse, a failure notification should be displayed.
    // ------------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Parse invalid SVG.
    NL.v.mapTab.svgContent.val('invalid');
    elements.parse.trigger('click');

    // Should flash error.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.svg.parse.error
    );

  });


  it('should not close the modal when the parse fails', function() {

    // ------------------------------------------------------------------------
    // When the SVG doesn't parse, the modal stay open.
    // ------------------------------------------------------------------------

    // Click "Enter Markup".
    elements.link.trigger('click');

    // Parse invalid SVG.
    NL.v.mapTab.svgContent.val('invalid');
    elements.parse.trigger('click');

    // Modal should be visible.
    expect(NL.v.mapTab.svgModal).toHaveClass('in');

  });


  it('should close the modal when the route changes', function() {

    // ------------------------------------------------------------------------
    // If the modal is displayed and the user navigates to a different route
    // (eg, click the back button), the modal should close.
    // ------------------------------------------------------------------------

    // Click "Enter Markup".
    elements.link.trigger('click');

    // Navigate back to browse.
    NL.navigate('records');

    // Modal should be hidden.
    expect(NL.v.mapTab.svgModal).not.toHaveClass('in');

  });


});
