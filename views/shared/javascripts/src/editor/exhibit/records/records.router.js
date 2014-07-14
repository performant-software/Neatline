
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Records', function(Records) {


  Records.Router = Neatline.Shared.Router.extend({


    routes: {
      '': 'browse',
      'browse(/query=:q)(/start=:s)': 'browse'
    },


    /**
     * Show the list of records.
     *
     * @param {String} query: The search query.
     * @param {String} start: The paging offset.
     */
    browse: function(query, start) {

      Neatline.execute('EDITOR:display', [
        'EDITOR:EXHIBIT',
        'EDITOR:EXHIBIT:SEARCH',
        'EDITOR:EXHIBIT:RECORDS'
      ]);

      Neatline.execute('EDITOR:EXHIBIT:activateTab', 'records');
      Neatline.execute('EDITOR:EXHIBIT:SEARCH:hydrate', query, start);

    }


  });


});
