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


    $.widget('neatline.itembrowser', {

        options: {

            // CSS constants.
            css: {
                default_text_size: 12,
                top_margin: 40,
                fader_width: 40,
                container_min_width: 400,
                drag_handle_width: 4,
                tooltips: {
                    drag_y_offset: 16,
                    drag_x_offset: 15,
                    space_y_offset: -38,
                    space_x_offset: -20,
                    time_y_offset: -38,
                    time_x_offset: -16,
                }
            },

            // Hexes.
            colors: {
                light_blue: '#f3f6ff',
                light_yellow: '#fffef8',
                dark_purple: '#4f1d6a',
                purple: '#724e85',
                text: '#515151',
                gray: '#8d8d8d',
                red: '#ca3c3c',
                orange: '#ffda82'
            }

        },

        /*
         * Initialize. Get markup, initialize trackers, and call preparatory methods.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.topBar =                   $('#topbar');
            this.searchWrapper =            $('#search-wrapper');
            this.searchBox =                $('#search-box');
            this.itemsList =                $('#items-list-container');
            this.itemsListHeader =          $('#items-list-header');
            this.searchCancel =             $('#search-cancel');
            this.itemFilterContainer =      $('#filter-items');
            this.neatlineContainer =        $('#neatline');
            this.itemsTable =               $('#items');
            this.dragTip =                  $('#drag-tip');
            this.spaceTip =                 $('#space-tip');
            this.timeTip =                  $('#time-tip');
            this.spaceHeader =              $('div.col-1.col-header span.header');
            this.timeHeader =               $('div.col-2.col-header span.header');

            // Trackers.
            this._searchString = '';
            this._currentFormItem = null;
            this._spaceBoxes = null;
            this._timeBoxes = null;
            this._spaceSorted = false;
            this._timeSorted = false;
            this._firstRequest = true;

            // Prepare the document, position elements, listen for resize.
            this._window.disableSelection();
            this._scrollbarWidth = $.getScrollbarWidth();
            this._positionDivs();
            this._addWindowResizeListener();
            this._buildDragHandle();
            this._glossSearchBox();
            this._glossColumnHeaders();
            this._glossItemFilter();

        },


        /*
         * =================
         * Preparatory workers.
         * =================
         */


        /*
         * Make the height of the container stretch to fit the height of the window,
         * fix the position of the top bar header (the search bar, filter items) at
         * the top of the container, and call the method to position the Neatline
         * container.
         */
        _positionDivs: function() {

            // Set the starting width of the container.
            this.element.css('width', this.options.css.container_min_width);

            // Set static CSS parameters for the Neatline.
            this.neatlineContainer.css('top', this.topBarHeight);

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
                'width': this.containerWidth - this._scrollbarWidth
            });

            // Position the Neatline div.
            this._positionNeatline();

        },

        /*
         * Calcualte the width and height of the container, window, and top bar.
         */
        _getDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();
            this.windowWidth = this._window.width();
            this.windowHeight = this._window.height();
            this.topBarHeight = this.topBar.height();

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

            // Construct the handle div.
            this.dragHandle = $('<div id="drag-handle"></div>');

            this.dragHandle.css({
                'width': this.options.css.drag_handle_width,
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight,
                'left': this.options.css.container_min_width,
                'z-index': 1000
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
                            'top': offsetY - self.options.css.tooltips.drag_y_offset,
                            'left': offsetX + self.options.css.tooltips.drag_x_offset
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

                    // Manifest the drag.
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
                    if (newWidth <= self.options.css.container_min_width) {
                        newWidth = self.options.css.container_min_width;
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
         * Set the dimensions of the Neatline container.
         */
        _positionNeatline: function() {

            // Position the Neatline container to the right of the item browser.
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
         * Define selection change callback on the item filter widget.
         */
        _glossItemFilter: function() {

            var self = this;

            this.itemFilterContainer.itemfilter({

                'selectionchange': function(eventObject, selected) {
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

            this.spaceHeader.bind({

                'mouseenter': function(e) {

                    // Get coordinates of the header.
                    var offset = self.spaceHeader.offset();

                    // Position and show the tooltip.
                    self.spaceTip.css({
                        'display': 'block',
                        'top': offset.top + self.options.css.tooltips.space_y_offset,
                        'left': offset.left + self.options.css.tooltips.space_x_offset
                    });

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._spaceBoxes != null) {

                        $.each(self._spaceBoxes, function(i, box) {
                            $(box).css('background-color', self.options.colors.orange);
                        });

                    }

                },

                'mouseleave': function() {

                    self.spaceTip.css('display', 'none');

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._spaceBoxes != null) {

                        $.each(self._spaceBoxes, function(i, box) {
                            $(box).css('background-color', self.options.colors.light_yellow);
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
                        'top': offset.top + self.options.css.tooltips.time_y_offset,
                        'left': offset.left + self.options.css.tooltips.time_x_offset
                    });

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._timeBoxes != null) {

                        $.each(self._timeBoxes, function(i, box) {
                            $(box).css('background-color', self.options.colors.orange);
                        });

                    }

                },

                'mouseleave': function() {

                    self.timeTip.css('display', 'none');

                    // Only do the gloss if the markup is loaded and registered.
                    if (self._timeBoxes != null) {

                        $.each(self._timeBoxes, function(i, box) {
                            $(box).css('background-color', self.options.colors.light_yellow);
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

            // Get the selection tracker out of the filter widget.
            var selected = this.itemFilterContainer.itemfilter('getSelected');

            // Core ajax call to get items.
            $.ajax({

                url: 'items',
                dataType: 'html',

                data: {
                    search: this._searchString,
                    tags: selected.tags,
                    types: selected.types,
                    collections: selected.collections,
                    all: selected.all,
                    neatline_id: Neatline.id
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
            this.items = this.itemsList.find('.item-row');

            // Position the faders.
            this._positionTitleFaders();

            // Instantiate id-itemDOM association object.
            this.idToItem = {};

            // Add the edit form functionality.
            $.each(this.items, function(i, item) {

                // DOM fetch.
                var item =                  $(item);
                var itemId =                item.attr('recordid');
                var itemTitleTd =           item.find('.item-title');
                var itemTitleText =         item.find('.item-title-text');
                var spaceBlock =            item.find('.space');
                var spaceCheckbox =         spaceBlock.find('input[type="checkbox"]');
                var timeBlock =             item.find('.time');
                var timeCheckbox =          timeBlock.find('input[type="checkbox"]');

                // Register the item in the associations object.
                self.idToItem[itemId] = item;

                // Store the space/time status on the DOM.
                if (spaceCheckbox.prop('checked')) { item.data('space', true); }
                else { item.data('space', false); }

                if (timeCheckbox.prop('checked')) { item.data('time', true); }
                else { item.data('time', false); }

                // Record the item's native vertical offset.
                self._calculateTopOffset(item);

                // Set the starting 'changed' data parameter.
                itemTitleText.data('changed', false);

                // Add mouseenter glossing to row.
                itemTitleTd.bind({

                    'mouseenter': function() {
                        item.find('td')
                            .css('background-color', self.options.colors.light_blue);
                    },

                    'mouseleave': function() {
                        item.find('td')
                            .css('background-color', self.options.colors.light_yellow);
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
                        spaceBlock.css('background-color', self.options.colors.orange);

                        // Force the color change on the time block.
                        var timeBlockColor = timeBlock.data('timeDataExists') ?
                            self.options.colors.red : self.options.colors.light_blue;
                        timeBlock.css('background-color', timeBlockColor);

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.colors.light_blue);

                    },

                    'mouseleave': function() {

                        // Get the new color.
                        var newColor = spaceBlock.data('spaceDataExists') ?
                            self.options.colors.red : self.options.colors.light_yellow;

                        // Push the change.
                        spaceBlock.css('background-color', newColor);

                        // Force the color change on the time block.
                        var timeBlockColor = timeBlock.data('timeDataExists') ?
                            self.options.colors.red : self.options.colors.light_yellow;
                        timeBlock.css('background-color', timeBlockColor);

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.colors.light_yellow);

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
                        timeBlock.css('background-color', self.options.colors.orange);

                        // Force the color change on the space block.
                        var spaceBlockColor = spaceBlock.data('spaceDataExists') ?
                            self.options.colors.red : self.options.colors.light_blue;
                        spaceBlock.css('background-color', spaceBlockColor);

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.colors.light_blue);

                    },

                    'mouseleave': function() {

                        // Get the new color.
                        var newColor = timeBlock.data('timeDataExists') ?
                            self.options.colors.red : self.options.colors.light_yellow;

                        // Push the change.
                        timeBlock.css('background-color', newColor);

                        // Force the color change on the space block.
                        var spaceBlockColor = spaceBlock.data('spaceDataExists') ?
                            self.options.colors.red : self.options.colors.light_yellow;
                        spaceBlock.css('background-color', spaceBlockColor);

                        // Make the color change on the item title.
                        itemTitleTd.css('background-color', self.options.colors.light_yellow);

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
         * relative to the container.
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
         * Expand the form for a given item id.
         */
        showFormByItemId: function(id, scrollMap, scrollTimeline, focusItems) {

            // Get the item from the id hash.
            var item = this.idToItem[id];

            // If the item is not already visible, show the form.
            if (item != this._currentFormItem) {
                this._showForm(this.idToItem[id], scrollMap, scrollTimeline, focusItems);
            }

        },

        /*
         * Expand and gloss an item edit form.
         */
        _showForm: function(item, scrollMap, scrollTimeline, focusItems) {



        },

        /*
         * Collapse an item edit form and unbind all events.
         */
        _hideForm: function(item, immediate) {



        },

        /*
         * Pluck data from form, get geocoverage data, build ajax request and
         * send data for save.
         */
        _saveItemForm: function() {



        },

        /*
         * Expand/contract the height of an open item form. Called after a width
         * drag on the container div that might affect the wrapped height of the
         * form contents.
         */
        _resizeForms: function() {



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
            var itemId = item.attr('recordid');
            var itemTitleText = item.find('.' + this.options.item_title_text_class);

            // Tween the title color.
            itemTitleText.animate({
                'color': this.options.colors.red
            }, 200);

            // Save the new status.
            $.ajax({

                url: 'status',
                type: 'POST',

                data: {
                    item_id: itemId,
                    neatline_id: Neatline.id,
                    space_or_time: spaceOrTime,
                    value: String(value)
                },

                success: function() {

                    // Tween the title color.
                    itemTitleText.animate({
                        'color': self.options.colors.text
                    }, 200);

                    if (reload) {
                        self._trigger('savecomplete');
                    }

                }

            });

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
         * =================
         * Public methods.
         * =================
         */


        /*
         * Populate a tracker variable with geocoverage data for a given
         * collection of features on the map. Called in advance of the item
         * saving routine.
         */
        setCoverageData: function(data) {

            this.coverageData = data;

        },

        /*
         * Make the item title fade to red to indicate that a change has been
         * made to the item's Neatline record but that the new data has not been
         * committed to the server.
         */
        markItemTitleAsUnsaved: function() {

            var itemTitleText = this._currentFormItem.find('.item-title-text');

            if (!itemTitleText.data('changed')) {

                // Tween the title color.
                itemTitleText.animate({
                    'color': this.options.colors.red
                }, 200);

                // Store the new status.
                itemTitleText.data('changed', true);

            }

        },

    });

})( jQuery );
