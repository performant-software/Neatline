
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * A Neatline exhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  Exhibit.Model = Backbone.Model.extend({


    /**
     * Construct the API url.
     *
     * @return {String}: The url.
     */
    url: function() {
      return Neatline.globals.exhibits_api;
    },


    defaults: function() {
      return Neatline.globals.exhibit;
    }


  });


});
