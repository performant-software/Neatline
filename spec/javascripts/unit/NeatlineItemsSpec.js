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
            expect(container.find('li.item-title').length).toEqual(4);
            expect(container.find('li.item-description').length).toEqual(4);

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
            items.neatlineitems('setAttr', '_currentRecordId', null);

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
                    items.neatlineitems('setAttr', '_currentRecordId', 1);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(4);

                });

                it('should return the previous id when the current id is not the first', function() {

                    // 2 -> 1
                    items.neatlineitems('setAttr', '_currentRecordId', 2);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(1);

                    // 3 -> 2
                    items.neatlineitems('setAttr', '_currentRecordId', 3);
                    expect(items.neatlineitems('getNewScrollId', 'left')).toEqual(2);

                    // 4 -> 3
                    items.neatlineitems('setAttr', '_currentRecordId', 4);
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
                    items.neatlineitems('setAttr', '_currentRecordId', 4);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(1);

                });

                it('should return the next id when the current id is not the last', function() {

                    // 1 -> 2
                    items.neatlineitems('setAttr', '_currentRecordId', 1);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(2);

                    // 2 -> 3
                    items.neatlineitems('setAttr', '_currentRecordId', 2);
                    expect(items.neatlineitems('getNewScrollId', 'right')).toEqual(3);

                    // 3 -> 4
                    items.neatlineitems('setAttr', '_currentRecordId', 3);
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
            items.neatlineitems('setAttr', '_currentRecordId', null);
            items.neatlineitems('setAttr', '_currentRecord', null);

        });

        it('should do nothing when there is no record with the passed id', function() {

            // Set current id, call with non-existent id.
            items.neatlineitems('setAttr', '_currentRecordId', 1);
            items.neatlineitems('scrollToItem', 5);

            // Current id should be unchanged.
            expect(items.neatlineitems('getAttr', '_currentRecordId')).toEqual(1);

        });

        it('should scroll to the record when a valid id is passed', function() {

            // Call with valid id.
            items.neatlineitems('scrollToItem', 4);

            // Check for changed current id and expanded item.
            expect(items.neatlineitems('getAttr', '_currentRecordId')).toEqual(4);
            expect(items.neatlineitems('getAttr', '_currentRecord').title).toHaveData('expanded', true);

        });

    });

    describe('expand/contract description', function() {

        var record;

        // Get the first record.
        beforeEach(function() {
            record = items.neatlineitems('getAttr', '_db')({}).first();
        });

        describe('expandDescription', function() {

            beforeEach(function() {

                // Null out the current record id tracker.
                items.neatlineitems('setAttr', '_currentRecordId', null);
                items.neatlineitems('setAttr', '_currentRecord', null);

            });

            it('should set status trackers', function() {

                items.neatlineitems('expandDescription', record);

                // Check trackers.
                expect(items.neatlineitems('getAttr', '_currentRecord')).toEqual(record);
                expect(items.neatlineitems('getAttr', '_currentRecordId')).toEqual(record.recordid);
                expect(record.title).toHaveData('expanded', true);

            });

            it('should expand the description', function() {

                // Expand description and tick clock.
                items.neatlineitems('expandDescription', record);

                // Check display and height.
                expect(record.description.css('display')).toEqual('list-item');

            });

            it('should not expand the description when the description is empty', function() {

                // Empty out the description.
                record.description.empty();

                // Call the method, check description visibility.
                items.neatlineitems('expandDescription', record);
                expect(record.description.css('display')).toEqual('none');

            });

        });

        describe('contractDescription', function() {

            // Expand the record.
            beforeEach(function() {
                items.neatlineitems('expandDescription', record);
            });

            it('should clear out status trackers', function() {

                items.neatlineitems('contractDescription', record);

                // Check for null/false trackers.
                expect(items.neatlineitems('getAttr', '_currentRecord')).toBeNull();
                expect(items.neatlineitems('getAttr', '_currentRecordId')).toBeNull();
                expect(record.title).toHaveData('expanded', false);

            });

            it('should contract the description');

        });

    });

});
