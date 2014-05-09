
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
   * Get a model from the record list collection by index.
   *
   * @param {Number} index: The index.
   * @return {Array}: The models.
   */
  NL.getRecordListModelAtIndex = function(index) {
    var records = Neatline.Editor.Exhibit.Records.__controller.view.records;
    return records.at(index);
  };


  /**
   * Get a model from the record list collection by title.
   *
   * @param {String} title: The record title.
   * @return {Object}: The model.
   */
  NL.getRecordListModelByTitle = function(title) {
    var records = Neatline.Editor.Exhibit.Records.__controller.view.records;
    return records.findWhere({ title: title });
  };


  return NL;


})(NL || {});
