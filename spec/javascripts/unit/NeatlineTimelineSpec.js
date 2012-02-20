/*
 * Unit tests for the timeline block.
 */

describe('Neatline Timeline', function() {

    var timeline;

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get container.
        timeline = $('#timeline');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Instantiate the widget.
        // timeline.neatlinetimeline();

    });

    describe('_create', function() {

        it('should load events');

    });

});
