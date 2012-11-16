
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Record model.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Models.Record = Backbone.Model.extend({
  url: (function() { return __exhibit.recordSource; })
});
