
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Record search tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Search', function() {

  var server;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');
  var jsonRemovedData = readFixtures('records-removed-record.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('editor-partial.html');
    server = sinon.fakeServer.create();

    // Run Editor.
    _t.loadEditor();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

  });

  describe('Query execution', function() {

    var spy, e;

    beforeEach(function() {

      // Spy on aggregator, mock `Enter`.
      spy = spyOn(Editor.vent, 'trigger').andCallThrough();
      e = $.Event('keyup', { keyCode: 13 });

    });

    afterEach(function() {

      // Check for highlighted button.
      expect(_t.search.searchButton).toHaveClass('btn-primary');

      // Check for updated records.
      var records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(2);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 3');

    });

    it('should execute a keyword query on `Enter`', function() {

      // Mock `Enter`.
      _t.search.input.val('query');
      _t.search.input.trigger(e);

      // Inject changed records fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Check publication.
      expect(spy.argsForCall[0][0]).toEqual('search:query');
      expect(spy.argsForCall[0][1].keywords).toEqual('query');
      expect(spy.argsForCall[0][1].tags).toBeNull();

    });

    it('should execute a keyword query on search button click', function() {

      // Simulate button press.
      _t.search.input.val('query');
      _t.search.searchButton.click();

      // Inject changed records fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Check publication.
      expect(spy.argsForCall[0][0]).toEqual('search:query');
      expect(spy.argsForCall[0][1].keywords).toEqual('query');
      expect(spy.argsForCall[0][1].tags).toBeNull();

    });

    it('should execute a tags query on `Enter`', function() {

      // Simulate `Enter`.
      _t.search.input.val('tags: tag1, tag2');
      _t.search.input.trigger(e);

      // Inject changed records fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Check publication.
      expect(spy.argsForCall[0][0]).toEqual('search:query');
      expect(spy.argsForCall[0][1].keywords).toBeNull();
      expect(spy.argsForCall[0][1].tags).toEqual('tag1, tag2');

    });

    it('should execute a tags query on search button click', function() {

      // Simulate button press.
      _t.search.input.val('tags: tag1, tag2');
      _t.search.searchButton.click();

      // Inject changed records fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Check publication.
      expect(spy.argsForCall[0][0]).toEqual('search:query');
      expect(spy.argsForCall[0][1].keywords).toBeNull();
      expect(spy.argsForCall[0][1].tags).toEqual('tag1, tag2');

    });

  });

  describe('Map mirroring', function() {

    var spy;

    // Spy on aggregator.
    beforeEach(function() {
      spy = spyOn(Editor.vent, 'trigger').andCallThrough();
    });

    it('should enable map mirroring on button click', function() {

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Check publication.
      expect(spy).toHaveBeenCalledWith('search:mapMirror');

      // Check for highlighted button.
      expect(_t.search.mirrorButton).toHaveClass('btn-primary');

    });

    it('should disable text search when mirroring is enabled', function() {

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Check for disabled text components.
      expect(_t.search.searchButton).toHaveAttr('disabled');
      expect(_t.search.input).toHaveAttr('disabled');

    });

    it('should deactivate existing text search when mirroring is enabled', function() {

      // Execute text search.
      _t.search.input.val('query');
      _t.search.searchButton.click();

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Check for disabled text components
      expect(_t.search.input).toHaveValue('query');
      expect(_t.search.searchButton).not.toHaveClass('btn-primary');

    });

    it('should propagate map collection when mirroring is enabled', function() {

      // Trigger a map move, inject new data.
      _t.map.map.events.triggerEvent('moveend');
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Check for immediate rendering of current map collection.
      var records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(2);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 3');

      // Re-inject original data on map.
      _t.map.map.events.triggerEvent('moveend');
      request = _.last(server.requests);
      _t.respond200(request, json);

      // Check for updated records.
      records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(3);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 2');
      expect($(records[2]).text()).toEqual('Record 3');

    });

    it('should not render new map records when form is open', function() {

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Open form.
      var records = _t.records.$el.find('.record-row');
      $(records[0]).trigger('click');

      // Trigger a map move, inject new data.
      _t.map.map.events.triggerEvent('moveend');
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Check for form and no records.
      expect(editor).toContain(_t.form.form);
      expect(editor).not.toContain('ul.records');
      expect(editor).not.toContain('li.record-row');

    });

    it('should re-render current map collection when form is closed', function() {

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Open form.
      var records = _t.records.$el.find('.record-row');
      $(records[0]).trigger('click');

      // Trigger a map move, inject new data.
      _t.map.map.events.triggerEvent('moveend');
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Close form.
      _t.form.closeButton.trigger('click');

      // Check for updated records.
      records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(2);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 3');

    });

    it('should disable map mirroring when button is clicked again', function() {

      // Trigger a map move, inject new data.
      _t.map.map.events.triggerEvent('moveend');
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Check for highlighted button.
      expect(_t.search.mirrorButton).toHaveClass('btn-primary');

      // Cancel.
      _t.search.mirrorButton.click();

      // Re-inject original data.
      request = _.last(server.requests);
      _t.respond200(request, json);

      // Check publication.
      var args = _.last(spy.argsForCall);
      expect(args[0]).toEqual('search:query');
      expect(args[1].keywords).toBeNull();
      expect(args[1].tags).toBeNull();

      // Check for updated records.
      var records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(3);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 2');
      expect($(records[2]).text()).toEqual('Record 3');

      // Check for unhighlighted button.
      expect(_t.search.mirrorButton).not.toHaveClass('btn-primary');

    });

    it('should re-enable text search when mirroring is disabled', function() {

      // Enable/disable mirroring.
      _t.search.mirrorButton.click();
      _t.search.mirrorButton.click();

      // Check for disabled text components.
      expect(_t.search.searchButton).not.toHaveAttr('disabled');
      expect(_t.search.input).not.toHaveAttr('disabled');

    });

    it('should fall back on text query when mirroring is disabled', function() {

      // Simulate button press.
      _t.search.input.val('query');
      _t.search.searchButton.click();

      // Enable mirroring, cancel.
      _t.search.mirrorButton.click();
      _t.search.mirrorButton.click();

      // Check publication.
      var args = _.last(spy.argsForCall);
      expect(args[0]).toEqual('search:query');
      expect(args[1].keywords).toEqual('query');
      expect(args[1].tags).toBeNull();

      // Check for active search button.
      expect(_t.search.searchButton).toHaveClass('btn-primary');

    });

  });

  describe('Cancel', function() {

    var spy;

    // Spy on aggregator.
    beforeEach(function() {
      spy = spyOn(Editor.vent, 'trigger').andCallThrough();
    });

    it('should clear text search on cancel button click', function() {

      // Execute text search.
      _t.search.input.val('query');
      _t.search.searchButton.click();

      // Inject changed records fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Check for highlighted button.
      expect(_t.search.searchButton).toHaveClass('btn-primary');

      // Cancel.
      _t.search.cancelButton.click();

      // Re-inject original records.
      request = _.last(server.requests);
      _t.respond200(request, json);

      // Check publication.
      var args = _.last(spy.argsForCall);
      expect(args[0]).toEqual('search:query');
      expect(args[1].keywords).toBeNull();
      expect(args[1].tags).toBeNull();

      // Check for updated records.
      var records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(3);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 2');
      expect($(records[2]).text()).toEqual('Record 3');

      // Check for unhighlighted button.
      expect(_t.search.searchButton).not.toHaveClass('btn-primary');

    });

    it('should disable mirroring on cancel button click', function() {

      // Trigger a map move, inject new data.
      _t.map.map.events.triggerEvent('moveend');
      var request = _.last(server.requests);
      _t.respond200(request, jsonRemovedData);

      // Enable mirroring.
      _t.search.mirrorButton.click();

      // Check for highlighted button.
      expect(_t.search.mirrorButton).toHaveClass('btn-primary');

      // Cancel.
      _t.search.cancelButton.click();

      // Re-inject original data on map.
      request = _.last(server.requests);
      _t.respond200(request, json);

      // Check publication.
      var args = _.last(spy.argsForCall);
      expect(args[0]).toEqual('search:query');
      expect(args[1].keywords).toBeNull();
      expect(args[1].tags).toBeNull();

      // Check for updated records.
      var records = _t.records.$el.find('.record-row');
      expect(records.length).toEqual(3);
      expect($(records[0]).text()).toEqual('Record 1');
      expect($(records[1]).text()).toEqual('Record 2');
      expect($(records[2]).text()).toEqual('Record 3');

      // Check for unhighlighted button.
      expect(_t.search.mirrorButton).not.toHaveClass('btn-primary');

    });

  });

});
