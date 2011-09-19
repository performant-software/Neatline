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

            // Durations and CSS constants.
            item_list_highlight_duration: 10,
            drag_handle_width: 3,
            drag_tooltip_Y_offset: 16,
            drag_tooltip_X_offset: 15,

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

            // Set starting filtering parameters.
            this._searchString = '';
            this._tagFilter = null;
            this._collectionFilter = null;

            // Add listener to the search box and instantiate the input
            // canceller.
            this._glossSearchBox();

            // Instantiate the item filter widget.
            this._glossItemFilter();

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

        _positionDivs: function() {

            // Update dimensions and set new height.
            this._getDimensions();

            // Set the height of the main container.
            this.element.css({
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight
            });

            // Set the height of the header.
            this.itemsListHeader.css({
                'top': this.topBarHeight,
                'width': this.containerWidth - this.scrollbarWidth
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
                'left': this.containerWidth
            });

            // Append.
            this._body.append(this.dragHandle);

            // Construct the drag tooltip.
            this.tip = $('<div class="twipsy fade right in">\
                            <div class="twipsy-arrow"></div>\
                            <div class="twipsy-inner">Click to drag.</div>\
                        </div>');

            // Hide the tip by default.
            this.tip.css('display', 'none');

            // Add events.
            this.dragHandle.bind({

                'mouseenter': function() {

                    if (!self._just_dragged) {

                        self.dragHandle.trigger('mousemove');
                        self.dragHandle.css('border-right', '1px solid #cac8c2');

                    }

                },

                'mousemove': function(e) {

                    if (!self._is_dragging_width && !self._just_dragged) {

                        // Get pointer coordinates.
                        var offsetX = e.pageX;
                        var offsetY = e.pageY;

                        // Position and show tip.
                        self.tip.css({
                            'display': 'block',
                            'top': offsetY - self.options.drag_tooltip_Y_offset,
                            'left': offsetX + self.options.drag_tooltip_X_offset
                        });

                        // Append.
                        self._body.append(self.tip);

                    }

                },

                'mouseleave': function() {

                    // Hide the tip.
                    self.tip.css('display', 'none');

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

                    // Resize the container and header.
                    self.element.css('width', newWidth);
                    self.itemsListHeader.css('width', newWidth - self.scrollbarWidth);

                    // Reposition the dragger.
                    self.dragHandle.css('left', newWidth);

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

        _getDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

            this.windowWidth = this._window.width();
            this.windowHeight = this._window.height();

            this.topBarHeight = this.topBar.height();

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

            this.itemFilterContainer.itemfilter();

        },

        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: 'items',
                dataType: 'html',

                data: {
                    search: this._searchString
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

            // Gloss each of them.
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


// Usage.
jQuery(document).ready(function($) {

    $('#item-browser').itembrowser();

});
