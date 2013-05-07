
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Construct a record model instance from a JSON string.
   *
   * @param {String} json: The JSON string.
   * @return {Object} model: The model.
   */
  NL.recordFromJson = function(json) {
    return new Neatline.Shared.Record.Model(JSON.parse(json));
  };


  /**
   * Get DOM selections for the elements on the record form.
   *
   * @return {Object}: A hash of elements.
   */
  NL.getRecordFormElements = function() {
    var form = this.vw.RECORD;
    return {
      id:             form.$('p.lead span.id'),
      titleHeader:    form.$('p.lead span.title'),
      itemId:         form.$('input[name="item-id"]'),
      slug:           form.$('input[name="slug"]'),
      titleInput:     form.$('textarea[name="title"]'),
      body:           form.$('textarea[name="body"]'),
      coverage:       form.$('textarea[name="coverage"]'),
      tags:           form.$('input[name="tags"]'),
      widgets:        form.$('select[name="widgets"]'),
      presenter:      form.$('select[name="presenter"]'),
      fillColor:      form.$('input[name="fill-color"]'),
      selectColor:    form.$('input[name="select-color"]'),
      strokeColor:    form.$('input[name="stroke-color"]'),
      fillOpacity:    form.$('input[name="fill-opacity"]'),
      selectOpacity:  form.$('input[name="select-opacity"]'),
      strokeOpacity:  form.$('input[name="stroke-opacity"]'),
      strokeWidth:    form.$('input[name="stroke-width"]'),
      pointRadius:    form.$('input[name="point-radius"]'),
      zindex:         form.$('input[name="zindex"]'),
      weight:         form.$('input[name="weight"]'),
      startDate:      form.$('input[name="start-date"]'),
      endDate:        form.$('input[name="end-date"]'),
      afterDate:      form.$('input[name="after-date"]'),
      beforeDate:     form.$('input[name="before-date"]'),
      pointImage:     form.$('input[name="point-image"]'),
      wmsAddress:     form.$('input[name="wms-address"]'),
      wmsLayers:      form.$('input[name="wms-layers"]'),
      minZoom:        form.$('input[name="min-zoom"]'),
      maxZoom:        form.$('input[name="max-zoom"]'),
      mapFocus:       form.$('input[name="map-focus"]'),
      mapZoom:        form.$('input[name="map-zoom"]')
    };
  };


  /**
   * Get an array of all the record form tab slugs.
   *
   * @return {Array}: The slugs.
   */
  NL.getTabSlugs = function() {
    return _.map(this.vw.RECORD.__ui.tabs, function(tab) {
      return $(tab).attr('data-slug');
    });
  };


  return NL;


})(NL || {});
