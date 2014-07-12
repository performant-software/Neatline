
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Records', function(Records) {


  Records.Router = Neatline.Shared.Router.extend({


    routes: {
      'record/:id': 'record/:id'
    },


    /**
     * Select a record.
     *
     * @param {String} id: The record id.
     */
    'record/:id': function(id) {
      console.log(id);
    }


  });


});
