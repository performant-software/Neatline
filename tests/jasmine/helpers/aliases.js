
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Shortcut public views.
   */
  NL.aliasNeatline = function() {
    this.v = {
      map:      Neatline.Map.__controller.view,
      bubble:   Neatline.Presenter.StaticBubble.__controller.view
    };
  };


  /**
   * Shortcut editor views.
   */
  NL.aliasEditor = function() {
    this.v = {
      map:      Neatline.Map.__controller.view,
      bubble:   Neatline.Presenter.StaticBubble.__controller.view,
      editor:   Neatline.Editor.__controller.view,
      exhibit:  Neatline.Editor.Exhibit.__controller.view,
      search:   Neatline.Editor.Exhibit.Search.__controller.view,
      records:  Neatline.Editor.Exhibit.Records.__controller.view,
      styles:   Neatline.Editor.Exhibit.Styles.__controller.view,
      record:   Neatline.Editor.Record.__controller.view,
      textTab:  Neatline.Editor.Record.Text.__controller.view,
      itemTab:  Neatline.Editor.Record.Item.__controller.view,
      mapTab:   Neatline.Editor.Record.Map.__controller.view
    };
  };


  return NL;


})(NL || {});
