
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
    return this.el.records.find('.list a');
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
    return _.find(this.vw.map.layers, function(layer) {
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
    return {
      id:             this.el.record.find('p.lead span.id'),
      titleHeader:    this.el.record.find('p.lead span.title'),
      titleInput:     this.el.record.find('textarea[name="title"]'),
      itemId:         this.el.record.find('input[name="item-id"]'),
      body:           this.el.record.find('textarea[name="body"]'),
      coverage:       this.el.record.find('textarea[name="coverage"]'),
      tags:           this.el.record.find('input[name="tags"]'),
      presenter:      this.el.record.find('select[name="presenter"]'),
      vectorColor:    this.el.record.find('input[name="vector-color"]'),
      strokeColor:    this.el.record.find('input[name="stroke-color"]'),
      selectColor:    this.el.record.find('input[name="select-color"]'),
      vectorOpacity:  this.el.record.find('input[name="vector-opacity"]'),
      selectOpacity:  this.el.record.find('input[name="select-opacity"]'),
      strokeOpacity:  this.el.record.find('input[name="stroke-opacity"]'),
      imageOpacity:   this.el.record.find('input[name="image-opacity"]'),
      strokeWidth:    this.el.record.find('input[name="stroke-width"]'),
      pointRadius:    this.el.record.find('input[name="point-radius"]'),
      minZoom:        this.el.record.find('input[name="min-zoom"]'),
      maxZoom:        this.el.record.find('input[name="max-zoom"]'),
      pointImage:     this.el.record.find('input[name="point-image"]'),
      mapFocus:       this.el.record.find('input[name="map-focus"]'),
      mapZoom:        this.el.record.find('input[name="map-zoom"]')
    };
  };


  return _t;


})(_t || {});
