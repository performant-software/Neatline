
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(Records) {


  Records.Router = Neatline.Shared.Router.extend({


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
    records: function(query, start) {

      // Display the search box and list.
      Neatline.execute('EDITOR:display', [
        'EDITOR:EXHIBIT',
        'EDITOR:EXHIBIT:SEARCH',
        'EDITOR:EXHIBIT:RECORDS'
      ]);

      // Activate the "Records" tab.
      Neatline.execute('EDITOR:EXHIBIT:activateTab', 'records');

      // (Re)hydrate the records list.
      Neatline.execute('EDITOR:EXHIBIT:SEARCH:hydrate', query, start);

    }


  });


});
