
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Trigger a `movestart` event on the map.
   */
  NL.triggerMapMoveStart = function() {
    this.v.map.map.events.triggerEvent('movestart');
    this.v.map.map.dragging = true;
  };


  /**
   * Trigger a `moveend` event on the map.
   */
  NL.triggerMapMoveEnd = function() {
    this.v.map.map.events.triggerEvent('moveend');
    this.v.map.map.dragging = false;
  };


  /**
   * Trigger a mouseout event on the map.
   */
  NL.triggerMapMouseout = function() {
    this.v.map.map.events.triggerEvent('mouseout');
  };


  /**
   * Simulate map move event and plug in JSON fixture.
   *
   * @param {Object} response: The response body.
   */
  NL.refreshMap = function(response) {
    this.triggerMapMoveEnd();
    this.respondLast200(response);
  };


  /**
   * Simulate a click on a map feature.
   *
   * @param {Object} feature: The feature to be clicked on.
   */
  NL.clickOnMapFeature = function(feature) {

    // Mock getFeaturesFromEvent().
    _.each(this.v.map.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return feature;
      };
    });

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(1,2),
      type: 'click'
    };

    // Trigger click.
    this.v.map.map.events.triggerEvent('click', evt);

  };


  /**
   * Simulate a click out on a map feature.
   */
  NL.clickOffMapFeature = function() {

    // Mock getFeaturesFromEvent().
    _.each(this.v.map.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return null;
      };
    });

    // Trigger click.
    this.v.map.map.events.triggerEvent('click', {
      xy: new OpenLayers.Pixel(1,2)
    });

  };


  /**
   * Simulate a mouseenter on a map feature.
   *
   * @param {Object} feature: The feature to be clicked on.
   */
  NL.hoverOnMapFeature = function(feature) {

    // Mock getFeaturesFromEvent().
    _.each(this.v.map.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return feature;
      };
    });

    // Trigger click.
    this.v.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(1,2)
    });

  };


  /**
   * Simulate a mouseleave on a map feature.
   */
  NL.unHoverOnMapFeature = function() {

    // Mock getFeaturesFromEvent().
    _.each(this.v.map.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return null;
      };
    });

    // Trigger click.
    this.v.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(1,2)
    });

  };


  /**
   * Set the map focus to a lon/lat and zoom position.
   *
   * @param {Number} lon: The longitude.
   * @param {Number} lat: The latitude.
   * @param {Number} zoom: The zoom level.
   */
  NL.setMapCenter = function(lon, lat, zoom) {
    this.v.map.map.setCenter([lon, lat], zoom);
  };


  /**
   * Set the map zoom level.
   *
   * @param {Number} zoom: The zoom level.
   */
  NL.setMapZoom = function(zoom) {
    this.v.map.map.zoomTo(zoom);
  };


  /**
   * Get a vector layer by record title.
   *
   * @param {String} title: The record title.
   * @return {Object}: The layer.
   */
  NL.getVectorLayer = function(title) {
    return _.find(this.v.map.getVectorLayers(), function(layer) {
      return layer.name == title;
    });
  };


  /**
   * Get a WMS layer by record title.
   *
   * @param {String} title: The record title.
   * @return {Object}: The layer.
   */
  NL.getWmsLayer = function(title) {
    return _.find(this.v.map.getWmsLayers(), function(layer) {
      return layer.name == title;
    });
  };


  return NL;


})(NL || {});
