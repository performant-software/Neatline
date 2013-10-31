
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Widget', function() {


  var view;


  beforeEach(function() {
    NL.loadNeatline();
    view = Neatline.Shared.Widget.View.extend({
      id: 'widget'
    });
  });


  it('should append view when widget is not templated', function() {

    // ------------------------------------------------------------------------
    // When a widget is started and an element for the widget view element is
    // not attached to the DOM (which is the case when a container for the the
    // widget has not been explicitly templated by the theme), an element for
    // the widget should be appended to the map container.
    // ------------------------------------------------------------------------

    var inst = new view();
    expect($('#neatline-map')).toContain('#widget');

  });


  it('should not append view when widget is templated', function() {

    // ------------------------------------------------------------------------
    // When a view element _is_ provided by the theme, the view element should
    // not be appended to the exhibit.
    // ------------------------------------------------------------------------

    $('body').append($('<div id="widget"></div>'));

    var inst = new view();
    expect($('#neatline-map')).not.toContain('#widget');

  });


});
