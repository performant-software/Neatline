/*
 * Unit tests for the item form manager.
 */

describe('Item Form', function() {

    var browser,
        form,
        record,
        formContainer;

    // Mock _getItems() response.
    itemsResponse = {
        status: 200,
        responseText: readFixtures('editor-items-ajax.html')
    };

    beforeEach(function() {

        // Get editor markup.
        loadFixtures('editor.html');

        // Get container and set dimensions.
        browser = $('#item-browser');
        form = $('#edit-form');

        // Install AJAX mock.
        jasmine.Ajax.useMock();

        // Run the browser and form managers.
        browser.itembrowser();
        form.itemform();

        // Capture the request and set response.
        request = mostRecentAjaxRequest();
        request.response(itemsResponse);

        // Get testing records and their form containers.
        record = browser.find('tr.item-row[recordid="1"]');
        formContainer = record.next('tr').find('td');

    });

    describe('show', function() {

        it('should append and display the form on show', function() {

            // Show the form for the Neatline-endemic record.
            form.itemform('showForm', record);

            // Check for the form markup in the container.
            expect(formContainer).toContain(form);
            expect(form).toBeVisible();

        });

    });

    describe('save', function() {

    });

});
