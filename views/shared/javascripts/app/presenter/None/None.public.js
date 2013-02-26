
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Null presenter events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.None', function(
  None, Neatline, Backbone, Marionette, $, _) {


  None.NS = 'presenter:None';


  var none = function() {};
  Neatline.commands.addHandler(None.NS+':show', none);
  Neatline.commands.addHandler(None.NS+':hide', none);
  Neatline.commands.addHandler(None.NS+':select', none);
  Neatline.commands.addHandler(None.NS+':unselect', none);
  Neatline.vent.on('presenter:activate', none);
  Neatline.vent.on('presenter:deactivate', none);


});
