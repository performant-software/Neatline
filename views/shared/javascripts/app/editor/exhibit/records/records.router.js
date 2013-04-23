
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  this.Router = Neatline.Editor.Router.extend({


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

      Neatline.execute('E:display', [
        'E:EXHIBIT',
        'E:EXHIBIT:SEARCH',
        'E:EXHIBIT:RECORDS'
      ]);

      Neatline.execute('E:EXHIBIT:activateTab', 'records');
      Neatline.execute('E:EXHIBIT:SEARCH:initialize', query, start);

    }


  });


});
