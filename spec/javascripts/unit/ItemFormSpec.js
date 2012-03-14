/*
 * Unit tests for the item form manager.
 */

describe('Item Form', function() {

    var browser, form,
        record, recordId,
        itemRecord, itemRecordId,
        noRecordItem, noRecordItemId,
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
        noRecordItem = browser.find('tr.item-row[itemid="1"]');
        noRecordItemId = parseInt(noRecordItem.attr('recordid'), 10);

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
            expect(request.url).toContain('item_id=1');
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
            expect(form.itemform('getAttr', 'title').val()).toEqual('Test Title');
            expect(form.itemform('getAttr', 'description').val()).toEqual('Test description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('June 25, 1987');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('June 26, 1987');
            expect(form.itemform('getAttr', 'leftPercent').val()).toEqual('0');
            expect(form.itemform('getAttr', 'rightPercent').val()).toEqual('100');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#ffff00');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('20');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('80');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('3');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('5');

        });

        it('should reload saved local data when it exists', function() {

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            // Check the inputs for the correct values.
            expect(form.itemform('getAttr', 'title').val()).toEqual('Test Title');
            expect(form.itemform('getAttr', 'description').val()).toEqual('Test description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('June 25, 1987');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('June 26, 1987');
            expect(form.itemform('getAttr', 'leftPercent').val()).toEqual('0');
            expect(form.itemform('getAttr', 'rightPercent').val()).toEqual('100');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#ffff00');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('20');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('80');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('3');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('5');

            // Insert local data record for the item record.
            form.itemform('insertLocalData', {
                recordid: itemRecordId,
                data: {
                    title: 'New Title',
                    description: 'New description.',
                    start_date: 'April 26, 1564',
                    end_date: 'April 23, 1616',
                    left_percent: 20,
                    right_percent: 80,
                    vector_color: '#000000',
                    stroke_color: '#ffffff',
                    highlight_color: '#000000',
                    vector_opacity: 40,
                    stroke_opacity: 40,
                    stroke_width: 5,
                    point_radius: 6
                }
            });

            // Show the item record.
            itemRecord.find('.item-title').mousedown();

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            // Check the inputs for the correct values.
            expect(form.itemform('getAttr', 'title').val()).toEqual('New Title');
            expect(form.itemform('getAttr', 'description').val()).toEqual('New description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('April 26, 1564');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('April 23, 1616');
            expect(form.itemform('getAttr', 'leftPercent').val()).toEqual('20');
            expect(form.itemform('getAttr', 'rightPercent').val()).toEqual('80');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('40');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('40');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('5');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('6');


        });

        it('should enable the save button when local data is restored', function() {

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            // Check the inputs for the correct values.
            expect(form.itemform('getAttr', 'title').val()).toEqual('Test Title');
            expect(form.itemform('getAttr', 'description').val()).toEqual('Test description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('June 25, 1987');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('June 26, 1987');
            expect(form.itemform('getAttr', 'leftPercent').val()).toEqual('0');
            expect(form.itemform('getAttr', 'rightPercent').val()).toEqual('100');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#ffff00');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('20');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('80');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('3');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('5');

            // Insert local data record for the item record.
            form.itemform('insertLocalData', {
                recordid: itemRecordId,
                data: {
                    title: 'New Title',
                    description: 'New description.',
                    start_date: 'April 26, 1564',
                    end_date: 'April 23, 1616',
                    left_percent: 20,
                    right_percent: 80,
                    vector_color: '#000000',
                    stroke_color: '#ffffff',
                    highlight_color: '#000000',
                    vector_opacity: 40,
                    stroke_opacity: 40,
                    stroke_width: 5,
                    point_radius: 6
                }
            });

            // Show the item record.
            itemRecord.find('.item-title').mousedown();

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            expect(
                form.itemform('getAttr', 'saveButton')
            ).not.toHaveAttr('disabled');

        });

        it('should enable the delete button when local data is restored', function() {

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            // Check the inputs for the correct values.
            expect(form.itemform('getAttr', 'title').val()).toEqual('Test Title');
            expect(form.itemform('getAttr', 'description').val()).toEqual('Test description.');
            expect(form.itemform('getAttr', 'startDate').val()).toEqual('June 25, 1987');
            expect(form.itemform('getAttr', 'endDate').val()).toEqual('June 26, 1987');
            expect(form.itemform('getAttr', 'leftPercent').val()).toEqual('0');
            expect(form.itemform('getAttr', 'rightPercent').val()).toEqual('100');
            expect(form.itemform('getAttr', 'vectorColor').val()).toEqual('#ffffff');
            expect(form.itemform('getAttr', 'strokeColor').val()).toEqual('#000000');
            expect(form.itemform('getAttr', 'highlightColor').val()).toEqual('#ffff00');
            expect(form.itemform('getAttr', 'vectorOpacity').val()).toEqual('20');
            expect(form.itemform('getAttr', 'strokeOpacity').val()).toEqual('80');
            expect(form.itemform('getAttr', 'strokeWidth').val()).toEqual('3');
            expect(form.itemform('getAttr', 'pointRadius').val()).toEqual('5');

            // Insert local data record for the item record.
            form.itemform('insertLocalData', {
                recordid: itemRecordId,
                data: {
                    title: 'New Title',
                    description: 'New description.',
                    start_date: 'April 26, 1564',
                    end_date: 'April 23, 1616',
                    left_percent: 20,
                    right_percent: 80,
                    vector_color: '#000000',
                    stroke_color: '#ffffff',
                    highlight_color: '#000000',
                    vector_opacity: 40,
                    stroke_opacity: 40,
                    stroke_width: 5,
                    point_radius: 6
                }
            });

            // Show the item record.
            itemRecord.find('.item-title').mousedown();

            // Capture the request and set response.
            request = mostRecentAjaxRequest();
            request.response(formResponse);

            expect(
                form.itemform('getAttr', 'deleteButton')
            ).not.toHaveAttr('disabled');

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

        describe('unsaved data persistence', function() {

            it('should store local data when the title is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'title').val('New Title');
                form.itemform('getAttr', 'titleEditor').updateFrame().refresh();
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.title).toEqual('New Title');

            });

            it('should store local data when the description is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'description').val('New description.');
                form.itemform('getAttr', 'descriptionEditor').updateFrame().refresh();
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.description).toEqual('New description.');

            });

            it('should store local data when the start date is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'startDate').val('April 26, 1564');
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.start_date).toEqual('April 26, 1564');

            });

            it('should store local data when the end date is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'endDate').val('April 23, 1616');
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.end_date).toEqual('April 23, 1616');

            });

            it('should store local data when the left percentage is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'leftPercent').val(20);
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.left_percent).toEqual(20);

            });

            it('should store local data when the right percentage is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'rightPercent').val(80);
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.right_percent).toEqual(80);

            });

            it('should store local data when the vector color is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'vectorColor').val('#000000');
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.vector_color).toEqual('#000000');

            });

            it('should store local data when the line color is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'strokeColor').val('#ffffff');
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.stroke_color).toEqual('#ffffff');

            });

            it('should store local data when the highlight color is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'highlightColor').val('#000000');
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.highlight_color).toEqual('#000000');

            });

            it('should store local data when the vector opacity is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'vectorOpacity').val(40);
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.vector_opacity).toEqual(40);

            });

            it('should store local data when the stroke opacity is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'strokeOpacity').val(40);
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.stroke_opacity).toEqual(40);

            });

            it('should store local data when the stroke thickness is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'strokeWidth').val(5);
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.stroke_width).toEqual(5);

            });

            it('should store local data when the point radius is changed', function() {

                // Change the title, hide the form.
                form.itemform('getAttr', 'pointRadius').val(6);
                form.itemform('hideForm', record);

                // Check for the local data record, inspect value.
                var localRecord = _db({ recordid: recordId }).first();
                expect(localRecord).not.toBeFalsy();
                expect(localRecord.data.point_radius).toEqual(6);

            });

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
            expect(post.params).toContain('description=Test+description.');
            expect(post.params).toContain('start_date=June+25%2C+1987');
            expect(post.params).toContain('end_date=June+26%2C+1987');
            expect(post.params).toContain('vector_color=%23ffffff');
            expect(post.params).toContain('stroke_color=%23000000');
            expect(post.params).toContain('highlight_color=%23ffff00');
            expect(post.params).toContain('vector_opacity=20');
            expect(post.params).toContain('stroke_opacity=80');
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
            expect(post.params).toContain('extent=1.1%2C2.2%2C3.3%2C4.4');
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
