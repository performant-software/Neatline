/*
 * Unit tests for the timeline configuration dropdown.
 */

describe('Configure Timeline', function() {

    var tab;

    beforeEach(function() {

        // Get editor markup.
        loadFixtures('editor.html');

        // Get dropdown tab.
        tab = $('#configure-timeline-button');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Run the widget.
        tab.configuretimeline();

    });

    afterEach(function() {

        // Purge markup outside of the fixtures container by the .js.
        $('#configure-timeline').remove();

    });

    describe('postSettings', function() {

        it('should post a well-formed request with the timeline styles', function() {

            // Set form values.
            tab.configuretimeline('getAttr', 'bandActive').prop('checked', true);
            tab.configuretimeline('getAttr', 'bandUnit').val('week');
            tab.configuretimeline('getAttr', 'bandHeight').val('50');

            // Call saveItemForm, capture outgoing request.
            tab.configuretimeline('postSettings');
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('is_context_band=1');
            expect(post.params).toContain('context_band_unit=week');
            expect(post.params).toContain('context_band_height=50');

        });

        it('should trigger the save request when the "Save" button is pressed', function() {

            // Set form values.
            tab.configuretimeline('getAttr', 'bandActive').prop('checked', true);
            tab.configuretimeline('getAttr', 'bandUnit').val('week');
            tab.configuretimeline('getAttr', 'bandHeight').val('50');

            // Trigger click on "Save" button.
            tab.configuretimeline('getAttr', 'saveButton').mousedown();
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('is_context_band=1');
            expect(post.params).toContain('context_band_unit=week');
            expect(post.params).toContain('context_band_height=50');

        });

    });

});
