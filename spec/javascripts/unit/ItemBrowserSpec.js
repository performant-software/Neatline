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

            expect(browser.itembrowser('getAttr', '_window')).toBeDefined();
            expect(browser.itembrowser('getAttr', '_window')).not.toBeNull();
            expect(browser.itembrowser('getAttr', '_body')).toBeDefined();
            expect(browser.itembrowser('getAttr', '_body')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'topBar')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'topBar')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'searchWrapper')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'searchWrapper')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'searchBox')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'searchBox')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'itemsList')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'itemsList')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'itemsListHeader')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'itemsListHeader')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'searchCancel')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'searchCancel')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'itemFilterContainer')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'itemFilterContainer')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'neatlineContainer')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'neatlineContainer')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'itemsTable')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'itemsTable')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'dragTip')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'dragTip')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'spaceTip')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'spaceTip')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'timeTip')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'timeTip')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'spaceHeader')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'spaceHeader')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'timeHeader')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'timeHeader')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'editForm')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'editForm')).not.toBeNull();
            expect(browser.itembrowser('getAttr', 'newItemButton')).toBeDefined();
            expect(browser.itembrowser('getAttr', 'newItemButton')).not.toBeNull();

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
