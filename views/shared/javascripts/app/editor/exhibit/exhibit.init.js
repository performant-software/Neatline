
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  Exhibit.addInitializer(function() {
    console.log('exhibit');
    this.__model  = new Neatline.Editor.Exhibit.Model();
    this.__view   = new Exhibit.View();
  });


});
