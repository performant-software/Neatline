
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  Styles.ID = 'EDITOR:EXHIBIT:STYLES';


  Styles.addInitializer(function() {
    Styles.__router = new Styles.Router();
    Styles.__view   = new Styles.View();
  });


});
