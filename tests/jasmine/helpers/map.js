
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

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
    this.vw.MAP.map.events.triggerEvent('movestart');
  };


  /**
   * Trigger a `moveend` event on the map.
   */
  NL.triggerMapMoveEnd = function() {
    this.vw.MAP.map.events.triggerEvent('moveend');
  };


  /**
   * Trigger a mouseout event on the map.
   */
  NL.triggerMapMouseout = function() {
    this.vw.MAP.map.events.triggerEvent('mouseout');
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
    _.each(this.vw.MAP.getVectorLayers(), function(layer) {
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
    this.vw.MAP.map.events.triggerEvent('click', evt);

  };


  /**
   * Simulate a click out on a map feature.
   */
  NL.clickOffMapFeature = function() {

    // Mock getFeaturesFromEvent().
    _.each(this.vw.MAP.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return null;
      };
    });

    // Trigger click.
    this.vw.MAP.map.events.triggerEvent('click', {
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
    _.each(this.vw.MAP.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return feature;
      };
    });

    // Trigger click.
    this.vw.MAP.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(1,2)
    });

  };


  /**
   * Simulate a mouseleave on a map feature.
   */
  NL.unHoverOnMapFeature = function() {

    // Mock getFeaturesFromEvent().
    _.each(this.vw.MAP.getVectorLayers(), function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return null;
      };
    });

    // Trigger click.
    this.vw.MAP.map.events.triggerEvent('mousemove', {
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
    this.vw.MAP.map.setCenter([lon, lat], zoom);
  };


  /**
   * Set the map zoom level.
   *
   * @param {Number} zoom: The zoom level.
   */
  NL.setMapZoom = function(zoom) {
    this.vw.MAP.map.zoomTo(zoom);
  };


  /**
   * Get a vector layer by record title.
   *
   * @param {String} title: The record title.
   * @return {Object}: The layer.
   */
  NL.getVectorLayer = function(title) {
    return _.find(this.vw.MAP.getVectorLayers(), function(layer) {
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
    return _.find(this.vw.MAP.getWmsLayers(), function(layer) {
      return layer.name == title;
    });
  };


  /**
   * Get `CLASS_NAME`s for the map controls.
   *
   * @param {Array}: A list of control `CLASS_NAME`s.
   */
  NL.getMapControlClassNames = function() {
    return _.map(this.vw.MAP.map.controls, function(control) {
      return control.CLASS_NAME;
    });
  };


  return NL;


})(NL || {});
