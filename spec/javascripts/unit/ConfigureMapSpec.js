/*
 * Unit tests for the map configuration dropdown.
 */

describe('Item Form', function() {

    var tab;

    beforeEach(function() {

        // Get editor markup.
        loadFixtures('editor.html');

        // Get dropdown tab.
        tab = $('#configure-map-button');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Run the widget.
        tab.configuremap();

    });

    describe('postSettings', function() {

        it('should post a well-formed request with the map styles', function() {

            // Set form values.
            tab.configuremap('getAttr', 'vectorColor').val('#ffffff');
            tab.configuremap('getAttr', 'strokeColor').val('#000000');
            tab.configuremap('getAttr', 'highlightColor').val('#ffffff');
            tab.configuremap('getAttr', 'vectorOpacity').val(50);
            tab.configuremap('getAttr', 'strokeOpacity').val(60);
            tab.configuremap('getAttr', 'strokeWidth').val(10);
            tab.configuremap('getAttr', 'pointRadius').val(11);
            tab.configuremap('getAttr', 'baseLayer').val(2);

            // Call saveItemForm, capture outgoing request.
            tab.configuremap('postSettings');
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('vector_color=%23ffffff');
            expect(post.params).toContain('stroke_color=%23000000');
            expect(post.params).toContain('highlight_color=%23ffffff');
            expect(post.params).toContain('vector_opacity=50');
            expect(post.params).toContain('stroke_opacity=60');
            expect(post.params).toContain('stroke_width=10');
            expect(post.params).toContain('point_radius=11');
            expect(post.params).toContain('base_layer=2');

        });

    });

    describe('_constructFormWidgets', function() {

        it('should trigger the save request when the "Save" button is pressed', function() {

            // Set form values.
            tab.configuremap('getAttr', 'vectorColor').val('#ffffff');
            tab.configuremap('getAttr', 'strokeColor').val('#000000');
            tab.configuremap('getAttr', 'highlightColor').val('#ffffff');
            tab.configuremap('getAttr', 'vectorOpacity').val(50);
            tab.configuremap('getAttr', 'strokeOpacity').val(60);
            tab.configuremap('getAttr', 'strokeWidth').val(10);
            tab.configuremap('getAttr', 'pointRadius').val(11);
            tab.configuremap('getAttr', 'baseLayer').val(2);

            // Call saveItemForm, capture outgoing request.
            tab.configuremap('getAttr', 'saveButton').mousedown();
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('vector_color=%23ffffff');
            expect(post.params).toContain('stroke_color=%23000000');
            expect(post.params).toContain('highlight_color=%23ffffff');
            expect(post.params).toContain('vector_opacity=50');
            expect(post.params).toContain('stroke_opacity=60');
            expect(post.params).toContain('stroke_width=10');
            expect(post.params).toContain('point_radius=11');
            expect(post.params).toContain('base_layer=2');

        });

    });

});
