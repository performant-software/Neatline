/**
 * Record model.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Models.Record = Backbone.Model.extend({
  url: (function() { return __editor.formSource+this.id; })
});
