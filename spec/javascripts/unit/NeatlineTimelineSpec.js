/*
 * Unit tests for the timeline block.
 */

describe('Neatline Timeline', function() {

    var timeline;

    // Mock data response.
    // dataResponse = {
    //     status: 200,
    //     responseText: readFixtures('public-items-ajax.html')
    // };

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get container.
        timeline = $('#timeline');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Instantiate the widget.
        timeline.neatlinetimeline();

        // Capture the request and set response.
        request = mostRecentAjaxRequest();
        request.response(itemsResponse);

    });

    describe('_create', function() {

        it('stub', function() {

        });

    });

});
