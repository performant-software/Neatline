
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
   * Shortcut public views.
   */
  _t.aliasNeatline = function() {
    this.vw = {
      MAP:      Neatline.Map.__view,
      BUBBLE:   Neatline.Presenter.StaticBubble.__view
    };
  };


  /**
   * Shortcut editor views.
   */
  _t.aliasEditor = function() {
    this.vw = {
      MAP:      Neatline.Map.__view,
      EDITOR:   Neatline.Editor.__view,
      EXHIBIT:  Neatline.Editor.Exhibit.__view,
      SEARCH:   Neatline.Editor.Exhibit.Search.__view,
      RECORDS:  Neatline.Editor.Exhibit.Records.__view,
      STYLES:   Neatline.Editor.Exhibit.Styles.__view,
      RECORD:   Neatline.Editor.Record.__view,
      SPATIAL:  Neatline.Editor.Record.Map.__view,
      TEXT:     Neatline.Editor.Record.Text.__view
    };
  };


  return _t;


})(_t || {});
