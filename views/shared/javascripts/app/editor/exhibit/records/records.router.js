
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.Router = Neatline.Editor.Router.extend({


    routes: {
      '': 'records',
      'records(/search)(/query=:q)(/start=:s)': 'records'
    },


    /**
     * Show the list of records.
     *
     * @param {String} query: The search query.
     * @param {String} start: The paging offset.
     */
    'records': function(query, start) {
      Neatline.execute('EDITOR:display', ['EMENU', 'SEARCH', 'RECORDS']);
      Neatline.execute('EMENU:activateTab', 'records');
      Neatline.execute('SEARCH:initialize', query, start);
    }


  });


});
