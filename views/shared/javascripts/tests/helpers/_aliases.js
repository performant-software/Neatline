
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

  this.vw = {
    map:    Neatline.Map.     __view,
    bubble: Neatline.Bubble.  __view
  };

  this.el = {
    map:    Neatline.Map.     __view.$el,
    bubble: Neatline.Bubble.  __view.$el
  };

};


/**
 * Shortcut editor components.
 */
_t.aliasEditor = function() {

  this.vw = {
    map:      Neatline.Map.             __view,
    bubble:   Neatline.Bubble.          __view,
    editor:   Neatline.Editor.          __view,
    menu:     Neatline.Editor.Menu.     __view,
    records:  Neatline.Editor.Records.  __view,
    record:   Neatline.Editor.Record.   __view,
    search:   Neatline.Editor.Search.   __view
  };

  this.el = {
    map:      Neatline.Map.             __view.$el,
    bubble:   Neatline.Bubble.          __view.$el,
    editor:   Neatline.Editor.          __view.__ui.editor,
    menu:     Neatline.Editor.Menu.     __view.$el,
    records:  Neatline.Editor.Records.  __view.$el,
    record:   Neatline.Editor.Record.   __view.$el,
    search:   Neatline.Editor.Search.   __view.$el
  };

};
