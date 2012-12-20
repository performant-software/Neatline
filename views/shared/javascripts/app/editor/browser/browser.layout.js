
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Browser layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Browser', function(
  Browser, Neatline, Backbone, Marionette, $, _) {


  Browser.Layout = Backbone.Marionette.Layout.extend({


    template: '#browser-template',

    regions: {
      list: '#browser'
    }


  });


});
