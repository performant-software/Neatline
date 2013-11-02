
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Get DOM collection of editor record listings.
   *
   * @return {Array}: The DOM collection of <a> elements.
   */
  NL.getRecordListRows = function() {
    return this.v.records.$el.find('.list-group a');
  };


  /**
   * Get the array of models from the record list collection.
   *
   * @return {Array}: The models.
   */
  NL.getRecordListModels = function() {
    return Neatline.Editor.Exhibit.Records.__controller.view.records.models;
  };


  return NL;


})(NL || {});
