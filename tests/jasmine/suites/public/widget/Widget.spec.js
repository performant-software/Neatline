
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for the abstract widget view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Widget', function() {


  var view;


  beforeEach(function() {
    _t.loadNeatline();
    view = Neatline.Shared.Widget.View.extend({
      id: 'widget'
    });
  });


  it('should append view when widget is not templated', function() {

    // --------------------------------------------------------------------
    // When a widget is started and the view element is not attached to
    // the DOM (which is the case when a container for the the widget
    // has not been explicitly templated by the theme), the view element
    // should be append to the exhibit container.
    // --------------------------------------------------------------------

    var inst = new view();
    expect($('#neatline')).toContain('#widget');

  });


  it('should not append view when widget is templated', function() {

    // --------------------------------------------------------------------
    // When the view element is attached to the DOM on start-up - meaning
    // that the theme has templated a container for the widget somewhere
    // else on the page - the view should not be appended to the exhibit.
    // --------------------------------------------------------------------

    // Add `#widget` container.
    $('body').append($('<div id="widget"></div>'));

    var inst = new view();
    expect($('#neatline')).not.toContain('#widget');

  });


});
