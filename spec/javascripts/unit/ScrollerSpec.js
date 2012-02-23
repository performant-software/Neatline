/*
 * Unit tests for the forwards/backwards scroller.
 */

describe('Scroller', function() {

    // Markup globals.
    var container;
    var leftArrow;
    var rightArrow;

    // Define _trigger callback stubs.
    var stubCallbacks = {
        'left': function() { return; },
        'right': function() { return; }
    };

    // Load fixture and run the widget.
    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('scroll-arrows.html');

        // Get container and set dimensions.
        container = $('<div></div>');
        $('body').append(container);

        // Add spies to callback methods.
        spyOn(stubCallbacks, 'left');
        spyOn(stubCallbacks, 'right');

        // Run the scroller, bind _trigger callbacks.
        container.scroller({
            'left': stubCallbacks.left,
            'right': stubCallbacks.right
        });

    });

    afterEach(function() {
        // Remove the fixture.
        container.remove();
    });

    describe('_create', function() {

        it('should append the arrow markup to the container', function() {
            expect(container).toContain($('#scroll'));
            expect(container).toContain($('div.arrow-left'));
            expect(container).toContain($('div.arrow-right'));
        });

    });

    describe('click callbacks', function() {

        // Get the arrows.
        beforeEach(function() {
            leftArrow = container.find('#scroll div.arrow-left');
            rightArrow = container.find('#scroll div.arrow-right');
        });

        it('should trigger "left" event on left arrow mousedown', function() {

            // Mock click.
            leftArrow.trigger('mousedown');

            // Listen for method call.
            expect(stubCallbacks.left).toHaveBeenCalled();

        });

        it('should trigger "right" event on right arrow mousedown', function() {

            // Mock click.
            rightArrow.trigger('mousedown');

            // Listen for method call.
            expect(stubCallbacks.right).toHaveBeenCalled();

        });

    });

});
