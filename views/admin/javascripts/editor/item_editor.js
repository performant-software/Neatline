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
            item_row_default_background_color: '#FFFEF5',
            item_row_highlight_background_color: '#f3f6ff',
            spacetime_background_color: '#ffda82',
            item_name_default_size: 12,
            container_top_margin: 40,

            // Hexes.
            colors: {
                item_list_highlight: '#f2f3fa',
                drag_border: '#a79aae',
                text_default: '#383838',
                text_gray: '#8d8d8d',
                unchanged_red: '#ca3c3c'
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

            // Tracker for the current expanded form, space boxes,
            // and time boxes.
            this._currentFormItem = null;
            this._spaceBoxes = null;
            this._timeBoxes = null;

            // Boolean trackers for space and time results cropping.
            this._spaceSorted = false;
            this._timeSorted = false;

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

        setCoverageData: function(data) {

            this.coverageData = data;

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

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._spaceBoxes != null) {

                        $.each(self._spaceBoxes, function(i, box) {
                            $(box).css('background', self.options.spacetime_background_color);
                        });

                    }

                },

                'mouseleave': function() {

                    self.spaceTip.css('display', 'none');

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._spaceBoxes != null) {

                        $.each(self._spaceBoxes, function(i, box) {
                            $(box).css('background', self.options.item_row_default_background_color);
                        });

                    }

                },

                'mousedown': function() {

                    // If not sorted, sort.
                    if (!self._spaceSorted) {

                        // Hide everything without an active space record.
                        $.each(self.items, function(i, item) {

                            var item = $(item);

                            if (!item.data('space')) {
                                item.css('display', 'none');
                                item.next('tr.edit-form').css('display', 'none');
                            }
                        })

                        self.spaceHeader.addClass('active');
                        self._spaceSorted = true;

                    }

                    // Else, unsort.
                    else {

                        $.each(self.items, function(i, item) {

                            var item = $(item);

                            if (!item.data('space')) {
                                if (!(self._timeSorted && !item.data('time'))) {
                                    item.css('display', '');
                                    item.next('tr.edit-form').css('display', '');
                                }
                            }

                        })

                        self.spaceHeader.removeClass('active');
                        self._spaceSorted = false;

                    }

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

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._timeBoxes != null) {

                        $.each(self._timeBoxes, function(i, box) {
                            $(box).css('background', self.options.spacetime_background_color);
                        });

                    }

                },

                'mouseleave': function() {

                    self.timeTip.css('display', 'none');

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._timeBoxes != null) {

                        $.each(self._timeBoxes, function(i, box) {
                            $(box).css('background', self.options.item_row_default_background_color);
                        });

                    }

                },

                'mousedown': function() {

                    // If not sorted, sort.
                    if (!self._timeSorted) {

                        // Hide everything without an active space record.
                        $.each(self.items, function(i, item) {

                            var item = $(item);

                            if (!item.data('time')) {
                                item.css('display', 'none');
                                item.next('tr.edit-form').css('display', 'none');
                            }

                        })

                        self.timeHeader.addClass('active');
                        self._timeSorted = true;

                    }

                    // Else, unsort.
                    else {

                        // Hide everything without an active space record.
                        $.each(self.items, function(i, item) {

                            var item = $(item);

                            if (!item.data('time')) {
                                if (!(self._spaceSorted && !item.data('space'))) {
                                    item.css('display', '');
                                    item.next('tr.edit-form').css('display', '');
                                }
                            }

                        })

                        self.timeHeader.removeClass('active');
                        self._timeSorted = false;

                    }

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
                    all: this.selected.all,
                    neatline_id: this.neatlineData.id
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

            // Instantiate id-itemDOM association object.
            this.idToItem = {};

            // Add the edit form functionality.
            $.each(this.items, function(i, item) {

                // DOM fetch.
                var item = $(item);
                var itemId = item.attr('recordid');
                var itemTitleTd = item.find('.item-title');
                var itemTitleText = item.find('.' + self.options.item_title_text_class);
                var spaceBlock = item.find('.space');
                var spaceCheckbox = spaceBlock.find('input[type="checkbox"]');
                var timeBlock = item.find('.time');
                var timeCheckbox = timeBlock.find('input[type="checkbox"]');

                // Register the item in the associations object.
                self.idToItem[itemId] = item;

                // Store the space/time status on the DOM.
                if (spaceCheckbox.prop('checked')) {
                    item.data('space', true);
                } else {
                    item.data('space', false);
                }

                if (timeCheckbox.prop('checked')) {
                    item.data('time', true);
                } else {
                    item.data('time', false);
                }

                // Set the starting expanded tracker and record the item's
                // native vertical offset.
                item.data('expanded', false);
                item.data('topOffset', item.position().top);

                // Set the starting 'changed' data parameter.
                itemTitleText.data('changed', false);

                // Add mouseenter glossing to row.
                item.bind({

                    'mouseenter': function() {
                        item.find('td').css('background-color', self.options.item_row_highlight_background_color);
                    },

                    'mouseleave': function() {
                        item.find('td').css('background-color', self.options.item_row_default_background_color);
                    }

                });

                // Turn off the default checkbox behevior for the S/T boxes.
                spaceCheckbox.bind({
                    'click': function(event) {
                        event.preventDefault();
                    }
                });

                timeCheckbox.bind({
                    'click': function(event) {
                        event.preventDefault();
                    }
                });

                // Bind the checkbox click functionality to the boxes.
                spaceBlock.bind({

                    'mousedown': function() {

                        var newVal = !spaceCheckbox.prop('checked');
                        spaceCheckbox.prop('checked', newVal);

                        // Register the new status.
                        if (newVal) {
                            item.data('space', true);
                        } else {
                            item.data('space', false);
                        }

                        // Do status change ajax.
                        self._saveStatus(item, 'space', newVal);

                    },

                    'mouseenter': function() {
                        spaceBlock.css('background-color', self.options.spacetime_background_color + ' !important');
                    },

                    'mouseleave': function() {
                        spaceBlock.css('background-color', itemTitleTd.css('background'));
                    }

                });

                // Bind the checkbox click functionality to the boxes.
                timeBlock.bind({

                    'mousedown': function() {

                        var newVal = !timeCheckbox.prop('checked');
                        timeCheckbox.prop('checked', !timeCheckbox.prop('checked'));

                        // Register the new status.
                        if (newVal) {
                            item.data('time', true);
                        } else {
                            item.data('time', false);
                        }

                        // Do status change ajax.
                        self._saveStatus(item, 'time', newVal);

                    },

                    'mouseenter': function() {
                        timeBlock.css('background-color', self.options.spacetime_background_color + ' !important');
                    },

                    'mouseleave': function() {
                        timeBlock.css('background-color', itemTitleTd.css('background'));
                    }

                });

                // Bind the form open and close events.
                itemTitleTd.bind({

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

            // Fetch the space and time boxes and set the class global buckets.
            this._spaceBoxes = this.items.find('.space');
            this._timeBoxes = this.items.find('.time');

        },

        showFormByItemId: function(id) {

            var item = this.idToItem[id];
            if (item != this._currentFormItem) {
                this._showForm(this.idToItem[id]);
            }

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
            var itemTitleText = item.find('.' + this.options.item_title_text_class);
            var allInputs = editForm.find('input[type="text"], textarea')
            var descriptionTextarea = editForm.find('textarea[name="description"]');

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

            // By default, fade to the default text color and weight.
            var textColor = this.options.colors.text_default;

            // Keep the title bold red if the form was not saved.
            if (textSpan.data('changed')) {
                textColor = this.options.colors.unchanged_red;
            }

            // Highlight the item title.
            textSpan.stop().animate({
                'color': textColor,
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

            // Change the data record.
            item.data('expanded', true);

            // Record the expanded form.
            this._currentFormItem = item;

            // Bind the button actions.
            var cancelButton = editForm.find('button[type="reset"]');
            var saveButton = editForm.find('input[type="submit"]');

            // On textarea resize, resize the form.
            descriptionTextarea.unbind('mouseup').bind('mouseup', function() {
                self._resizeForms();
            });

            // Cancel form.
            cancelButton.bind({

                'mousedown': function() {
                    self._hideForm(item);
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Save form.
            saveButton.bind({

                'mousedown': function() {
                    self._saveItemForm();
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Set the change tracker on each of the inputs and bind the change event.
            $.each(allInputs, function(i, input) {

                $(input).bind({

                    'keydown': function() {

                        // Tween the title color.
                        itemTitleText.animate({
                            'color': self.options.colors.unchanged_red
                        }, 200);

                        // Store the new status.
                        itemTitleText.data('changed', true);

                    }

                });

            });

            // Fire off the event to show the map editor controls.
            this._trigger('mapedit', {}, {
                'item': item
            });

        },

        _hideForm: function(item) {

            // Get child markup.
            var editFormTd = item.next().find('td');
            var editForm = editFormTd.find('form');
            var textSpan = item.find('.' + this.options.item_title_text_class);
            var faderSpan = item.find('.' + this.options.item_title_fader_class);
            var allInputs = editForm.find('input[type="text"], textarea')

            // By default, fade to the default text color and weight.
            var textColor = this.options.colors.text_default;
            var textWeight = 'normal';

            // Keep the title bold red if the form was not saved.
            if (textSpan.data('changed')) {
                textColor = this.options.colors.unchanged_red;
                textWeight = 'bold';
            }

            // Highlight the item title.
            textSpan.stop().animate({
                'color': textColor,
                'font-size': this.options.item_name_default_size,
                'font-weight': textWeight
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

            // Bind the button actions.
            var cancelButton = editForm.find('button[type="reset"]');
            var saveButton = editForm.find('input[type="submit"]');

            // Pull events off cancel form.
            cancelButton.unbind('mousedown click');

            // Pull events off save form.
            saveButton.unbind('mousedown click');

            // Pull events off of inputs.
            $.each(allInputs, function(i, input) {
                $(input).unbind('keydown');
            });

            // Fire the end edit without save callback.
            this._trigger('endmapedit');

        },

        _saveItemForm: function() {

            var self = this;

            // Get child markup.
            var editFormTd = this._currentFormItem.next().find('td');
            var editForm = editFormTd.find('form');
            var itemTitleText = this._currentFormItem.find('.' + this.options.item_title_text_class);

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

            // Get all of the inputs.
            var allInputs = editForm.find('input[type="text"], textarea')

            // Fetch the geocoverage data from OpenLayers.
            this._trigger('savemapedit');

            // Blur out the form to visually register the submission.
            editForm.animate({
                'opacity': 0.3
            }, 200);

            // If there is date information entered, add an active record by default.
            var timeBlock = this._currentFormItem.find('.time');
            var timeCheckbox = timeBlock.find('input[type="checkbox"]');
            if (startDateDateInput.val() != '' && !timeCheckbox.prop('checked')) {
                timeBlock.trigger('mousedown');
            }

            // Save data.
            $.ajax({

                url: 'save',
                type: 'POST',

                data: {
                    item_id: itemId.text(),
                    neatline_id: this.neatlineData.id,
                    title: titleInput.val(),
                    description: descriptionInput.val(),
                    start_date: startDateDateInput.val(),
                    start_time: startDateTimeInput.val(),
                    end_date: endDateDateInput.val(),
                    end_time: endDateTimeInput.val(),
                    geocoverage: this.coverageData
                },

                success: function() {

                    editForm.animate({
                        'opacity': 1
                    });

                    // Tween the title color.
                    itemTitleText.animate({
                        'color': self.options.colors.text_default
                    }, 200);

                    // Register the change.
                    itemTitleText.data('changed', false);

                    self._trigger('savecomplete');

                }

            });

        },

        _saveStatus: function(item, spaceOrTime, value) {

            var self = this;

            // Get the Omeka item id and the title div.
            var itemId = item.next().find('recordid');
            var itemTitleText = item.find('.' + this.options.item_title_text_class);

            // Tween the title color.
            itemTitleText.animate({
                'color': this.options.colors.unchanged_red
            }, 200);

            // Save the new status.
            $.ajax({

                url: 'status',
                type: 'POST',

                data: {
                    item_id: itemId.text(),
                    neatline_id: this.neatlineData.id,
                    space_or_time: spaceOrTime,
                    value: value
                },

                success: function() {

                    // Tween the title color.
                    itemTitleText.animate({
                        'color': self.options.colors.text_default
                    }, 200);

                    self._trigger('savecomplete');

                }

            });

        },

        _resizeForms: function() {

            var item = this._currentFormItem;

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

            // Register the height of the cloned form,
            // delete it.
            var formHeight = cloneForm.height();
            cloneFormTd.remove();

            // Animate up the height.
            editForm.animate({
                'height': formHeight
            }, 300);

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
