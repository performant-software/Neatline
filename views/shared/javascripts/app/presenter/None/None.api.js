
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


  var none = function() {};
  Neatline.commands.addHandler('presenter:None:show', none);
  Neatline.commands.addHandler('presenter:None:hide', none);
  Neatline.commands.addHandler('presenter:None:select', none);
  Neatline.commands.addHandler('presenter:None:unselect', none);
  Neatline.vent.on('presenter:activate', none);
  Neatline.vent.on('presenter:deactivate', none);


});
