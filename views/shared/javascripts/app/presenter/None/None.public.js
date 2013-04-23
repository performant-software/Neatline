
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.None', function(
  None, Neatline, Backbone, Marionette, $, _) {


  this.ID = 'PRESENTER:None';


  var none = function() {};

  Neatline.commands.setHandler(this.ID+':highlight',    none);
  Neatline.commands.setHandler(this.ID+':unhighlight',  none);
  Neatline.commands.setHandler(this.ID+':select',       none);
  Neatline.commands.setHandler(this.ID+':unselect',     none);
  Neatline.vent.on('PRESENTER:activate',                none);
  Neatline.vent.on('PRESENTER:deactivate',              none);


});
