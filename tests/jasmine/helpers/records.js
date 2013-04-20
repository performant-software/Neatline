
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records helpers.
 *
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
    return this.vw.RECORDS.$el.find('.list a');
  };


  /**
   * Get the array of models from the record list collection.
   *
   * @return {Array}: The models.
   */
  NL.getRecordListModels = function() {
    return Neatline.Editor.Exhibit.Records.__collection.models;
  };


  return NL;


})(NL || {});
