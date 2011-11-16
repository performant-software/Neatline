/*
 * Component widget that controls the undated items block. Instantiated by the
 * parent Neatline widget.
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


    $.widget('neatline.neatlineundateditems', {

        options: {

            // Markup hooks.
            markup: {
                list_container_id: 'undated-items-list-container',
                item_title_text_class: 'item-title-text',
                item_title_fader_class: 'item-title-fader',
                item_row_class: '.item-row',
                header_container_id: 'public-items-list-header',
                left_arrow_id: 'left-arrow',
                right_arrow_id: 'right-arrow',
                description_td_class: 'item-description',
                description_content_class: 'item-description-content'
            },

            // CSS constants.
            css: {
                header_height: 40
            },

            // Hexes.
            colors: {
                purple: '#724E85',
                blue: '#2149cc',
                text_default: '#515151',
                background_default: '#FFFEF8'
            }

        },

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.listContainer = $('#' + this.options.markup.list_container_id);
            this.listHeader = $('#' + this.options.markup.header_container_id);
            this.leftArrow = $('#' + this.options.markup.left_arrow_id);
            this.rightArrow = $('#' + this.options.markup.right_arrow_id);
            this.params = Neatline;

            // Trackers.
            this._idToItem = {};
            this._idToOffset = {};
            this._currentItem = null;
            this._currentItemId = null;
            this._idOrdering = [];

            // Get starting offets and position markup.
            this.__getScrollBarWidth();
            this.positionMarkup();
            this._addWindowResizeListener();

            // Add events to to the arrows.
            this._glossArrows();

            // Build list.
            this._getItems();

        },

        /*
         * Get the offset of the container.
         */
        _getOffsets: function() {

            this.containerOffset = this.element.offset();
            this.containerHeight = this.element.height();
            this.containerWidth = this.element.width();

        },

        /*
         * Position the header.
         */
        positionMarkup: function() {

            // Reget offsets.
            this._getOffsets();

            // Set the top and left offsets for the header.
            this.listHeader.css({
                'top': this.containerOffset.top,
                'left': this.containerOffset.left,
                'width': this.containerWidth - this.scrollbarWidth
            });

        },

        /*
         * On window resize, reposition the header.
         */
        _addWindowResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self.positionMarkup();
                self._getItemOffsets();
            });

        },

        /*
         * Request item markup and gloss the results.
         */
        loadData: function() {

            // Build list.
            this._getItems();

        },

        /*
         * Populate content.
         */
        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: this.params.dataSources.undated,
                dataType: 'html',

                success: function(data) {
                    self.listContainer.html(data);
                    self._glossItems();
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
            this.items = this.listContainer.find('.item-row');

            // Empty the id-to-item association object.
            this._idToItem = {};

            // Position the faders.
            this._positionTitleFaders();

            // Bind events to the item rows.
            $.each(this.items, function(i, item) {

                // Get item id and populate tracker literals.
                var item = $(item);
                var itemId = item.attr('recordid');
                self._idToItem[itemId] = item;
                self._idOrdering.push(itemId);

                // By default, register the items as contracted.
                item.data('expanded', false);

                // Listen for events.
                item.bind({

                    'mousedown': function() {

                        // Trigger out to the deployment code.
                        self._trigger('undateditemclick', {}, {
                            'itemId': itemId,
                            'scrollItems': false
                        });

                        // If the form is hidden, show it.
                        if (!item.data('expanded')) {
                            self.scrollToItem(itemId);
                        }

                        // If the form is visible, hide it.
                        else {
                            self.hideItem(itemId);
                        }

                    }

                });

            });

            // Register the native top offsets.
            this._getItemOffsets();

        },

        /*
         * Build scrolling functionality.
         */
        _glossArrows: function() {

            var self = this;

            // Events on left arrow.
            this.leftArrow.bind('mousedown', function() {

                // Compute the new id.
                var id = self._getNewScrollId('left');

                // Trigger out to the deployment code.
                self._trigger('undateditemclick', {}, {
                    'itemId': id,
                    'scrollItems': true
                });

            });

            // Events on right arrow.
            this.rightArrow.bind('mousedown', function() {

                // Compute the new id.
                var id = self._getNewScrollId('right');

                // Trigger out to the deployment code.
                self._trigger('undateditemclick', {}, {
                    'itemId': id,
                    'scrollItems': true
                });

            });

        },

        /*
         * Figure out the id of the item that should be scrolled to. Direction
         * is 'left' or 'right'.
         */
        _getNewScrollId: function(direction) {

            switch (direction) {

                case 'left':

                    // If there is no set current id, scroll to the last item.
                    if (this._currentItemId == null) {
                        return this._idOrdering[this._idOrdering.length - 1];
                    }

                    // If there is a set current id.
                    else {

                        // Get the current id.
                        var currentIndex = this._idOrdering.indexOf(this._currentItemId)

                        // If the current item is the first item, loop to the last.
                        if (currentIndex == 0) {
                            return this._idOrdering[this._idOrdering.length - 1];
                        }

                        else {
                            return this._idOrdering[currentIndex - 1];
                        }

                    }

                break;

                case 'right':

                    // If there is no set current id, scroll to the first item.
                    if (this._currentItemId == null) {
                        return this._idOrdering[0];
                    }

                    // If there is a set current id.
                    else {

                        // Get the current id.
                        var currentIndex = this._idOrdering.indexOf(this._currentItemId)

                        // If the current item is the last item, loop to the first.
                        if (currentIndex == this._idOrdering.length - 1) {
                            return this._idOrdering[0];
                        }

                        else {
                            return this._idOrdering[currentIndex + 1];
                        }

                    }

                break;

            }

        },

        /*
         * Once the raw markup is from the items ajax query is pushed into the
         * container, build the functionality for each item.
         */
        _getItemOffsets: function() {

            var self = this;

            // Get the new items.
            this.items = this.listContainer.find('.item-row');

            // Empty the association object.
            this._idToOffset = {};

            // Bind events to the item rows.
            $.each(this.items, function(i, item) {

                var item = $(item);
                var itemId = item.attr('recordid');

                // Measure and store the item's native vertical offset.
                self._idToOffset[itemId] = item.position().top

            });

        },

        /*
         * Vertical scroll to item.
         */
        scrollToItem: function(id) {

            // If there is a currently selected item, fade down the title.
            if (this._currentItem != null) {
                this.hideItem(this._currentItemId);
            }

            // Fetch the markup and get components.
            var item = this._idToItem[id];
            var descriptionTd = item.next('tr').find('td.' + this.options.markup.description_td_class);

            // If the item is present in the squence tray.
            if (item != null) {

                // Highlight the title.
                this.__highlightTitle(item);

                // Set the trackers.
                this._currentItem = item;
                this._currentItemId = id;

                // Position at the top of the frame.
                this.element.animate({
                    'scrollTop': this._idToOffset[id] - this.options.css.header_height + 1
                }, 300);

                // Expand the description.
                // this.__expandDescription(descriptionTd);

                // Store the item as expanded.
                item.data('expanded', true);

            }

        },

        /*
         * Contract item.
         */
        hideItem: function(id) {

            // Fetch the markup and get components.
            var item = this._idToItem[id];
            var descriptionTd = item.next('tr').find('td.' + this.options.markup.description_td_class);

            // If the item is present in the squence tray.
            if (item != null) {

                // Highlight the title.
                this.__unhighlightTitle(item);

                // Set the trackers.
                this._currentItem = null;
                this._currentItemId = null;

                // Contract the description.
                // this.__contractDescription(descriptionTd);

                // Store the item as expanded.
                item.data('expanded', false);

            }

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
                var textSpan = item.find('.' + self.options.markup.item_title_text_class);
                var faderSpan = item.find('.' + self.options.markup.item_title_fader_class);

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
         * Measure the full height of a div given some width and display property.
         */
        __measureNativeHeight: function(div, width, display) {

            // Clone and reposition.
            var clone = div
                .clone()
                .css({
                    'top': -1000,
                    'left': -1000,
                    'display': display,
                    'width': width,
                    'height': 'auto'
                })
                .appendTo(this._body);

            // Register the height of the cloned form, delete it.
            var height = clone.height();
            clone.remove();

            return height;

        },

        /*
         * DOM hits.
         */

        /*
         * Mark as not-highlighted the title of an item listing.
         */
        __unhighlightTitle: function(item) {

            var oldTitle = item.find('.' + this.options.markup.item_title_text_class);

            // Fade the title to white.
            oldTitle.animate({
                'color': this.options.colors.text_default
            }, 200);

            // Fade the row background to purple.
            item.animate({
                'background-color': this.options.colors.background_default
            }, 200);

        },

        /*
         * Mark as highlighted the title of an item listing.
         */
        __highlightTitle: function(item) {

            // Get the item title.
            var title = item.find('.' + this.options.markup.item_title_text_class);

            // Fade the title to white.
            title.animate({
                'color': '#fff'
            }, 200);

            // Fade the row background to purple.
            item.animate({
                'background-color': this.options.colors.purple
            }, 200);

        },

        /*
         * Expand an item description
         */
        __expandDescription: function(descriptionTd) {

            // Get the description content div.
            var contentDiv = descriptionTd.find('div.' + this.options.markup.description_content_class);

            // Measure the native height of the content.
            var nativeHeight = this.__measureNativeHeight(contentDiv, this.containerWidth, 'block');

            // Display the row.
            descriptionTd.css('display', 'table-cell');

            // Roll down.
            contentDiv.animate({
                'height': nativeHeight
            }, 300);

        },

        /*
         * Contract an item description
         */
        __contractDescription: function(descriptionTd) {

            // Get the description content div.
            var contentDiv = descriptionTd.find('div.' + this.options.markup.description_content_class);

            // Roll up and hide the row on complete.
            contentDiv.animate({
                'height': 0
            }, 300, function() {
                descriptionTd.css('display', 'none');
            });

        }

    });


})( jQuery );
