/*
 * Unit tests for the items block.
 */

describe('Item Browser', function() {

    var browser, request;

    // Mock _getItems() response.
    itemsResponse = {
        status: 200,
        responseText: readFixtures('editor-items-ajax.html')
    };

    beforeEach(function() {

        // Get editor markup.
        loadFixtures('editor.html');

        // Get container and set dimensions.
        browser = $('#item-browser');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Create spies for events.
        // itemClick = jasmine.createSpy('itemclick');
        // itemEnter = jasmine.createSpy('itementer');
        // itemLeave = jasmine.createSpy('itemleave');

        // Run the widget and wire up event spies.
        // items.neatlineitems({
        //     'itemclick': itemClick,
        //     'itementer': itemEnter,
        //     'itemleave': itemLeave
        // });
        itemBrowser.itembrowser();

        // Capture the request and set response.
        request = mostRecentAjaxRequest();
        request.response(itemsResponse);

    });

    describe('_create', function() {

        it('should load items', function() {

            // Check for markup presence.
            // expect(container).not.toBeEmpty();
            // expect(container).toContain($('ul'));
            // expect(container).toContain($('ul li.item-title[recordid="1"]'));
            // expect(container).toContain($('ul li.item-title[recordid="2"]'));
            // expect(container).toContain($('ul li.item-title[recordid="3"]'));
            // expect(container).toContain($('ul li.item-title[recordid="4"]'));

        });

    });

});
