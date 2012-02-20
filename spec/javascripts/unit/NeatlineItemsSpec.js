/*
 * Unit tests for the items block.
 */

describe('Neatline Items', function() {

    var items, request, container, itemsResponse;
    var itemClick, itemEnter, itemLeave;

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

        // Create spies for events.
        itemClick = jasmine.createSpy('itemclick');
        itemEnter = jasmine.createSpy('itementer');
        itemLeave = jasmine.createSpy('itemleave');

        // Run the widget and wire up event spies.
        items.neatlineitems({
            'itemclick': itemClick,
            'itementer': itemEnter,
            'itemleave': itemLeave
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

        var title;

        beforeEach(function() {

            // Get a title, reset expanded tracker.
            title = container.find('li.item-title').first();
            title.data('expanded', false);

        });

        it('should issue itemclick on mousedown when title is not expanded', function() {
            title.mousedown();
            expect(itemClick).toHaveBeenCalled();
        });

        it('should not issue itemclick on mousedown when title is not expanded', function() {
            title.data('expanded', true);
            title.mousedown();
            expect(itemClick).not.toHaveBeenCalled();
        });

        it('should issue itementer even on mouseenter on title', function() {
            title.mouseenter();
            expect(itemEnter).toHaveBeenCalled();
        });

        it('should issue itementer even on mouseleave on title', function() {
            title.mouseleave();
            expect(itemLeave).toHaveBeenCalled();
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

                it('should return the last id when the current id is the first', function() {

                    // 1 -> 4
                    items.neatlineitems('setAttr', '_currentItemId', 1);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(4);

                });

                it('should return the previous id when the current id is not the first', function() {

                    // 2 -> 1
                    items.neatlineitems('setAttr', '_currentItemId', 2);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(1);

                    // 3 -> 2
                    items.neatlineitems('setAttr', '_currentItemId', 3);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(2);

                    // 4 -> 3
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

                it('should return the first id when the current id is the last', function() {

                    // 4 -> 1
                    items.neatlineitems('setAttr', '_currentItemId', 4);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(1);

                });

                it('should return the next id when the current id is not the last', function() {

                    // 1 -> 2
                    items.neatlineitems('setAttr', '_currentItemId', 1);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(2);

                    // 2 -> 3
                    items.neatlineitems('setAttr', '_currentItemId', 2);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(3);

                    // 3 -> 4
                    items.neatlineitems('setAttr', '_currentItemId', 3);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(4);

                });

            });

        });

    });

    describe('scrollLeft', function() {

        it('should issue the item click event', function() {
            items.neatlineitems('scrollLeft');
            expect(itemClick).toHaveBeenCalled();
        });

    });

    describe('scrollRight', function() {

        it('should issue the item click event', function() {
            items.neatlineitems('scrollRight');
            expect(itemClick).toHaveBeenCalled();
        });

    });

    describe('scrollToItem', function() {

        beforeEach(function() {

            // Null out the current record id tracker.
            items.neatlineitems('setAttr', '_currentItemId', null);
            items.neatlineitems('setAttr', '_currentItem', null);

        });

        it('should do nothing when there is no record with the passed id', function() {

            // Set current id, call with non-existent id.
            items.neatlineitems('setAttr', '_currentItemId', 1);
            items.neatlineitems('scrollToItem', 5);

            // Current id should be unchanged.
            expect(items.neatlineitems('getAttr', '_currentItemId')).toEqual(1);

        });

        it('should scroll to the record when a valid id is passed', function() {

            // Call with valid id.
            items.neatlineitems('scrollToItem', 4);

            // Check for changed current id and expanded item.
            expect(items.neatlineitems('getAttr', '_currentItemId')).toEqual(4);
            expect(items.neatlineitems('getAttr', '_currentItem')).toHaveData('expanded', true);

        });

    });

    describe('expand/contract description', function() {

        var title, description, recordId;

        beforeEach(function() {

            // Get a title, reset expanded tracker.
            title = container.find('li.item-title').first();
            description = title.next('li');
            recordId = parseInt(title.attr('recordid'), 10);

        });

        describe('expandDescription', function() {

            beforeEach(function() {

                // Reset expanded status.
                title.data('expanded', false);

                // Null out the current record id tracker.
                items.neatlineitems('setAttr', '_currentItemId', null);
                items.neatlineitems('setAttr', '_currentItem', null);

            });

            it('should set status trackers', function() {

                items.neatlineitems('expandDescription', title);

                // Check trackers.
                expect(items.neatlineitems('getAttr', '_currentItem')).toEqual(title);
                expect(items.neatlineitems('getAttr', '_currentItemId')).toEqual(recordId);
                expect(title).toHaveData('expanded', true);

            });

            it('should expand the description');

            it('should not expand the description when the description is empty', function() {

                // Get the listing for the last item, with no description.
                var lastTitle = container.find('li.item-title').last();

                // Call the method, check description visibility.
                items.neatlineitems('expandDescription', lastTitle);
                expect(description.css('display')).toEqual('none');

            });

        });

        describe('contractDescription', function() {

            beforeEach(function() {

                // Expand the record.
                items.neatlineitems('expandDescription', title);

            });

            it('should clear out status trackers', function() {

                items.neatlineitems('contractDescription', title);

                // Check for null/false trackers.
                expect(items.neatlineitems('getAttr', '_currentItem')).toBeNull();
                expect(items.neatlineitems('getAttr', '_currentItemId')).toBeNull();
                expect(title).toHaveData('expanded', false);

            });

            it('should contract the description');

        });

    });

});
