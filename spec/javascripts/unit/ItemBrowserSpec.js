/*
 * Unit tests for the Neatline positioning manager.
 */

describe('Item Browser', function() {

    // Mock the id attribute on the Neatline global.
    Neatline = { id: 1 };

    describe('_create', function() {

        var browser;

        beforeEach(function() {

            // Get exhibit markup.
            loadFixtures('item-browser.html');

            // Get container and set dimensions.
            browser = $('#item-browser');
            browser.css({ 'width': 400, 'height': 1000 });

            // Run the browser.
            browser.itembrowser();

        });

        it('should select component markup', function() {

            expect(browser.itembrowser('getAttr', 'topBar')).toBe('#topbar');
            expect(browser.itembrowser('getAttr', 'searchWrapper')).toBe('#search-wrapper');
            expect(browser.itembrowser('getAttr', 'searchBox')).toBe('#search-box');
            expect(browser.itembrowser('getAttr', 'itemsList')).toBe('#items-list-container');
            expect(browser.itembrowser('getAttr', 'itemsListHeader')).toBe('#items-list-header');
            expect(browser.itembrowser('getAttr', 'searchCancel')).toBe('#search-cancel');
            expect(browser.itembrowser('getAttr', 'itemFilterContainer')).toBe('#filter-items');
            expect(browser.itembrowser('getAttr', 'neatlineContainer')).toBe('#neatline');
            expect(browser.itembrowser('getAttr', 'itemsTable')).toBe('#items-table');
            expect(browser.itembrowser('getAttr', 'dragTip')).toBe('#drag-tip');
            expect(browser.itembrowser('getAttr', 'spaceTip')).toBe('#space-tip');
            expect(browser.itembrowser('getAttr', 'timeTip')).toBe('#time-top');
            expect(browser.itembrowser('getAttr', 'spaceHeader')).toBe('#div.col-1.col-header span.header');
            expect(browser.itembrowser('getAttr', 'timeHeader')).toBe('div.col-2.col-header span.header');
            expect(browser.itembrowser('getAttr', 'editForm')).toBe('#edit-form');
            expect(browser.itembrowser('getAttr', 'newItemButton')).toBe('#new-item-button');

        });

        it('should define starting values for tracker variables', function() {

            expect(browser.itembrowser('getAttr', '_searchString')).toEqual('');
            expect(browser.itembrowser('getAttr', '_currentFormItem')).toBeNull();
            expect(browser.itembrowser('getAttr', '_spaceBoxes')).toBeNull();
            expect(browser.itembrowser('getAttr', '_timeBoxes')).toBeNull();
            expect(browser.itembrowser('getAttr', '_spaceSorted')).toBeFalsy();
            expect(browser.itembrowser('getAttr', '_timeSorted')).toBeFalsy();
            expect(browser.itembrowser('getAttr', '_firstRequest')).toBeTruthy();
            expect(browser.itembrowser('getAttr', '_scrollbarWidth')).toBeDefined();
            expect(browser.itembrowser('getAttr', '_scrollbarWidth')).toBeGreaterThan(1);

        });

    });

    describe('positioning', function() {

    });

    describe('drag handle', function() {

    });

    describe('search box', function() {

    });

    describe('item filter', function() {

    });

    describe('new item', function() {

    });

    describe('form manager', function() {

    });

});
