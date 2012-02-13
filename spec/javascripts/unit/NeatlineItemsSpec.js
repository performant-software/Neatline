/*
 * Unit tests for the items block.
 */

describe('Neatline Items', function() {

    var items, itemsResponse, request;

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get response mocks.
        itemsResponse = readFixtures('public-items-ajax.html');

        // Get container and set dimensions.
        items = $('#items');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Get mock request.
        request = mostRecentAjaxRequest();
        console.log(request);

    });

    describe('_create', function() {

        beforeEach(function() {
            // Set items data response.
            request.response(itemsResponse);
            items.neatlineitems();
        });

        it('should load items', function() {
            expect(
                items.neatlineitems('getAttr', 'listContainer')
            ).not.toBeEmpty();
        });

    });

});
