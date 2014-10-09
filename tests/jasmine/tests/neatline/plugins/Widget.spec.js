
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('API | Widget', function() {


  var view;


  beforeEach(function() {
    NL.loadNeatline();
    view = Neatline.Shared.Widget.View.extend({ id: 'widget' });
  });


  it('should append to map when container is not templated', function() {

    // ------------------------------------------------------------------------
    // When a widget is started and a container for the view is not attached
    // to the DOM, the widget should be appended to the map container.
    // ------------------------------------------------------------------------

    var inst = new view();
    expect($('#neatline-map')).toContainElement(inst.$el);

  });


  it('should use existing container when one is templated', function() {

    // ------------------------------------------------------------------------
    // When a container _is_ provided by the theme, the view element should
    // not be appended to the exhibit.
    // ------------------------------------------------------------------------

    var existing = $('<div id="widget"></div>');
    $('body').append(existing);

    var inst = new view();
    expect($('#neatline-map')).not.toContainElement(inst.$el);
    expect(existing.get(0)).toEqual(inst.el);

  });


});
