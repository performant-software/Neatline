/*
 * Unit tests for the items block.
 */

describe('Neatline Items', function() {

    var items, request, container, stubCallbacks;

    // Mock _getItems() response.
    itemsResponse = {
        status: 200,
        responseText: readFixtures('public-items-ajax.html')
    };

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get container and set dimensions.
        items = $('#items');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Define _trigger callback stubs.
        stubCallbacks = {
            'itemClick': function(event, obj) { return; },
            'itemEnter': function(event, obj) { return; },
            'itemLeave': function(event, obj) { return; }
        };

        // Add spies to callback methods.
        spyOn(stubCallbacks, 'itemClick');
        spyOn(stubCallbacks, 'itemEnter');
        spyOn(stubCallbacks, 'itemLeave');

        // Run the widget and wire up event spies.
        items.neatlineitems({
            'itemclick': stubCallbacks.itemClick,
            'itementer': stubCallbacks.itemEnter,
            'itemleave': stubCallbacks.itemLeave
        });

        // Get list container.
        container = items.neatlineitems('getAttr', 'listContainer');

        // Capture the request and set response.
        request = mostRecentAjaxRequest();
        request.response(itemsResponse);

    });

    describe('_create', function() {

        it('should load items', function() {

            // Check for markup presence.
            expect(container).not.toBeEmpty();
            expect(container).toContain($('ul'));
            expect(container).toContain($('ul li.item-title[recordid="1"]'));
            expect(container).toContain($('ul li.item-title[recordid="2"]'));
            expect(container).toContain($('ul li.item-title[recordid="3"]'));
            expect(container).toContain($('ul li.item-title[recordid="4"]'));

        });

    });

    describe('_glossItems', function() {

        var title, id;

        beforeEach(function() {
            // Get a title, reset expanded tracker.
            title = container.find('li.item-title').first();
            title.data('expanded', false);
            id = title.attr('recordid');
        });

        it('should issue itemclick on mousedown on title when title is not expanded', function() {
            title.mousedown();
            expect(stubCallbacks.itemClick).toHaveBeenCalledWith({}, { recordid: id });
        });

        it('should not issue itemclick on mousedown on title when title is not expanded', function() {
            title.data('expanded', true);
            title.mousedown();
            expect(stubCallbacks.itemClick).not.toHaveBeenCalled();
        });

        it('should issue itementer even on mouseenter on title', function() {
            title.mouseenter();
            expect(stubCallbacks.itemEnter).toHaveBeenCalledWith({}, { recordid: id });
        });

        it('should issue itementer even on mouseleave on title', function() {
            title.mouseleave();
            expect(stubCallbacks.itemLeave).toHaveBeenCalledWith({}, { recordid: id });
        });

        it('should populate the _idOrdering array', function() {
            expect(
                items.neatlineitems('getAttr', '_idOrdering')
            ).toEqual([1,2,3,4]);
        });

    });

    describe('getNewScrollId', function() {

        beforeEach(function() {
            // Null out the current record id tracker.
            items.neatlineitems('setAttr', '_currentItemId', null);
        });

        describe('left', function() {

            describe('when there is no set current record id', function() {

                it('should default to the last record in the ordering', function() {
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(4);
                });

            });

            describe('when there is a current record id', function() {

                it('should return the last record when the current id is the first record', function() {
                    items.neatlineitems('setAttr', '_currentItemId', 1);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(4);
                });

                it('should return the previous record when the current id is not the first record', function() {
                    items.neatlineitems('setAttr', '_currentItemId', 2);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(1);
                    items.neatlineitems('setAttr', '_currentItemId', 3);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(2);
                    items.neatlineitems('setAttr', '_currentItemId', 4);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(3);
                });

            });

        });

        describe('right', function() {

            describe('when there is no set current record id', function() {

                it('should default to the first record in the ordering', function() {
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(1);
                });

            });

            describe('when there is a current record id', function() {

                it('should return the first record when the current id is the last record', function() {
                    items.neatlineitems('setAttr', '_currentItemId', 4);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(1);
                });

                it('should return the next record when the current id is not the last record', function() {
                    items.neatlineitems('setAttr', '_currentItemId', 1);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(2);
                    items.neatlineitems('setAttr', '_currentItemId', 2);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(3);
                    items.neatlineitems('setAttr', '_currentItemId', 3);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(4);
                });

            });



        });

    });

});
