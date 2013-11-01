
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Shortcut public views.
   */
  NL.aliasNeatline = function() {
    this.vw = {
      MAP:      Neatline.Map.__controller.view,
      BUBBLE:   Neatline.Presenter.StaticBubble.__controller.view
    };
  };


  /**
   * Shortcut editor views.
   */
  NL.aliasEditor = function() {
    this.vw = {
      MAP:      Neatline.Map.__controller.view,
      BUBBLE:   Neatline.Presenter.StaticBubble.__controller.view,
      EDITOR:   Neatline.Editor.__controller.view,
      EXHIBIT:  Neatline.Editor.Exhibit.__controller.view,
      SEARCH:   Neatline.Editor.Exhibit.Search.__controller.view,
      RECORDS:  Neatline.Editor.Exhibit.Records.__controller.view,
      STYLES:   Neatline.Editor.Exhibit.Styles.__controller.view,
      RECORD:   Neatline.Editor.Record.__controller.view,
      SPATIAL:  Neatline.Editor.Record.Map.__controller.view,
      TEXT:     Neatline.Editor.Record.Text.__controller.view
    };
  };


  return NL;


})(NL || {});
