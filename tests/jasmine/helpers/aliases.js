
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Component aliasing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


  /**
   * Shortcut public-facing exhibit components.
   */
  _t.aliasNeatline = function() {

    this.vw = {
      map:          Neatline.Map.                     __view,
      staticBubble: Neatline.Presenter.StaticBubble.  __view
    };

    this.el = {
      map:          Neatline.Map.                     __view.$el,
      staticBubble: Neatline.Presenter.StaticBubble.  __view.$el
    };

  };


  /**
   * Shortcut editor components.
   */
  _t.aliasEditor = function() {

    this.vw = {
      map:          Neatline.Map.                     __view,
      staticBubble: Neatline.Presenter.StaticBubble.  __view,
      editor:       Neatline.Editor.                  __view,
      menu:         Neatline.Editor.Exhibit.Menu.     __view,
      search:       Neatline.Editor.Exhibit.Search.   __view,
      records:      Neatline.Editor.Exhibit.Records.  __view,
      styles:       Neatline.Editor.Exhibit.Styles.   __view,
      record:       Neatline.Editor.Record.           __view,
      mapedit:      Neatline.Editor.Map.              __view
    };

    this.el = {
      map:          Neatline.Map.                     __view.$el,
      staticBubble: Neatline.Presenter.StaticBubble.  __view.$el,
      editor:       Neatline.Editor.                  __view.__ui.editor,
      menu:         Neatline.Editor.Exhibit.Menu.     __view.$el,
      search:       Neatline.Editor.Exhibit.Search.   __view.$el,
      records:      Neatline.Editor.Exhibit.Records.  __view.$el,
      styles:       Neatline.Editor.Exhibit.Styles.   __view.$el,
      record:       Neatline.Editor.Record.           __view.$el
    };

  };


  return _t;


})(_t || {});
