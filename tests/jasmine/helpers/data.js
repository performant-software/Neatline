
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Data access helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


  /**
   * Get DOM collection of editor record listings.
   *
   * @return {Array}: The DOM collection of <a> elements.
   */
  _t.getRecordRows = function() {
    return this.vw.RECORDS.$el.find('.list a');
  };


  /**
   * Get the array of models from the record list collection.
   *
   * @return {Array}: The models.
   */
  _t.getRecordListModels = function() {
    return Neatline.Editor.Exhibit.Records.__collection.models;
  };


  /**
   * Get the vector layer by record title.
   *
   * @param {String} title: The record title.
   * @return {Object}: The layer.
   */
  _t.getVectorLayerByTitle = function(title) {
    return _.find(this.vw.MAP.layers, function(layer) {
      return layer.name == title;
    });
  };


  /**
   * Get the record id from the new record JSON fixture.
   *
   * @return {Number}: The id.
   */
  _t.getNewRecordId = function() {
    return $.parseJSON(this.json.record.add).id;
  };


  /**
   * Construct a record model instance from a JSON string.
   *
   * @param {String} json: The JSON string.
   * @return {Object} model: The model.
   */
  _t.buildModelFromJson = function(json) {
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
      presenter:      form.$('select[name="presenter"]'),
      fillColor:      form.$('input[name="fill-color"]'),
      selectColor:    form.$('input[name="select-color"]'),
      strokeColor:    form.$('input[name="stroke-color"]'),
      fillOpacity:    form.$('input[name="fill-opacity"]'),
      selectOpacity:  form.$('input[name="select-opacity"]'),
      strokeOpacity:  form.$('input[name="stroke-opacity"]'),
      imageOpacity:   form.$('input[name="image-opacity"]'),
      strokeWidth:    form.$('input[name="stroke-width"]'),
      pointRadius:    form.$('input[name="point-radius"]'),
      minZoom:        form.$('input[name="min-zoom"]'),
      maxZoom:        form.$('input[name="max-zoom"]'),
      pointImage:     form.$('input[name="point-image"]'),
      wmsAddress:     form.$('input[name="wms-address"]'),
      wmsLayers:      form.$('input[name="wms-layers"]'),
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
