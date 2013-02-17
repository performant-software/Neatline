
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Testing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


_t = (function() {
  var _t = {};
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * State management helpers.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
  /**
   * Load neatline application.
   */
  _t.loadNeatline = function() {
  
    // Load fixtures.
    this.setFixturesPath();
    this.loadJsonFixtures();
    loadFixtures('neatline-partial.html');
    loadStyleFixtures('neatline.css');
  
    // Mock the server.
    this.server = sinon.fakeServer.create();
  
    // Public modules.
    Neatline.Map.init();
    Neatline.Presenter.StaticBubble.init();
  
    // Inject fixtures, alias components.
    this.respondAll200(this.json.records.standard);
    _t.aliasNeatline();
  
  };
  
  
  /**
   * Load editor application.
   */
  _t.loadEditor = function() {
  
    _t.resetHash();
  
    // Load fixtures.
    this.setFixturesPath();
    this.loadJsonFixtures();
    loadFixtures('editor-partial.html');
    loadStyleFixtures('editor.css');
  
    // Mock the server.
    this.server = sinon.fakeServer.create();
  
    // Editor modules.
    Neatline.Editor.Menu.init();
    Neatline.Editor.Search.init();
    Neatline.Editor.Record.init();
    Neatline.Editor.Records.init();
    Neatline.Editor.Exhibit.init();
    Neatline.Editor.init();
  
    // Public modules.
    Neatline.Map.init();
    Neatline.Presenter.StaticBubble.init();
  
    // Map edit module.
    Neatline.Editor.Map.init();
  
    // Reset history.
    Backbone.history.stop();
    Backbone.history.start();
  
    // Inject fixtures, alias components.
    this.respondAll200(this.json.records.standard);
    _t.aliasNeatline();
    _t.aliasEditor();
  
    _t.navigate('');
  
  };
  
  
  /**
   * Strip the current hash route off the window href.
   */
  _t.resetHash = function() {
    window.location.hash = '';
  };
  
  
  /**
   * Navigate to a route, forcing refresh.
   *
   * @param {String} frag: The URL fragment.
   */
  _t.navigate = function(frag) {
    Neatline.Editor.__router.navigate('RESET');
    Neatline.Editor.__router.navigate(frag, { trigger: true });
  };
  
  
  /**
   * Simulate a click on an element.
   *
   * @param {Object} el: The anchor element.
   */
  _t.click = function(el) {
    el.click();
    this.navigate(el.attr('href'));
  };
  
  
  /**
   * Navigate to the record list.
   *
   * @param {Object} response: The response body.
   */
  _t.showRecordList = function(response) {
    this.navigate('records');
    this.respondLast200(response);
  };
  
  
  /**
   * Navigate to the edit form for the first record.
   */
  _t.openRecordForm = function() {
    _t.showRecordList(this.json.records.standard);
    var models = this.getRecordListModels();
    this.navigate('records/'+models[0].get('id'));
  };
  
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * Fixture loading helpers.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
  /**
   * Set the fixtures path.
   */
  _t.setFixturesPath = function() {
    jasmine.getFixtures().fixturesPath = 'fixtures';
    jasmine.getStyleFixtures().fixturesPath = 'payloads/css';
  };
  
  
  /**
   * Read JSON fixtures.
   */
  _t.loadJsonFixtures = function() {
    this.json = {
  
      records: {
        standard: readFixtures('records.standard.json'),
        changed:  readFixtures('records.changed.json'),
        removed:  readFixtures('records.removed.json'),
        noTitle:  readFixtures('records.noTitle.json'),
        tags:     readFixtures('records.tags.json'),
        p12:      readFixtures('records.p12.json'),
        p23:      readFixtures('records.p23.json'),
        p34:      readFixtures('records.p34.json'),
        p56:      readFixtures('records.p56.json'),
        p6:       readFixtures('records.p6.json')
      },
  
      record: {
        standard: readFixtures('record.standard.json'),
        add:      readFixtures('record.add.json')
      }
  
    };
  };
  
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * Component aliasing helpers.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
  /**
   * Shortcut public-facing exhibit components.
   */
  _t.aliasNeatline = function() {
  
    this.vw = {
      map:          Neatline.Map.                   __view,
      staticBubble: Neatline.Presenter.StaticBubble.__view
    };
  
    this.el = {
      map:          Neatline.Map.                   __view.$el,
      staticBubble: Neatline.Presenter.StaticBubble.__view.$el
    };
  
  };
  
  
  /**
   * Shortcut editor components.
   */
  _t.aliasEditor = function() {
  
    this.vw = {
      map:          Neatline.Map.                   __view,
      staticBubble: Neatline.Presenter.StaticBubble.__view,
      editor:       Neatline.Editor.                __view,
      menu:         Neatline.Editor.Menu.           __view,
      search:       Neatline.Editor.Search.         __view,
      mapedit:      Neatline.Editor.Map.            __view,
      records:      Neatline.Editor.Records.        __view,
      record:       Neatline.Editor.Record.         __view,
      exhibit:      Neatline.Editor.Exhibit.        __view
    };
  
    this.el = {
      map:          Neatline.Map.                   __view.$el,
      staticBubble: Neatline.Presenter.StaticBubble.__view.$el,
      editor:       Neatline.Editor.                __view.__ui.editor,
      menu:         Neatline.Editor.Menu.           __view.$el,
      search:       Neatline.Editor.Search.         __view.$el,
      records:      Neatline.Editor.Records.        __view.$el,
      record:       Neatline.Editor.Record.         __view.$el,
      exhibit:      Neatline.Editor.Exhibit.        __view.$el
    };
  
  };
  
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * Custom assertions.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
  /**
   * Assert the method of the last request.
   *
   * @param {String} method: The method.
   */
  _t.assertLastRequestMethod = function(method) {
    var request = _t.getLastRequest();
    expect(request.method).toEqual(method);
  };
  
  
  /**
   * Assert the route of the last request.
   *
   * @param {String} route: The route.
   */
  _t.assertLastRequestRoute = function(route) {
    var request = _t.getLastRequest();
    expect(_.string.startsWith(request.url, route)).toBeTruthy();
  };
  
  
  /**
   * Assert that the last request has a GET key/value.
   *
   * @param {String} key: The key.
   * @param {String} val: The value.
   */
  _t.assertLastRequestHasGetParameter = function(key, val) {
    var request = _t.getLastRequest();
    if (val) expect(request.url).toContain(key+'='+val);
    else expect(request.url).toContain(key);
  };
  
  
  /**
   * Assert that the pagination is empty.
   */
  _t.assertPaginationEmpty = function() {
    var pag = _t.el.records.find('.pagination');
    expect($(pag[0]).text().match(/^\s+$/)).toBeTruthy();
    expect($(pag[1]).text().match(/^\s+$/)).toBeTruthy();
  };
  
  
  /**
   * Assert that the pagination is not empty.
   */
  _t.assertPaginationNotEmpty = function() {
    var pag = _t.el.records.find('.pagination');
    expect($(pag[0]).text().match(/^\s+$/)).not.toBeTruthy();
    expect($(pag[1]).text().match(/^\s+$/)).not.toBeTruthy();
  };
  
  
  /**
   * Assert that the pagination `<<` link is enabled.
   */
  _t.assertPaginationPrevEnabled = function() {
    var prev = _t.el.records.find('.pagination .prev');
    expect($(prev[0]).parent('li')).not.toHaveClass('disabled');
    expect($(prev[1]).parent('li')).not.toHaveClass('disabled');
  };
  
  
  /**
   * Assert that the pagination `<<` link is disabled.
   */
  _t.assertPaginationPrevDisabled = function() {
    var prev = _t.el.records.find('.pagination .prev');
    expect($(prev[0]).parent('li')).toHaveClass('disabled');
    expect($(prev[1]).parent('li')).toHaveClass('disabled');
  };
  
  
  /**
   * Assert that the pagination `>>` link is enabled.
   */
  _t.assertPaginationNextEnabled = function() {
    var next = _t.el.records.find('.pagination .next');
    expect($(next[0]).parent('li')).not.toHaveClass('disabled');
    expect($(next[1]).parent('li')).not.toHaveClass('disabled');
  };
  
  
  /**
   * Assert that the pagination `>>` link is disabled.
   */
  _t.assertPaginationNextDisabled = function() {
    var next = _t.el.records.find('.pagination .next');
    expect($(next[0]).parent('li')).toHaveClass('disabled');
    expect($(next[1]).parent('li')).toHaveClass('disabled');
  };
  
  
  /**
   * Assert the `href` attribute on the pagination `<<` link.
   *
   * @param {String} route: The hash.
   */
  _t.assertPaginationPrevRoute = function(route) {
    var prev = _t.el.records.find('.pagination .prev');
    expect($(prev[0])).toHaveAttr('href', route);
    expect($(prev[1])).toHaveAttr('href', route);
  };
  
  
  /**
   * Assert the `href` attribute on the pagination `>>` link.
   *
   * @param {String} route: The hash.
   */
  _t.assertPaginationNextRoute = function(route) {
    var next = _t.el.records.find('.pagination .next');
    expect($(next[0])).toHaveAttr('href', route);
    expect($(next[1])).toHaveAttr('href', route);
  };
  
  
  /**
   * Assert that the last request was a map refresh.
   */
  _t.assertMapRefreshed = function() {
  
    // Route should be /records/:id, method GET.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');
  
    // Request should include map focus.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');
  
    // Respond with new data.
    _t.respondLast200(_t.json.records.removed);
  
    // Record2 point should be removed.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();
    expect(_t.vw.map.layers.length).toEqual(2);
  
  };
  
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * Data access helpers.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
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
    return Neatline.Editor.Records.__collection.models;
  };
  
  
  /**
   * Get the vector layer by record title.
   *
   * @param {String} title: The record title.
   * @return {Object}: The layer.
   */
  _t.getVectorLayerByTitle = function(title) {
    return _.find(_t.vw.map.layers, function(layer) {
      return layer.name == title;
    });
  };
  
  
  /**
   * Get the record id from the new record JSON fixture.
   *
   * @return {Number}: The id.
   */
  _t.getNewRecordId = function() {
    return $.parseJSON(_t.json.record.add).id;
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
      id:             _t.el.record.find('p.lead span.id'),
      titleHeader:    _t.el.record.find('p.lead span.title'),
      titleInput:     _t.el.record.find('textarea[name="title"]'),
      itemId:         _t.el.record.find('input[name="item-id"]'),
      body:           _t.el.record.find('textarea[name="body"]'),
      coverage:       _t.el.record.find('textarea[name="coverage"]'),
      tags:           _t.el.record.find('input[name="tags"]'),
      presenter:      _t.el.record.find('select[name="presenter"]'),
      vectorColor:    _t.el.record.find('input[name="vector-color"]'),
      strokeColor:    _t.el.record.find('input[name="stroke-color"]'),
      selectColor:    _t.el.record.find('input[name="select-color"]'),
      vectorOpacity:  _t.el.record.find('input[name="vector-opacity"]'),
      selectOpacity:  _t.el.record.find('input[name="select-opacity"]'),
      strokeOpacity:  _t.el.record.find('input[name="stroke-opacity"]'),
      imageOpacity:   _t.el.record.find('input[name="image-opacity"]'),
      strokeWidth:    _t.el.record.find('input[name="stroke-width"]'),
      pointRadius:    _t.el.record.find('input[name="point-radius"]'),
      minZoom:        _t.el.record.find('input[name="min-zoom"]'),
      maxZoom:        _t.el.record.find('input[name="max-zoom"]'),
      pointImage:     _t.el.record.find('input[name="point-image"]'),
      mapFocus:       _t.el.record.find('input[name="map-focus"]'),
      mapZoom:        _t.el.record.find('input[name="map-zoom"]')
    };
  };
  
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * Ajax mocking helpers.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
  /**
   * Get the most recent request.
   *
   * @return {Object} request: The sinon request.
   */
  _t.getLastRequest = function() {
    return _.last(this.server.requests);
  };
  
  
  /**
   * Get the parameters from the most recent request.
   *
   * @return {Object} params: The parameters.
   */
  _t.getLastRequestParams = function() {
    return $.parseJSON(_t.getLastRequest().requestBody);
  };
  
  
  /**
   * Inject AJAX mock into a sinon request.
   *
   * @param {Object} request: The sinon request.
   * @param {Object} response: The response body.
   */
  _t.respond200 = function(request, response) {
    var contentType = { 'Content-Type':'application/json' };
    request.respond(200, contentType, response);
  };
  
  
  /**
   * Respond 500 to a sinon request.
   *
   * @param {Object} request: The sinon request.
   */
  _t.respond500 = function(request) {
    request.respond(500);
  };
  
  
  /**
   * Respond to all queued AJAX calls with a single response.
   *
   * @param {Object} response: The response body.
   */
  _t.respondAll200 = function(response) {
    _.each(this.server.requests, _.bind(function(r) {
      this.respond200(r, response);
    }, this));
  };
  
  
  /**
   * Respond 200 to the last AJAX call.
   *
   * @param {Object} response: The response body.
   * @return {Object} response: The last request.
   */
  _t.respondLast200 = function(response) {
    var request = this.getLastRequest();
    this.respond200(request, response);
    return request;
  };
  
  
  /**
   * Respond 500 to the last AJAX call.
   *
   * @return {Object} response: The last request.
   */
  _t.respondLast500 = function() {
    var request = this.getLastRequest();
    this.respond500(request);
    return request;
  };
  
  
  /**
   * Respond 200 with the default record collection.
   */
  _t.respondRecords = function() {
    this.respondLast200(this.json.records.standard);
  };
  
  
  /**
   * Respond 200 with the new record JSON.
   */
  _t.respondNewRecord = function() {
    this.respondLast200(this.json.record.add);
  };
  
  
  /* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */
  
  /**
   * Map helpers.
   *
   * @package     omeka
   * @subpackage  neatline
   * @copyright   2012 Rector and Board of Visitors, University of Virginia
   * @license     http://www.apache.org/licenses/LICENSE-2.0.html
   */
  
  
  /**
   * Trigger a pan/zoom event on the map.
   */
  _t.triggerMapMove = function() {
    this.vw.map.map.events.triggerEvent('moveend');
  };
  
  
  /**
   * Trigger a mouseout event on the map.
   */
  _t.triggerMapMouseout = function() {
    this.vw.map.map.events.triggerEvent('mouseout');
  };
  
  
  /**
   * Simulate map move event and plug in JSON fixture.
   *
   * @param {Object} response: The response body.
   */
  _t.refreshMap = function(response) {
    this.triggerMapMove();
    this.respondLast200(response);
  };
  
  
  /**
   * Simulate a click on a map feature.
   *
   * @param {Object} feature: The feature to be clicked on.
   */
  _t.clickOnMapFeature = function(feature) {
  
    // Mock getFeaturesFromEvent().
    _.each(this.vw.map.layers, function(layer) {
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
    this.vw.map.map.events.triggerEvent('click', evt);
  
  };
  
  
  /**
   * Simulate a click out on a map feature.
   */
  _t.clickOffMapFeature = function() {
  
    // Mock getFeaturesFromEvent().
    _.each(this.vw.map.layers, function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return null;
      };
    });
  
    // Trigger click.
    this.vw.map.map.events.triggerEvent('click', {
      xy: new OpenLayers.Pixel(1,2)
    });
  
  };
  
  
  /**
   * Simulate a mouseenter on a map feature.
   *
   * @param {Object} feature: The feature to be clicked on.
   */
  _t.hoverOnMapFeature = function(feature) {
  
    // Mock getFeaturesFromEvent().
    _.each(this.vw.map.layers, function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return feature;
      };
    });
  
    // Trigger click.
    this.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(1,2)
    });
  
  };
  
  
  /**
   * Simulate a mouseleave on a map feature.
   */
  _t.unHoverOnMapFeature = function() {
  
    // Mock getFeaturesFromEvent().
    _.each(this.vw.map.layers, function(layer) {
      layer.getFeatureFromEvent = function(evt) {
        return null;
      };
    });
  
    // Trigger click.
    this.vw.map.map.events.triggerEvent('mousemove', {
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
  _t.setMapCenter = function(lon, lat, zoom) {
    this.vw.map.map.setCenter([lon, lat], zoom);
  };
  
  
  /**
   * Set the map zoom level.
   *
   * @param {Number} zoom: The zoom level.
   */
  _t.setMapZoom = function(zoom) {
    this.vw.map.map.zoomTo(zoom);
  };
  
  
  /**
   * Get `CLASS_NAME`s for the map controls.
   *
   * @param {Array}: A list of control `CLASS_NAME`s.
   */
  _t.getMapControlClassNames = function() {
    return _.map(_t.vw.map.map.controls, function(control) {
      return control.CLASS_NAME;
    });
  };
  
  
  /**
   * Mock the Google Maps API.
   */
  _t.mockGoogleApi = function() {
    window.google = {
      maps: {
        MapTypeId: {
          TERRAIN:    'terrain',
          ROADMAP:    'roadmap',
          SATELLITE:  'satellite',
          HYBRID:     'hybrid'
        }
      }
    };
  };
  
  return _t;
})();