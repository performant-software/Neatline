
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
    var form = this.v.record;
    return {
      id:                   form.$('p.lead span.id'),
      titleHeader:          form.$('p.lead span.title'),
      itemId:               form.$('input[name="item-id"]'),
      slug:                 form.$('input[name="slug"]'),
      titleInput:           form.$('textarea[name="title"]'),
      body:                 form.$('textarea[name="body"]'),
      coverage:             form.$('textarea[name="coverage"]'),
      tags:                 form.$('input[name="tags"]'),
      widgets:              form.$('select[name="widgets"]'),
      presenter:            form.$('select[name="presenter"]'),
      fillColor:            form.$('input[name="fill-color"]'),
      fillColorSelect:      form.$('input[name="fill-color-select"]'),
      strokeColor:          form.$('input[name="stroke-color"]'),
      strokeColorSelect:    form.$('input[name="stroke-color-select"]'),
      fillOpacity:          form.$('input[name="fill-opacity"]'),
      fillOpacitySelect:    form.$('input[name="fill-opacity-select"]'),
      strokeOpacity:        form.$('input[name="stroke-opacity"]'),
      strokeOpacitySelect:  form.$('input[name="stroke-opacity-select"]'),
      strokeWidth:          form.$('input[name="stroke-width"]'),
      pointRadius:          form.$('input[name="point-radius"]'),
      zindex:               form.$('input[name="zindex"]'),
      weight:               form.$('input[name="weight"]'),
      startDate:            form.$('input[name="start-date"]'),
      endDate:              form.$('input[name="end-date"]'),
      afterDate:            form.$('input[name="after-date"]'),
      beforeDate:           form.$('input[name="before-date"]'),
      pointImage:           form.$('input[name="point-image"]'),
      wmsAddress:           form.$('input[name="wms-address"]'),
      wmsLayers:            form.$('input[name="wms-layers"]'),
      minZoom:              form.$('input[name="min-zoom"]'),
      maxZoom:              form.$('input[name="max-zoom"]'),
      mapFocus:             form.$('input[name="map-focus"]'),
      mapZoom:              form.$('input[name="map-zoom"]')
    };
  };


  /**
   * Get all record form tab slugs that generate separate routes.
   *
   * @return {Array}: The slugs.
   */
  NL.getRoutableTabSlugs = function() {

    // Get all slugs.
    var slugs = _.map(this.v.record.__ui.tabs, function(tab) {
      return $(tab).attr('data-slug');
    });

    // Remove 'text', which has the same route as the form.
    return _.without(slugs, 'text');

  };


  /**
   * Click on one of the record form tabs.
   *
   * @param {String} slug: The slug of the tab to click.
   */
  NL.clickTab = function(slug) {
    var tab = NL.v.record.$('a[href="#record-'+slug+'"]')
    tab.trigger('click');
  };


  return NL;


})(NL || {});
