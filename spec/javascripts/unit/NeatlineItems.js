/*
 * Unit tests for the items block.
 */

describe('Neatline Items', function() {

    var items;

    beforeEach(function() {

        // Get exhibit markup.
        loadFixtures('neatline-base.html');

        // Get container and set dimensions.
        items = $('#items');

        // Run the browser.
        items.neatlineitems();

    });

});
