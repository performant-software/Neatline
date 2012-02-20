/*
 * Unit tests for the timeline block.
 */

describe('Neatline Timeline', function() {

    var timeline, server;

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get container.
        timeline = $('#timeline');

        // Install Sinon fake server.
        server = sinon.fakeServer.create();

        // Define events json response.
        server.respondWith(
            [200, {}, readFixtures('timeline-data-ajax.html')],
            readFixtures('timeline-data-ajax.html')
        );

        // Instantiate the widget.
        // timeline.neatlinetimeline();
        server.respond();

    });

    afterEach(function() {
        server.restore();
    });

    describe('_create', function() {

        it('should load events', function() {


        });

    });

});
