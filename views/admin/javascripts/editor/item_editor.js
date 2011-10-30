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
            edit_form_container_class: 'neatline-record-edit-form',
            small_scroll_content_class: 'small-scroll-content',
            title_input_name: 'title',
            description_input_name: 'description',
            start_date_input_name: 'start-date-date',
            start_time_input_name: 'start-date-time',
            end_date_input_name: 'end-date-date',
            end_time_input_name: 'end-date-time',
            color_picker_input_class: 'color-picker',

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
                neatline_purple: '#724E85',
                item_list_highlight: '#f2f3fa',
                drag_border: '#a79aae',
                text_default: '#383838',
                text_gray: '#8d8d8d',
                unchanged_red: '#ca3c3c',
                data_exists: '#fff2d3'
            }

        },

        /*
         * Initialize. Get markup, initialize trackers, and call preparatory methods.
         */
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

        /*
         * Disable text selection on the entire window.
         */
        _disableSelect: function() {

            // Turn off text selection on the whole container div.
            this._window.css('MozUserSelect', 'none');
            this._window.bind('selectstart', function() {
                return false;
            });

        },

        /*
         * Calcualte the width and height of the container, window, and top bar.
         */
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

        /*
         * Make the height of the container stretch to fit the height of the window,
         * fix the position of the top bar header (the search bar, filter items) at
         * the top of the container, and call the method to position the Neatline
         * container.
         */
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

        /*
         * Set the dimensions of the Neatline container.
         */
        _positionNeatline: function() {

            // Position the Neatline container to the right
            // of the item browser.
            this.neatlineContainer.css({
                'height': this.windowHeight - this.topBarHeight,
                'width': this.windowWidth - this.containerWidth - 1,
            });

            this._trigger('reposition');

        },

        /*
         * Position the width dragging container div to the right of the right
         * boundary of the editor.
         */
        _positionDragHandle: function() {

            // Set the height of the drag handle.
            this.dragHandle.css({
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight
            });

        },

        /*
         * Populate a tracker variable with geocoverage data for a given
         * collection of features on the map. Called in advance of the item
         * saving routine.
         */
        setCoverageData: function(data) {

            this.coverageData = data;

        },

        /*
         * On window resize, reposition all containers.
         */
        _addWindowResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self._positionDivs();
                self._positionDragHandle();
            });

        },

        /*
         * Build functionality for the width dragging handle.
         */
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

        /*
         * On mousedown on the drag handle, bind the move event on the
         * window and render the width change.
         */
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
                    if (self._currentFormItem != null) {
                        self._resizeForms();
                    }

                }

            });

        },

        /*
         * Build functionality on the search box. On keyup, fire the request
         * to fetch new items; on mousedown on the cancel 'x', zero out the
         * input value and trigger the keyup event to re-fetch the base-case
         * all results.
         */
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

        /*
         * Define selection change callback on the item filter widget.
         */
        _glossItemFilter: function() {

            var self = this;

            this.itemFilterContainer.itemfilter({

                'selectionchange': function(eventObject, selected) {
                    self.selected = selected;
                    self._getItems();
                }

            });

        },

        /*
         * Build functionality on the Space/Time column headers. On mouseover,
         * highlight the column to show that it is filterable by a click; on
         * mousedown, hide all items that do not have an active record in the
         * clicked column.
         */
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
                            $(box).css('background', self.options.spacetime_background_color + ' !important');
                        });

                    }

                },

                'mouseleave': function() {

                    self.spaceTip.css('display', 'none');

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._spaceBoxes != null) {

                        $.each(self._spaceBoxes, function(i, box) {

                            // Get the new color.
                            var box = $(box);
                            var newColor = box.data('spaceDataExists') ?
                                self.options.colors.data_exists + ' !important' :
                                self.options.item_row_default_background_color + ' !important';

                            // Push the change.
                            box.css('background', newColor);

                        });

                    }

                },

                'mousedown': function() {

                    // If there is an active form, close it.
                    if (self._currentFormItem) {
                        self._hideForm(self._currentFormItem, true);
                    }

                    // If not sorted, sort.
                    if (!self._spaceSorted) {

                        // Hide everything without an active space record.
                        $.each(self.items, function(i, item) {

                            var item = $(item);

                            if (!item.data('space')) {
                                item.css('display', 'none');
                                item.next('tr.edit-form').css('display', 'none');
                            }

                        });

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

                        });

                        self.spaceHeader.removeClass('active');
                        self._spaceSorted = false;

                    }

                    // Recalculate all top offsets.
                    self._calculateAllTopOffsets();

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
                            $(box).css('background', self.options.spacetime_background_color + ' !important');
                        });

                    }

                },

                'mouseleave': function() {

                    self.timeTip.css('display', 'none');

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._timeBoxes != null) {

                        $.each(self._timeBoxes, function(i, box) {

                            // Get the new color.
                            var box = $(box);
                            var newColor = box.data('timeDataExists') ?
                                self.options.colors.data_exists + ' !important' :
                                self.options.item_row_default_background_color + ' !important';

                            // Push the change.
                            box.css('background', newColor);

                        });

                    }

                },

                'mousedown': function() {

                    // If there is an active form, close it.
                    if(self._currentFormItem) {
                        self._hideForm(self._currentFormItem, true);
                    }

                    // If not sorted, sort.
                    if (!self._timeSorted) {

                        // Hide everything without an active space record.
                        $.each(self.items, function(i, item) {

                            var item = $(item);

                            if (!item.data('time')) {
                                item.css('display', 'none');
                                item.next('tr.edit-form').css('display', 'none');
                            }

                        });

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

                        });

                        self.timeHeader.removeClass('active');
                        self._timeSorted = false;

                    }

                    // Recalculate all top offsets.
                    self._calculateAllTopOffsets();

                }

            });

        },

        /*
         * Get items for the browser. On success, populate the container with
         * the fresh markup. If it is the first request made on pageload, trigger
         * out to deployment that the Neatline can be instantiated. This ordering
         * is necessary to avoid a tricky suite of positioning bugs that occur
         * if the Neatline is initialized before the full editor markup is present
         * and occupying space on the page.
         */
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

        /*
         * Once the raw markup is from the items ajax query is pushed into the
         * container, build the functionality for each item.
         */
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
                if (spaceCheckbox.prop('checked')) { item.data('space', true); }
                else { item.data('space', false); }

                if (timeCheckbox.prop('checked')) { item.data('time', true); }
                else { item.data('time', false); }

                // Store the existing-data status on the DOM.
                if (spaceBlock.hasClass('data-exists')) {
                    spaceBlock.data('spaceDataExists', true);
                    spaceBlock.css('background-color', self.options.colors.data_exists);
                } else { spaceBlock.data('spaceDataExists', false); }

                if (timeBlock.hasClass('data-exists')) {
                    timeBlock.data('timeDataExists', true);
                    timeBlock.css('background-color', self.options.colors.data_exists);
                } else { timeBlock.data('timeDataExists', false); }

                // Set the starting expanded tracker and record the item's
                // native vertical offset.
                self._calculateTopOffset(item);

                // Set the starting 'changed' data parameter.
                itemTitleText.data('changed', false);

                // Add mouseenter glossing to row.
                itemTitleTd.bind({

                    'mouseenter': function() {
                        item.find('td')
                            .not('.data-exists')
                            .css('background-color', self.options.item_row_highlight_background_color + ' !important');
                    },

                    'mouseleave': function() {
                        item.find('td')
                            .not('.data-exists')
                            .css('background-color', self.options.item_row_default_background_color + ' !important');
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

                        // Check the box.
                        self._checkStatusBlock(item, 'space');

                        // Do status change ajax.
                        self._saveStatus(item, 'space', true);

                    },

                    'mouseenter': function() {

                        // Make the color change on the box.
                        spaceBlock.css('background-color', self.options.spacetime_background_color + ' !important');

                        // Force the color change on the time block.
                        var timeBlockColor = timeBlock.data('timeDataExists') ?
                            self.options.colors.data_exists : self.options.item_row_highlight_background_color;
                        timeBlock.css('background-color', timeBlockColor + ' !important');

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.item_row_highlight_background_color + ' !important');

                    },

                    'mouseleave': function() {

                        // Get the new color.
                        var newColor = spaceBlock.data('spaceDataExists') ?
                            self.options.colors.data_exists : self.options.item_row_default_background_color;

                        // Push the change.
                        spaceBlock.css('background-color', newColor + ' !important');

                        // Force the color change on the time block.
                        var timeBlockColor = timeBlock.data('timeDataExists') ?
                            self.options.colors.data_exists : self.options.item_row_default_background_color;
                        timeBlock.css('background-color', timeBlockColor + ' !important');

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.item_row_default_background_color + ' !important');

                    }

                });

                // Bind the checkbox click functionality to the boxes.
                timeBlock.bind({

                    'mousedown': function() {

                        // Check the box.
                        self._checkStatusBlock(item, 'time');

                        // Do status change ajax.
                        self._saveStatus(item, 'time', true);

                    },

                    'mouseenter': function() {

                        // Make the color change on the box.
                        timeBlock.css('background-color', self.options.spacetime_background_color + ' !important');

                        // Force the color change on the space block.
                        var spaceBlockColor = spaceBlock.data('spaceDataExists') ?
                            self.options.colors.data_exists : self.options.item_row_highlight_background_color;
                        spaceBlock.css('background-color', spaceBlockColor + ' !important');

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.item_row_highlight_background_color + ' !important');

                    },

                    'mouseleave': function() {

                        // Get the new color.
                        var newColor = timeBlock.data('timeDataExists') ?
                            self.options.colors.data_exists : self.options.item_row_default_background_color;

                        // Push the change.
                        timeBlock.css('background-color', newColor + ' !important');

                        // Force the color change on the space block.
                        var spaceBlockColor = spaceBlock.data('spaceDataExists') ?
                            self.options.colors.data_exists : self.options.item_row_default_background_color;
                        spaceBlock.css('background-color', spaceBlockColor + ' !important');

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.item_row_default_background_color + ' !important');

                    }

                });

                // Bind the form open and close events.
                itemTitleTd.bind({

                    'mousedown': function() {

                        // If the form is not expanded, do expand.
                        if (!item.data('expanded')) {
                            self._showForm(item, true, true);
                        }

                        // If the form is expanded, hide.
                        else {
                            self._hideForm(item, false);
                        }

                    }

                });

            });

            // Fetch the space and time boxes and set the class global buckets.
            this._spaceBoxes = this.items.find('.space');
            this._timeBoxes = this.items.find('.time');

        },

        /*
         * Given an item <tr> in the browser list, calculate its native top offset
         * relative to the container. This value is used to position the items
         * at the top of the div when the form opens. The value needs to be calculated
         * in advance for each item because it doesn't work to just get the value
         * at the time of a mousedown event on the item - if there is already an open
         * form _above_ the item in the stack, the offset would reflect the height
         * of that form and the final positioning of the new item form is incorrect.
         */
        _calculateTopOffset: function(item) {

            item.data('topOffset', item.position().top);

        },

        /*
         * Do the offset calculation for all current items.
         */
        _calculateAllTopOffsets: function() {

            var self = this;

            // Walk the items and do the offset calculation for each.
            $.each(this.items, function(i, item) {
                self._calculateTopOffset($(item));
            });

        },

        /*
         * Check or uncheck a space or time status box for an item.
         */
        _checkStatusBlock: function(item, spaceOrTime) {

            var block = item.find('.' + spaceOrTime);
            var checkbox = block.find('input[type="checkbox"]');
            var newVal = !checkbox.prop('checked');
            checkbox.prop('checked', newVal);

            // Register the new status.
            if (newVal) {
                item.data(spaceOrTime, true);
            } else {
                item.data(spaceOrTime, false);
            }

        },

        /*
         * Expand the form for a given item id. Public method used by the deployment
         * script in response to a feature or timeline click on the exhibit. The
         * scrollMap and scrollTimeline booleans are passed into the _showForm method,
         * and are then used to control whether or not the focusing routines for
         * each of the blocks is triggered by the form open. This control is necessary
         * because in certain situations it is undesirable for one or both of the
         * blocks to react to a click. For example, if there is a click on a feature,
         * it can be confusing and discombobulating for the the map to react and focus
         * in on the feature if the click occurred when the map was at a comparatively
         * distant zoom level, etc.
         */
        showFormByItemId: function(id, scrollMap, scrollTimeline) {

            var item = this.idToItem[id];

            if (item != this._currentFormItem) {
                this._showForm(this.idToItem[id], scrollMap, scrollTimeline);
            }

        },

        /*
         * Expand and gloss an item edit form.
         */
        _showForm: function(item, scrollMap, scrollTimeline) {

            var self = this;
            var immediate = false;

            // If another form is currently expanded, hide it.
            if (this._currentFormItem != null) {
                this._hideForm(this._currentFormItem, true);
                immediate = true;
            }

            // Get child markup and parameters.
            var itemId = item.attr('recordid');
            var itemTitleTd = item.find('td.item-title');
            var editFormTd = item.next().find('td');
            var editFormContainer = editFormTd.find('.' + this.options.edit_form_container_class);
            var editForm = editFormTd.find('form');
            var textSpan = item.find('.' + this.options.item_title_text_class);
            var faderSpan = item.find('.' + this.options.item_title_fader_class);
            var itemTitleText = item.find('.' + this.options.item_title_text_class);
            var allInputs = editForm.find('input[type="text"], textarea')
            var descriptionTextarea = editForm.find('textarea[name="description"]');
            var colorPickerInput = editForm.find('.' + this.options.color_picker_input_class);

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

            // Measure the height of the item editor column.
            var editorHeight = this.element.height() - this.options.container_top_margin;

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
                'scrollTop': item.data('topOffset') - this.options.container_top_margin + 1
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
                    self._hideForm(item, false);
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

            // Set the change tracker on each of the inputs and bind
            // the change event.
            $.each(allInputs, function(i, input) {

                $(input).bind({
                    'keydown': function() {
                        self.markItemTitleAsUnsaved();
                    }
                });

            });

            // If the form is taller than the total height of the editor
            // column, add a scrollbar.
            if (formHeight > editorHeight) {
                // editFormContainer.smallscroll();
            }

            // Instantiate the color picker.
            colorPickerInput.miniColors();

            // Fire general item edit event to focus timeline and map
            // if data exists for the item.
            this._trigger('itemedit', {}, {
                'itemId': item.attr('recordid'),
                'scrollMap': scrollMap,
                'scrollTimeline': scrollTimeline
            });

            // Fire off the event to show the map editor controls.
            this._trigger('mapedit', {}, {
                'item': item,
                'immediate': immediate
            });

        },

        /*
         * Make the item title fade to red to indicate that a change has been
         * made to the item's Neatline record but that the new data has not been
         * committed to the server.
         */
        markItemTitleAsUnsaved: function() {

            var itemTitleText = this._currentFormItem.find('.' + this.options.item_title_text_class);

            // Tween the title color.
            itemTitleText.animate({
                'color': this.options.colors.unchanged_red
            }, 200);

            // Store the new status.
            itemTitleText.data('changed', true);

        },

        /*
         * Collapse an item edit form and unbind all events.
         */
        _hideForm: function(item, immediate) {

            // Get child markup.
            var editFormTd = item.next().find('td');
            var editForm = editFormTd.find('form');
            var itemId = editForm.find('recordid').text();
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

            // Animate or snap up the height, depending on the value
            // of immediate.
            if (!immediate) {

                editForm.animate({
                    'height': 0
                }, 300, function() {
                    // Hide the form.
                    editFormTd.css({
                        'display': 'none'
                    });
                });

            }

            else {

                editForm.animate({
                    'height': 0
                }, 0, function() {
                    // Hide the form.
                    editFormTd.css({
                        'display': 'none'
                    });
                });

            }

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
            this._trigger('endmapedit', {}, {
                'itemId': itemId,
                'immediate': immediate
            });

        },

        /*
         * Pluck data from form, get geocoverage data, build ajax request and
         * send data for save.
         */
        _saveItemForm: function() {

            var self = this;

            // Get child markup.
            var editFormTd = this._currentFormItem.next().find('td');
            var editForm = editFormTd.find('form');
            var itemTitleText = this._currentFormItem.find('.' + this.options.item_title_text_class);

            // Get the form inputs.
            var titleInput = editForm.find('input[name="' + this.options.title_input_name + '"]');
            var descriptionInput = editForm.find('textarea[name="' + this.options.description_input_name + '"]');
            var startDateInput = editForm.find('input[name="' + this.options.start_date_input_name + '"]');
            var startTimeInput = editForm.find('input[name="' + this.options.start_time_input_name + '"]');
            var endDateInput = editForm.find('input[name="' + this.options.end_date_input_name + '"]');
            var endTimeInput = editForm.find('input[name="' + this.options.end_time_input_name + '"]');
            var colorPickerInput = editForm.find('.' + this.options.color_picker_input_class);
            var itemId = editForm.find('recordid');

            // Get all of the inputs.
            var allInputs = editForm.find('input[type="text"], textarea')

            // Fetch the geocoverage data from OpenLayers.
            this._trigger('savemapedit');

            // Blur out the form to visually register the submission.
            editForm.animate({
                'opacity': 0.3
            }, 200);

            // Get the values out of the form.
            var itemId_Value = itemId.text();
            var neatlineId_Value = this.neatlineData.id;
            var title_Value = titleInput.val();
            var description_Value = descriptionInput.val();
            var startDate_Value = startDateInput.val();
            var startTime_Value = startTimeInput.val();
            var endDate_Value = endDateInput.val();
            var endTime_Value = endTimeInput.val();
            var colorValue = colorPickerInput.val();
            var geocoverage_Value = this.coverageData;

            // If there is date information entered, add an active record by default.
            var timeBlock = this._currentFormItem.find('.time');
            var timeCheckbox = timeBlock.find('input[type="checkbox"]');
            var spaceBlock = this._currentFormItem.find('.space');
            var spaceCheckbox = spaceBlock.find('input[type="checkbox"]');

            // Space and time status variables for the save post.
            var spaceStatus = spaceCheckbox.prop('checked');
            var timeStatus = timeCheckbox.prop('checked');

            // If time data has been entered, check the record active automatically
            // and add the color indication to the box.

            // Space.
            if (geocoverage_Value[0] != null) {

                // Add the color indication.
                spaceBlock.addClass('data-exists');
                spaceBlock.data('spaceDataExists', true);
                spaceBlock.css('background-color', this.options.colors.data_exists + ' !important');

                // If there is data, and the box is not currently checked as active,
                // default the box to checked.
                if (!spaceCheckbox.prop('checked')) {
                    this._checkStatusBlock(this._currentFormItem, 'space');
                    spaceStatus = !spaceStatus;
                }

            }

            // Time.
            if (startDate_Value != '' ||
                startTime_Value != '' ||
                endDate_Value != '' ||
                endTime_Value != '') {

                // Add the color indication.
                timeBlock.addClass('data-exists');
                timeBlock.data('spaceDataExists', true);
                timeBlock.css('background-color', this.options.colors.data_exists + ' !important');

                // If there is data, and the box is not currently checked as active,
                // default the box to checked.
                if (!timeCheckbox.prop('checked')) {
                    this._checkStatusBlock(this._currentFormItem, 'time');
                    timeStatus = !timeStatus;
                }

            }

            // Save data.
            $.ajax({

                url: 'save',
                type: 'POST',

                data: {
                    item_id: itemId_Value,
                    neatline_id: neatlineId_Value,
                    title: title_Value,
                    description: description_Value,
                    start_date: startDate_Value,
                    start_time: startTime_Value,
                    end_date: endDate_Value,
                    end_time: endTime_Value,
                    vector_color: colorValue,
                    geocoverage: geocoverage_Value,
                    space_status: this.__stringifyBooleanForJson(spaceStatus),
                    time_status: this.__stringifyBooleanForJson(timeStatus)
                },

                success: function() {

                    // Walk up the opacity.
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

        /*
         * When a status checkbox is checked or unchecked, dial back and commit
         * the status record.
         */
        _saveStatus: function(item, spaceOrTime, reload) {

            var self = this;

            var block = item.find('.' + spaceOrTime);
            var checkbox = block.find('input[type="checkbox"]');
            var value = checkbox.prop('checked');

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
                    value: this.__stringifyBooleanForJson(value)
                },

                success: function() {

                    // Tween the title color.
                    itemTitleText.animate({
                        'color': self.options.colors.text_default
                    }, 200);

                    if (reload) {
                        self._trigger('savecomplete');
                    }

                }

            });

        },

        /*
         * Expand/contract the height of an open item form. Called after a width
         * drag on the container div that might affect the wrapped height of the
         * form contents.
         */
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

        /*
         * Position the divs that provide the opacity gradient on the right
         * edge of width-occluded item titles in the browser pane.
         */
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

        /*
         * Calculate the width of the browser-default scrollbar. Used by the
         * calculation that positions the static browser pane top bar (with the
         * search box and item filterer).
         */
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

        },

        /*
         * Convert JavaScript boolean true/false to string true/false. Needed
         * to prevent typecasting chaos during parsing on the server.
         */
        __stringifyBooleanForJson: function(boolean) {

            return boolean ? 'true' : 'false';

        }

    });

})( jQuery );
