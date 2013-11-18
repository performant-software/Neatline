
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

jQuery(function() { Neatline.start(); });

// TODO|debug
var swap = function(i) {
  if (i%2==0) Backbone.history.navigate('records', true);
  else Backbone.history.navigate('record/add', true);
  i--;
  if (i>0) setTimeout(swap, 500, i);
}
