
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Text tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', function(
  Text, Neatline, Backbone, Marionette, $, _) {


  Text.init = function() {
    this.__view =   new Text.View();
    this.__router = new Text.Router();
  };

  Text.addInitializer(Text.init);


});
