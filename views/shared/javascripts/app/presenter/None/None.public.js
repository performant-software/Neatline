
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.None', function(
  None, Neatline, Backbone, Marionette, $, _) {


  var none = function() {};

  Neatline.commands.setHandler('PRESENTER:None:highlight',    none);
  Neatline.commands.setHandler('PRESENTER:None:unhighlight',  none);
  Neatline.commands.setHandler('PRESENTER:None:select',       none);
  Neatline.commands.setHandler('PRESENTER:None:unselect',     none);
  Neatline.vent.on('PRESENTER:activate',                      none);
  Neatline.vent.on('PRESENTER:deactivate',                    none);


});
