/*
 * Unit tests for the layout configuration dropdown.
 */

describe('Configure Layout', function() {

    var tab;

    beforeEach(function() {

        // Get editor markup.
        loadFixtures('editor.html');

        // Get dropdown tab.
        tab = $('#configure-layout-button');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Run the widget.
        tab.configurelayout();

    });

    describe('saveArrangement', function() {

        it('should post a well-formed request with the arrangement params', function() {

            // Call saveItemForm, capture outgoing request.
            tab.configurelayout('saveArrangement');
            var post = mostRecentAjaxRequest();
            console.log(post);

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('is_map=1');
            expect(post.params).toContain('is_timeline=1');
            expect(post.params).toContain('is_items=1');
            expect(post.params).toContain('top_element=map');
            expect(post.params).toContain('items_h_pos=right');
            expect(post.params).toContain('items_v_pos=top');
            expect(post.params).toContain('items_height=full');
            expect(post.params).toContain('h_percent=50');
            expect(post.params).toContain('v_percent=60');

        });

        it('should trigger the save request when the "Save Arrangement" button is pressed');

    });

});
