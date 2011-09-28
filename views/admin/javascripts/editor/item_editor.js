/*
 * Item browser and editor column in the Neatline editor.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {


    $.widget('neatline.itemeditor', {

        options: {

            // Markup hooks.
            topbar_id: 'topbar',
            items_table_class: 'items',
            search_wrapper_id: 'search-wrapper',
            search_box_id: 'search-box',
            search_cancel_id: 'search-cancel',
            items_list_container_id: 'items-list-container',
            items_list_header_id: 'items-list-header',
            item_filter_container_id: 'filter-items',
            neatline_id: 'neatline-editor',
            drag_tooltip_id: 'drag-tip',
            space_tooltip_id: 'space-tip',
            time_tooltip_id: 'time-tip',
            item_title_text_class: 'item-title-text',
            item_title_fader_class: 'item-title-fader',
            item_title_cell_class: 'item-title',
            edit_form_class: 'neatline-edit-record-form',
            title_input_name: 'title',
            description_input_name: 'description',
            start_date_date_input_name: 'start-date-date',
            start_date_time_input_name: 'start-date-time',
            end_date_date_input_name: 'end-date-date',
            end_date_time_input_name: 'end-date-time',

            // Durations and CSS constants.
            item_list_highlight_duration: 10,
            starting_item_list_width: 400,
            item_list_min_width: 400,
            drag_handle_width: 4,
            drag_tooltip_Y_offset: 16,
            drag_tooltip_X_offset: 15,
            space_tooltip_Y_offset: -38,
            space_tooltip_X_offset: -19,
            time_tooltip_Y_offset: -38,
            time_tooltip_X_offset: -15,
            item_title_fader_width: 40,
            item_name_default_color: '#515151',
            item_name_highlight_color: '#303030',
            item_row_highlight_background_color: '#f3f3f3',
            item_name_default_size: 12,
            container_top_margin: 40,

            // Hexes.
            colors: {
                item_list_highlight: '#f2f3fa',
                drag_border: '#a79aae'
            }

        },

        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.topBar = $('#' + this.options.topbar_id);
            this.searchWrapper = $('#' + this.options.search_wrapper_id);
            this.searchBox = $('#' + this.options.search_box_id);
            this.itemsList = $('#' + this.options.items_list_container_id);
            this.itemsListHeader = $('#' + this.options.items_list_header_id);
            this.searchCancel = $('#' + this.options.search_cancel_id);
            this.itemFilterContainer = $('#' + this.options.item_filter_container_id);
            this.neatlineContainer = $('#' + this.options.neatline_id);
            this.itemsTable = $('table.' + this.options.items_table_class);

            this.neatlineData = Neatline;

            // Tooltips.
            this.dragTip = $('#' + this.options.drag_tooltip_id);
            this.spaceTip = $('#' + this.options.space_tooltip_id);
            this.timeTip = $('#' + this.options.time_tooltip_id);

            // A facade for the real tracker object in item_filter.
            this.selected = {
                tags: [],
                types: [],
                collections: [],
                all: false
            };

            // Disable text selection on the document. This is aggressive
            // and controversial, but it solves lots of annoyances.
            this._disableSelect();

            // Get the os scrollbar width.
            this.__getScrollBarWidth();

            // Set the starting width of the container.
            this.element.css('width', this.options.starting_item_list_width);

            // Position the container, add window resize listener.
            this._positionDivs();
            this._addWindowResizeListener();

            // Construct the drag handle on the items stack.
            this._buildDragHandle();

            // Set search string tracker.
            this._searchString = '';

            // Add listener to the search box.
            this._glossSearchBox();

            // Add tooltips to column headers.
            this._glossColumnHeaders();

            // Instantiate the item filter widget.
            this._glossItemFilter();

            // Tracker for the current expanded form.
            this._currentFormItem = null;

            // Set static CSS parameters for the Neatline.
            this.neatlineContainer.css({
                'display': 'block',
                'float': 'right',
                'top': this.topBarHeight,
                'position': 'relative',
                'background': '#f1f1f1'
            });

            // Fire starting ajax request.
            this._firstRequest = true;

        },

        _disableSelect: function() {

            // Turn off text selection on the whole container div.
            this._window.css('MozUserSelect', 'none');
            this._window.bind('selectstart', function() {
                return false;
            });

        },

        _getDimensions: function() {

            // Container dimensions.
            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

            // Window dimensions.
            this.windowWidth = this._window.width();
            this.windowHeight = this._window.height();

            // Top bar height.
            this.topBarHeight = this.topBar.height();

        },

        _positionDivs: function() {

            // Update dimensions and set new height.
            this._getDimensions();

            // Set the height of the main container.
            this.element.css({
                'width': this.containerWidth,
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight
            });

            // Set the height of the header.
            this.itemsListHeader.css({
                'top': this.topBarHeight,
                'width': this.containerWidth - this.scrollbarWidth
            });

            // Position the Neatline div.
            this._positionNeatline();

        },

        _positionNeatline: function() {

            // Position the Neatline container to the right
            // of the item browser.
            this.neatlineContainer.css({
                'height': this.windowHeight - this.topBarHeight,
                'width': this.windowWidth - this.containerWidth - 1,
            });

            this._trigger('reposition');

        },

        _positionDragHandle: function() {

            // Set the height of the drag handle.
            this.dragHandle.css({
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight
            });

        },

        _addWindowResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self._positionDivs();
                self._positionDragHandle();
            });

        },

        _buildDragHandle: function() {

            var self = this;

            // Construct, size, and position the handle div.
            this.dragHandle = $('<div id="drag-handle"></div>');
            this.dragHandle.css({
                'width': this.options.drag_handle_width,
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight,
                'left': this.options.starting_item_list_width
            });

            // Append.
            this._body.append(this.dragHandle);

            // Add events.
            this.dragHandle.bind({

                'mouseenter': function() {

                    if (!self._just_dragged) {

                        self.dragHandle.trigger('mousemove');
                        self.dragHandle.css('border-right', '1px dashed #cac8c2');

                    }

                },

                'mousemove': function(e) {

                    if (!self._is_dragging_width && !self._just_dragged) {

                        // Get pointer coordinates.
                        var offsetX = e.pageX;
                        var offsetY = e.pageY;

                        // Position and show dragTip.
                        self.dragTip.css({
                            'display': 'block',
                            'top': offsetY - self.options.drag_tooltip_Y_offset,
                            'left': offsetX + self.options.drag_tooltip_X_offset
                        });

                    }

                },

                'mouseleave': function() {

                    // Hide the dragTip.
                    self.dragTip.css('display', 'none');

                    if (!self._is_dragging_width) {
                        self.dragHandle.css('border-right', 'none');
                        self._just_dragged = false;
                    }

                },

                'mousedown': function(event) {

                    self._doWidthDrag(event);

                }

            });

        },

        _doWidthDrag: function(trigger_event_object) {

            var self = this;
            this._is_dragging_width = true;

            // Fix the cursor as resize during the drag.
            self._body.css('cursor', 'col-resize');

            // Get the starting pointer coordinates.
            var startingX = trigger_event_object.pageX;

            // Update the dimensions trackers.
            this._getDimensions();

            // Get the starting width of the container.
            var startingContainerWidth = this.containerWidth;

            this._window.bind({

                'mousemove': function(e) {

                    // Get the relative offset and new width.
                    var offsetX = e.pageX - startingX;
                    var newWidth = startingContainerWidth + offsetX;

                    // If the cursor position position squeezes the width beyond
                    // the min-width.
                    if (newWidth <= self.options.item_list_min_width) {
                        newWidth = self.options.item_list_min_width;
                    }

                    // Resize the container and header.
                    self.element.css('width', newWidth);
                    self.itemsListHeader.css('width', newWidth - self.scrollbarWidth);

                    // Reposition the dragger.
                    self.dragHandle.css('left', newWidth);

                    // Update the container width tracker.
                    self.containerWidth = newWidth;

                    // Reposition the Neatline container.
                    self._positionNeatline();

                },

                'mouseup': function() {

                    self._is_dragging_width = false;
                    self._just_dragged = true;

                    // Unbind the events added for the drag.
                    self._window.unbind('mousemove mouseup');

                    // Set the cursor back to auto.
                    self._body.css('cursor', 'auto');

                    // Resize the expanded edit forms.
                    self._resizeForms();

                }

            });

        },

        _glossSearchBox: function() {

            var self = this;

            this.searchBox.bind({

                'keyup': function() {
                    self._searchString = self.searchBox.val();
                    self._getItems();
                }

            });

            // Gloss the cancel button.
            this.searchCancel.bind({

                'mousedown': function() {
                    self.searchBox.val('');
                    self.searchBox.trigger('keyup');
                }

            });

        },

        _glossItemFilter: function() {

            var self = this;

            this.itemFilterContainer.itemfilter({

                'selectionchange': function(eventObject, selected) {
                    self.selected = selected;
                    self._getItems();
                }

            });

        },

        _glossColumnHeaders: function() {

            var self = this;

            // Gloss the columns.
            this.spaceHeader = $('div.col-1.col-header span.header');
            this.timeHeader = $('div.col-2.col-header span.header');

            this.spaceHeader.bind({

                'mouseenter': function(e) {

                    // Get coordinates of the header.
                    var offset = self.spaceHeader.offset();

                    // Position and show dragTip.
                    self.spaceTip.css({
                        'display': 'block',
                        'top': offset.top + self.options.space_tooltip_Y_offset,
                        'left': offset.left + self.options.space_tooltip_X_offset
                    });

                },

                'mouseleave': function() {

                    self.spaceTip.css('display', 'none');

                }

            });

            this.timeHeader.bind({

                'mouseenter': function(e) {

                    // Get coordinates of the header.
                    var offset = self.timeHeader.offset();

                    // Position and show dragTip.
                    self.timeTip.css({
                        'display': 'block',
                        'top': offset.top + self.options.time_tooltip_Y_offset,
                        'left': offset.left + self.options.time_tooltip_X_offset
                    });

                },

                'mouseleave': function() {

                    self.timeTip.css('display', 'none');

                }

            });

        },

        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: 'items',
                dataType: 'html',

                data: {
                    search: this._searchString,
                    tags: this.selected.tags,
                    types: this.selected.types,
                    collections: this.selected.collections,
                    all: this.selected.all
                },

                success: function(data) {

                    self.itemsList.html(data);
                    self._positionDivs();
                    self._glossItems();

                    // Trigger neatlineready event.
                    if (self._firstRequest) {
                        self._trigger('neatlineready');
                        self._firstRequest = false;
                    }

                }

            });

        },

        _glossItems: function() {

            var self = this;

            // Get the new items.
            this.items = $('#' + this.options.items_list_container_id + ' .item-row');

            // Position the faders.
            this._positionTitleFaders();

            // Add the edit form functionality.
            $.each(this.items, function(i, item) {

                // DOM fetch the item and the edit form td.
                var item = $(item);

                // Set the starting expanded tracker, record the item's
                // native vertical offset for the auto-positioning on
                // form open.
                item.data('expanded', false);
                item.data('topOffset', item.position().top);

                item.bind({

                    'mousedown': function() {

                        // If the form is not expanded, do expand.
                        if (!item.data('expanded')) {
                            self._showForm(item);
                        }

                        // If the form is expanded, hide.
                        else {
                            self._hideForm(item);
                        }

                    }

                });

            });

        },

        _showForm: function(item) {

            var self = this;

            // If another form is currently expanded, hide it.
            if (this._currentFormItem != null) {
                this._hideForm(this._currentFormItem);
            }

            // Get child markup.
            var editFormTd = item.next().find('td');
            var editForm = editFormTd.find('form');
            var textSpan = item.find('.' + this.options.item_title_text_class);
            var faderSpan = item.find('.' + this.options.item_title_fader_class);

            // Calculate the native height of the form.
            var cloneFormTd = editFormTd
                .clone()
                .css({
                    'top': -1000,
                    'left': -1000,
                    'display': 'table-cell'
                })
                .appendTo(this._body);

            var cloneForm = cloneFormTd.find('form');
            var actionsDiv = cloneFormTd.find('div.actions');
            cloneForm.css({
                'height': 'auto',
                'width': this.containerWidth
            });

            // Register the height of the cloned form, delete it.
            var formHeight = cloneForm.height();
            cloneFormTd.remove();

            // Highlight the item title.
            textSpan.animate({
                'color': this.options.item_name_highlight_color,
                'font-size': 14,
                'font-weight': 'bold'
            }, 100);

            // Display the form.
            editFormTd.css({
                'display': 'table-cell'
            });

            // Animate up the height.
            editForm.animate({
                'height': formHeight
            }, 300);

            // Position at the top of the frame.
            this.element.animate({
                'scrollTop': item.data('topOffset') - this.options.container_top_margin
            }, 300);

            // Bind the button actions.
            var cancelButton = editForm.find('button[type="reset"]');
            var saveButton = editForm.find('input[type="submit"]');

            // Cancel form.
            cancelButton.bind({
                'mousedown': function() {
                    self._hideForm(item);
                }
            });

            // Save form.
            saveButton.bind({

                'mousedown': function() {
                    self._saveItemForm();
                    saveButton.unbind('mousedown');
                    cancelButton.unbind('mousedown');
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Change the data record.
            item.data('expanded', true);

            // Record the expanded form.
            this._currentFormItem = item;

            // Fire off the event to show the map editor controls.
            this._trigger('mapedit', {}, {
                'item': item
            });

        },

        _saveItemForm: function() {

            var self = this;

            // Get child markup.
            var editFormTd = this._currentFormItem.next().find('td');
            var editForm = editFormTd.find('form');

            // Get the form inputs.
            var titleInput = editForm
                .find('input[name="' +this.options.title_input_name + '"]');

            var descriptionInput = editForm
                .find('textarea[name="' + this.options.description_input_name + '"]');

            var startDateDateInput = editForm
                .find('input[name="' + this.options.start_date_date_input_name + '"]');

            var startDateTimeInput = editForm
                .find('input[name="' + this.options.start_date_time_input_name + '"]');

            var endDateDateInput = editForm
                .find('input[name="' + this.options.end_date_date_input_name + '"]');

            var endDateTimeInput = editForm.
                find('input[name="' + this.options.end_date_time_input_name + '"]');

            var itemId = editForm.
                find('recordid');

            editForm.animate({
                'opacity': 0.3
            }, 200, function() {

                // Disable the form elements.
                $.each(editForm.find('input, textarea'), function(i, input) {
                    $(input).prop('disabled', true);
                });

                // Show the loader div.
                var loader = editFormTd.find('.form-save-loader');

                // Animate up the loader height.
                loader.animate({
                    'height': 20
                }, 200, function() {

                    loader.css('visibility', 'visible');

                });

            });

            // Core ajax call to get items.
            $.ajax({

                url: 'save',
                dataType: 'json',
                type: 'POST',

                data: {
                    item_id: itemId.text(),
                    neatline_id: this.neatlineData.id,
                    title: titleInput.val(),
                    description: descriptionInput.val(),
                    start_date: startDateDateInput.val(),
                    start_time: startDateTimeInput.val(),
                    end_date: endDateDateInput.val(),
                    end_time: endDateTimeInput.val()
                },

                success: function(data) {
                    // Do success - reload items, etc.
                }

            });

        },

        _hideForm: function(item) {

            // Get child markup.
            var editFormTd = item.next().find('td');
            var editForm = editFormTd.find('form');
            var textSpan = item.find('.' + this.options.item_title_text_class);
            var faderSpan = item.find('.' + this.options.item_title_fader_class);

            // Highlight the item title.
            textSpan.animate({
                'color': this.options.item_name_default_color,
                'font-size': this.options.item_name_default_size + 'px',
                'font-weight': 'normal'
            }, 100);

            // Animate up the height.
            editForm.animate({
                'height': 0
            }, 300, function() {
                // Hide the form.
                editFormTd.css({
                    'display': 'none'
                });
            });

            // Change the data record.
            item.data('expanded', false);

            // Set the tracker to null.
            this._currentFormItem = null;

            // Fire the end edit without save callback.
            this._trigger('endmapedit');

        },

        _resizeForms: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                var item = $(item);

                if (item.data('expanded')) {

                    // Get child markup.
                    var editFormTd = item.next().find('td');
                    var editForm = editFormTd.find('form');
                    var textSpan = item.find('.' + self.options.item_title_text_class);
                    var faderSpan = item.find('.' + self.options.item_title_fader_class);

                    // Calculate the native height of the form.
                    var cloneFormTd = editFormTd
                        .clone()
                        .css({
                            'top': -1000,
                            'left': -1000,
                            'display': 'table-cell'
                        })
                        .appendTo(self._body);

                    var cloneForm = cloneFormTd.find('form');
                    var actionsDiv = cloneFormTd.find('div.actions');
                    cloneForm.css({
                        'height': 'auto',
                        'width': self.containerWidth
                    });

                    // Register the height of the cloned form,
                    // delete it.
                    var formHeight = cloneForm.height();
                    cloneFormTd.remove();

                    // Animate up the height.
                    editForm.animate({
                        'height': formHeight
                    }, 300);

                }

            });

        },

        _positionTitleFaders: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                var item = $(item);

                // Get the spans for the text and fader.
                var textSpan = item.find('.' + self.options.item_title_text_class);
                var faderSpan = item.find('.' + self.options.item_title_fader_class);

                // Measure the height of the block produced by the text
                // and the width of the entire row.
                var titleHeight = textSpan.height();

                // Position the fader.
                faderSpan.css({
                    'height': titleHeight
                });

            });

        },

        __getScrollBarWidth: function() {

            this.scrollbarWidth = 0;

            if ($.browser.msie) {

                var textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                    .css({
                        position: 'absolute',
                        top: -1000,
                        left: -1000
                    }).appendTo('body');

                var textarea2 = $('<textarea cols="10" rows="2"></textarea>')
                    .css({
                        position: 'absolute',
                        top: -1000,
                        left: -1000,
                        overflow: 'hidden'
                    }).appendTo('body');

                this.scrollbarWidth = textarea1.width() - textarea2.width();
                textarea1.remove();
                textarea2.remove();

            }

            else {

                var div = $('<div />')
                    .css({
                        width: 100,
                        height: 100,
                        overflow: 'auto',
                        position: 'absolute',
                        top: -1000,
                        left: -1000
                    }).prependTo('body').append('<div />').find('div').css({
                        width: '100%',
                        height: 200
                    });

                this.scrollbarWidth = 100 - div.width();
                div.parent().remove();

            }

        }

    });


})( jQuery );
