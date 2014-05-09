
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Exhibit', function(Exhibit) {


  Exhibit.Model = Backbone.Model.extend({


    /**
     * Construct the exhibit API endpoint.
     *
     * @return {String}: The exhibits API endpoint.
     */
    url: function() {
      return Neatline.g.neatline.exhibit_api;
    },


    /**
     * Plug in the templated exhibit defaults.
     *
     * @return {Object}: The default attribute values.
     */
    defaults: function() {
      return Neatline.g.neatline.exhibit;
    }


  });


});
