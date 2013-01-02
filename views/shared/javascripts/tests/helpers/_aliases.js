
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Component aliasing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Shortcut public-facing exhibit components.
 */
_t.aliasNeatline = function() {

  _.extend(this.collections, {
    map:      Neatline.Map.__collection
  });

  _.extend(this.views, {
    map:      Neatline.Map.__view,
    bubble:   Neatline.Bubble.__view
  });

};


/**
 * Shortcut editor components.
 */
_t.aliasEditor = function() {

  _.extend(this.collections, {
    records:  Neatline.Editor.Records.__collection
  });

  _.extend(this.views, {
    editor:   Neatline.Editor.__view,
    records:  Neatline.Editor.Records.__view,
    record:   Neatline.Editor.Record.__view,
    search:   Neatline.Editor.Search.__view
  });

};
