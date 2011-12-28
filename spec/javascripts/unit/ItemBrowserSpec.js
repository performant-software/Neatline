/*
 * Unit tests for the Neatline positioning manager.
 */

describe('Item Browser', function() {

    var browser;

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('editor.html');

        // Get container and set dimensions.
        browser = $('#item-browser');

        // Run the browser.
        browser.itembrowser();

    });

});
