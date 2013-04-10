
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


  /**
   * Construct a record model instance from a JSON string.
   *
   * @param {String} json: The JSON string.
   * @return {Object} model: The model.
   */
  _t.recordFromJson = function(json) {
    return new Neatline.Shared.Record.Model(JSON.parse(json));
  };


  /**
   * Get DOM selections for the elements on the record form.
   *
   * @return {Object}: A hash of elements.
   */
  _t.getRecordFormElements = function() {
    var form = this.vw.RECORD;
    return {
      id:             form.$('p.lead span.id'),
      titleHeader:    form.$('p.lead span.title'),
      titleInput:     form.$('textarea[name="title"]'),
      itemId:         form.$('input[name="item-id"]'),
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
      weight:         form.$('input[name="weight"]'),
      startDate:      form.$('input[name="start-date"]'),
      endDate:        form.$('input[name="end-date"]'),
      pointImage:     form.$('input[name="point-image"]'),
      wmsAddress:     form.$('input[name="wms-address"]'),
      wmsLayers:      form.$('input[name="wms-layers"]'),
      minZoom:        form.$('input[name="min-zoom"]'),
      maxZoom:        form.$('input[name="max-zoom"]'),
      showAfterDate:  form.$('input[name="show-after-date"]'),
      showBeforeDate: form.$('input[name="show-before-date"]'),
      mapFocus:       form.$('input[name="map-focus"]'),
      mapZoom:        form.$('input[name="map-zoom"]')
    };
  };


  /**
   * Get an array of all the record form tab slugs.
   *
   * @return {Array}: The slugs.
   */
  _t.getTabSlugs = function() {
    return _.map(this.vw.RECORD.__ui.tabs, function(tab) {
      return $(tab).attr('data-slug');
    });
  };


  return _t;


})(_t || {});
