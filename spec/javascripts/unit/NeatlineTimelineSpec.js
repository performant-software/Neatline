/*
 * Unit tests for the timeline block.
 */

describe('Neatline Timeline', function() {

    var timeline, xhr, requests;

    // Mock data response.
    dataResponse = {
        status: 200,
        responseText: readFixtures('timeline-data-ajax.html')
    };

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get container.
        timeline = $('#timeline');

        // Install Sinon fake XHR.
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(xhr) { requests.push(xhr); };

        // Instantiate the widget.
        timeline.neatlinetimeline();

    });

    afterEach(function() {
        xhr.restore();
    });

    describe('_create', function() {

        it('should load events', function() {


        });

    });

});
