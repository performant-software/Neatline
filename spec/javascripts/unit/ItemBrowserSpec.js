/*
 * Unit tests for the items block.
 */

describe('Item Browser', function() {

    var browser, list, request;

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

        // Run the widget, get component markup.
        browser.itembrowser();
        list = browser.itembrowser('getAttr', 'itemsList');

        // Capture the request and set response.
        request = mostRecentAjaxRequest();

    });

    describe('_create', function() {

        beforeEach(function() {

            // Set response mock.
            request.response(itemsResponse);

        });

        it('should load items', function() {

            // Check for the items list.
            expect(list).not.toBeEmpty();
            expect(list).toContain($('table#items-table'));
            expect(list).toContain($('tr.item-row[recordid="1"]'));
            expect(list).toContain($('tr.item-row[recordid="2"]'));
            expect(list).toContain($('tr.item-row[recordid="3"]'));
            expect(list).toContain($('tr.item-row[recordid="4"]'));

        });

    });

});
