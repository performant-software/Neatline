/*
 * Unit tests for the item form manager.
 */

describe('Item Form', function() {

    var browser,
        form,
        record,
        formContainer;

    // Mock _getItems() response.
    var itemsResponse = {
        status: 200,
        responseText: readFixtures('editor-items-ajax.html')
    };

    // Mock _getFormData() response.
    var formResponse = {
        status: 200,
        responseText: readFixtures('editor-form-ajax.html')
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

        beforeEach(function() {

            // Show the form.
            form.itemform('showForm', record);

        });

        it('should append and display the form on show', function() {

            // Check for the form markup in the container.
            expect(formContainer).toContain(form);
            expect(form).toBeVisible();

        });

        it('should populate the edit form with data', function() {

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            // Check the inputs for the correct values.
            expect(form.itemform('getAttr', 'title').val()).toEqual('Test Title');
            expect(form.itemform('getAttr', 'description').val()).toEqual('Test description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('June 25, 1987');
            expect(form.itemform('getAttr', 'startTime').val()).toEqual('6:00 am');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('June 26, 1987');
            expect(form.itemform('getAttr', 'endTime').val()).toEqual('6:01 am');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#ffff00');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('20');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('80');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('3');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('5');

        });

    });

    describe('save', function() {

    });

});
