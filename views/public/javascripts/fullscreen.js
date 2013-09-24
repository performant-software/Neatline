
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

$(function() {

  var exhibit = $('#neatline');
  var map = $('#neatline-map');

  // Clear theme markup.
  $('body').empty().append(exhibit);

  var position = function() {
    map.css('height', $(window).height());
    Neatline.execute('MAP:updateSize');
  }

  // Fill window height.
  $(window).resize(position);
  position();

});
