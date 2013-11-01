
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared', function(Shared) {


  Shared.Router = Backbone.Router.extend({


    /**
     * Trigger a generic event before each route.
     */
    before: function() {
      Neatline.vent.trigger('ROUTER:before');
    }


  });


});
