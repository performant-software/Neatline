/*
 * Unit tests for the item form manager.
 */

describe('Item Form', function() {

    var browser, form,
        record, recordId,
        itemRecord, itemRecordId,
        noRecordItem, formContainer;

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

    // Mock server error.
    var errorResponse = {
        status: 500,
        responseText: ''
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

        // Get Neatline-native testing record.
        record = browser.find('tr.item-row[recordid="1"]');
        recordId = parseInt(record.attr('recordid'), 10);

        // Get Omeka item testing record with extant recordid.
        itemRecord = browser.find('tr.item-row[recordid="4"]');
        itemRecordId = parseInt(itemRecord.attr('recordid'), 10);

        // Get Omeka item testing record without extant recordid.
        noRecordItem = browser.find('tr.item-row[itemid="4"]');

        // Get the form container.
        formContainer = record.next('tr').find('td');

    });

    afterEach(function() {

        // Purge markup outside of the fixtures container by the .js.
        $('span.intdragger-tooltip').remove();
        $('div.cleditorList').remove();
        $('div.cleditorPopup').remove();

    });

    describe('showForm', function() {

        var _db;

        beforeEach(function() {

            // Show the form.
            record.find('.item-title').mousedown();

        });

        it('should post proper request parameters for an item without an itemid', function() {

            // Show the form and capture request.
            record.find('.item-title').mousedown();
            var request = mostRecentAjaxRequest();

            // Check params.
            expect(request.url).toContain('item_id=null');
            expect(request.url).toContain('record_id=1');
            expect(request.url).toContain('exhibit_id=1');

        });

        it('should post proper request parameters for an item without a recordid', function() {

            // Show the form and capture request.
            noRecordItem.find('.item-title').mousedown();
            var request = mostRecentAjaxRequest();

            // Check params.
            expect(request.url).toContain('item_id=4');
            expect(request.url).toContain('record_id=null');
            expect(request.url).toContain('exhibit_id=1');

        });

        it('should append and display the form on show', function() {

            // Check for the form markup in the container.
            expect(formContainer).toContain(form);
            expect(form).toBeVisible();

        });

        it('should enable the save button when the data request succeeds', function() {

            // Set successful response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            expect(
                form.itemform('getAttr', 'saveButton')
            ).not.toHaveAttr('disabled');

        });

        it('should enable the delete button when the data request succeeds', function() {

            // Set successful response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            expect(
                form.itemform('getAttr', 'deleteButton')
            ).not.toHaveAttr('disabled');

        });

        it('should not enable the save button when the data request fails', function() {

            // Set failure response.
            request = mostRecentAjaxRequest();
            request.response(errorResponse);

            expect(
                form.itemform('getAttr', 'saveButton')
            ).toHaveAttr('disabled');

        });

        it('should not enable the delete button when the data request fails', function() {

            // Set failure response.
            request = mostRecentAjaxRequest();
            request.response(errorResponse);

            expect(
                form.itemform('getAttr', 'deleteButton')
            ).toHaveAttr('disabled');

        });

        it('should show the delete button when there is no itemid on the record', function() {

            // Set failure response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            expect(
                form.itemform('getAttr', 'deleteButton').css('visibility')
            ).toEqual('visible');

        });

        it('should not show the delete button when there is an itemid on the record', function() {

            // Show the form.
            form.itemform('showForm', itemRecord);

            // Set failure response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            expect(
                form.itemform('getAttr', 'deleteButton').css('visibility')
            ).not.toEqual('visible');

        });

        it('should populate the edit form with data', function() {

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            // Check the inputs for the correct values.
            expect(form.itemform('getAttr', 'title').val()).toEqual('Test Title 1');
            // expect(form.itemform('getAttr', 'slug').val()).toEqual('test-slug');
            expect(form.itemform('getAttr', 'description').val()).toEqual('Test description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('June 25, 1987');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('June 26, 1987');
            expect(form.itemform('getAttr', 'startVisibleDate').val()).toEqual('June 27, 1987');
            expect(form.itemform('getAttr', 'endVisibleDate').val()).toEqual('June 28, 1987');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#ffff00');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('20');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('80');
            expect(form.itemform('getAttr', 'graphicOpacity').val()).toEqual('100');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('3');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('5');
            expect(form.itemform('getAttr', 'parentRecord').val()).toEqual('2');

            // Check parent item select.
            var parentRecord = form.itemform('getAttr', 'parentRecord');
            var options = parentRecord.find('option');
            expect(options.length).toEqual(3);
            expect($(options[0]).val()).toEqual('none');
            expect($(options[0]).text()).toEqual('-');
            expect($(options[1]).val()).toEqual('2');
            expect($(options[1]).text()).toEqual('Test Title 2');
            expect($(options[2]).val()).toEqual('3');
            expect($(options[2]).text()).toEqual('Test Title 3');

        });

    });

    describe('hideForm', function() {

        var _db, recordId;

        beforeEach(function() {

            // Show the form, get the database.
            form.itemform('showForm', record);
            _db = form.itemform('getAttr', '_db');
            recordId = parseInt(record.attr('recordid'), 10);

            // Clear out the records database.
            form.itemform('clearLocalData');

        });

    });

    describe('saveItemForm', function() {

        beforeEach(function() {

            // Show the form, push in stub data.
            form.itemform('showForm', record);
            request = mostRecentAjaxRequest();
            request.response(formResponse);

        });

        it('should post a well-formed request with the form data', function() {

            // Call saveItemForm, capture outgoing request.
            form.itemform('saveItemForm');
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('title=Test+Title');
            // expect(post.params).toContain('slug=test-slug');
            expect(post.params).toContain('description=Test+description.');
            expect(post.params).toContain('start_date=June+25%2C+1987');
            expect(post.params).toContain('end_date=June+26%2C+1987');
            expect(post.params).toContain('vector_color=%23ffffff');
            expect(post.params).toContain('stroke_color=%23000000');
            expect(post.params).toContain('highlight_color=%23ffff00');
            expect(post.params).toContain('vector_opacity=20');
            expect(post.params).toContain('stroke_opacity=80');
            expect(post.params).toContain('graphic_opacity=100');
            expect(post.params).toContain('stroke_width=3');
            expect(post.params).toContain('point_radius=5');

        });

        it('should trigger the save request when the "Save" button is pressed');

    });

    describe('postMapFocus', function() {

        beforeEach(function() {

            // Show the form, push in stub data.
            form.itemform('showForm', itemRecord);
            request = mostRecentAjaxRequest();
            request.response(formResponse);

        });

        it('should post a well-formed request with the extent and zoom data', function() {

            // Call saveItemForm, capture outgoing request.
            form.itemform('postMapFocus', '1.1,2.2,3.3,4.4', 5);
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('item_id=3');
            expect(post.params).toContain('record_id=4');
            expect(post.params).toContain('exhibit_id=1');
            expect(post.params).toContain('center=1.1%2C2.2%2C3.3%2C4.4');
            expect(post.params).toContain('zoom=5');

        });

    });

    describe('postRecordDelete', function() {

        beforeEach(function() {

            // Show the form, push in stub data.
            form.itemform('showForm', itemRecord);
            request = mostRecentAjaxRequest();
            request.response(formResponse);

        });

        it('should post a well-formed request with the exhibit id and record id', function() {

            // Call saveItemForm, capture outgoing request.
            form.itemform('postRecordDelete');
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('record_id=4');
            expect(post.params).toContain('exhibit_id=1');

        });

    });

    describe('postResetStyles', function() {

        beforeEach(function() {

            // Show the form, push in stub data.
            form.itemform('showForm', itemRecord);
            request = mostRecentAjaxRequest();
            request.response(formResponse);

        });

        it('should post a well-formed request with the exhibit id and record id', function() {

            // Call saveItemForm, capture outgoing request.
            form.itemform('postResetStyles');
            var post = mostRecentAjaxRequest();

            // Check params.
            expect(post.params).toContain('record_id=4');
            expect(post.params).toContain('exhibit_id=1');

        });

    });

});
