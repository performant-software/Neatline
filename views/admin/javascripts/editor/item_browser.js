/*
 * Item browser widget in the Neatline editor.
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

            // Markup hooks.
            topbar_id: 'topbar',
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

            // Durations and CSS constants.
            item_list_highlight_duration: 10,
            starting_item_list_width: 400,
            item_list_min_width: 370,
            drag_handle_width: 4,
            drag_tooltip_Y_offset: 16,
            drag_tooltip_X_offset: 15,
            space_tooltip_Y_offset: -38,
            space_tooltip_X_offset: -19,
            time_tooltip_Y_offset: -38,
            time_tooltip_X_offset: -15,

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

            // Position the Neatline container.
            this._positionNeatline();

            // Set static CSS parameters for the Neatline.
            this.neatlineContainer.css({
                'display': 'block',
                'float': 'right',
                'top': this.topBarHeight,
                'position': 'relative',
                'background': '#f1f1f1'
            });

            // Instantiate the Neatline widget.
            this.neatlineContainer.neatline();

            // Fire starting ajax request.
            this._getItems();

        },

        _disableSelect: function() {

            // Turn off text selection on the whole container div.
            this._window.css('MozUserSelect', 'none');
            this._window.bind('selectstart', function() {
                return false;
            });

        },

        _getDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

            this.windowWidth = this._window.width();
            this.windowHeight = this._window.height();

            this.topBarHeight = this.topBar.height();

        },

        _positionDivs: function() {

            // Update dimensions and set new height.
            this._getDimensions();

            // Set the height of the main container.
            this.element.css({
                'width': this.options.starting_item_list_width,
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

                    if (newWidth >= self.options.item_list_min_width) {

                        // Resize the container and header.
                        self.element.css('width', newWidth);
                        self.itemsListHeader.css('width', newWidth - self.scrollbarWidth);

                        // Reposition the dragger.
                        self.dragHandle.css('left', newWidth);

                        // Update the container width tracker.
                        self.containerWidth = newWidth;

                        // Reposition the Neatline container.
                        self._positionNeatline();

                    }

                },

                'mouseup': function() {

                    self._is_dragging_width = false;
                    self._just_dragged = true;

                    // Unbind the events added for the drag.
                    self._window.unbind('mousemove mouseup');

                    // Set the cursor back to auto.
                    self._body.css('cursor', 'auto');

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
                }

            });

        },

        _glossItems: function() {

            var self = this;

            // Get the new items.
            this.items = $('#' + this.options.items_list_container_id + ' .item-row');

            // Gloss each item.
            $.each(this.items, function(i, item) {

                var item = $(item);
                item.bind({

                    'mouseenter': function() {
                        item.addClass('highlight');
                    },

                    'mouseleave': function() {
                        item.removeClass('highlight');
                    }

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
