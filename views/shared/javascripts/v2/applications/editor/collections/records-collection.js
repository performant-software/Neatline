/**
 * Records collection.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Collections.Records = Backbone.Collection.extend({
  url: (function() { return __editor.recordsSource; }),
  model: Editor.Models.Record
});
