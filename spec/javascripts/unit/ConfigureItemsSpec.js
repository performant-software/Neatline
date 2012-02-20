/*
 * Unit tests for the items configuration dropdown.
 */

describe('Configure Items', function() {

    var tab;

    beforeEach(function() {

        // Get editor markup.
        loadFixtures('editor.html');

        // Get dropdown tab.
        tab = $('#configure-items-button');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Run the widget.
        tab.configureitems();

    });

    afterEach(function() {

        // Purge markup outside of the fixtures container by the .js.
        $('#configure-items').remove();

    });

    describe('saveOrder', function() {

        it('should post a well-formed request with the arrangement params', function() {

            // Set an ordering, call saveOrder, capture outgoing request.
            tab.configureitems('setOrder', { 3:0, 2:1, 1:2 });
            tab.configureitems('saveOrder');
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('order%5B3%5D=0');
            expect(post.params).toContain('order%5B2%5D=1');
            expect(post.params).toContain('order%5B1%5D=2');

        });

        it('should trigger the save request when the "Save " button is pressed', function() {

            tab.configurelayout('getAttr', 'saveButton').mousedown();
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('order%5B3%5D=0');
            expect(post.params).toContain('order%5B2%5D=1');
            expect(post.params).toContain('order%5B1%5D=2');

        });

    });

});
