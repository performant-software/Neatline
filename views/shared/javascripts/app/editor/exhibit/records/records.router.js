
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(Records) {


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
    records: function(query, start) {

      Neatline.execute('EDITOR:display', [
        'EDITOR:EXHIBIT',
        'EDITOR:EXHIBIT:SEARCH',
        'EDITOR:EXHIBIT:RECORDS'
      ]);

      Neatline.execute(
        'EDITOR:EXHIBIT:activateTab', 'records'
      );

      Neatline.execute(
        'EDITOR:EXHIBIT:SEARCH:search', query, start
      );

    }


  });


});
