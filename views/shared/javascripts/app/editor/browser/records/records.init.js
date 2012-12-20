
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Browser.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  /**
   * Instantiate the record list layout.
   */
  Records.addInitializer(function() {
    this._layout = new Records.Layout();
  });


});
