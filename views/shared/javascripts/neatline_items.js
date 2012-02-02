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


    $.widget('neatline.neatlineitems', {

        options: {

            // Hexes.
            colors: {
                purple: '#724E85',
                background: '#f9f9f9',
                title: '#202020',
                highlight: '#f3f6ff'
            },

            // CSS constants.
            css: {
                def_opacity: 0.7,
                def_font_size: 13,
                active_font_size: 18
            }

        },

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.listContainer =            $('#items-container');

            // Trackers.
            this._idToItem =                {};
            this._idToOffset =              {};
            this._currentItem =             null;
            this._currentItemId =           null;
            this._idOrdering =              [];

            // Build list.
            this._getItems();
            this._addResizeListener();

        },

        /*
         * Request item markup and gloss the results.
         */
        loadData: function() {
            this._getItems();
        },

        /*
         * Populate content.
         */
        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: Neatline.dataSources.undated,
                dataType: 'html',

                success: function(data) {
                    self.listContainer.html(data);
                    self._glossItems();
                    self._trigger('newitems');
                }

            });

        },

        /*
         * On window resize, recompute the top offsets.
         */
        _addResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self._getItemOffsets();
            });

        },

        /*
         * Once the raw markup is from the items ajax query is pushed into the
         * container, build the functionality for each item.
         */
        _glossItems: function() {

            var self = this;

            // Get the new items.
            this.items = this.listContainer.find('.item-title');

            // Bind events to the item rows.
            $.each(this.items, function(i, item) {

                // Get item id and description.
                var item = $(item);
                var description = item.next('li.item-description');
                var recordid = item.attr('recordid');

                // Populate trackers.
                self._idToItem[recordid] = item;
                self._idOrdering.push(recordid);
                item.data('expanded', false);

                // Unbind all events.
                item.add(description).unbind();

                // Disable selection on the titles.
                item.disableSelection();

                // Listen for events.
                item.bind({

                    'mousedown': function() {

                        // If hidden, expand.
                        if (!item.data('expanded')) {

                            // Show the description.
                            // self.__expandDescription(item);

                            // Trigger out to the deployment code.
                            self._trigger('itemclick', {}, {
                                'recordid': recordid,
                                'scrollItems': true
                            });

                        }

                        // If expanded, hide.
                        else {
                            self.__contractDescription(item);
                        }

                    },

                    // Highlight.
                    'mouseenter': function() {

                        // Gloss the title.
                        self.__highlightItem(item);

                        // Trigger out to the deployment code.
                        self._trigger('itementer', {}, {
                            'recordid': recordid
                        });

                    },

                    // Un-highlight.
                    'mouseleave': function() {

                        // De-gloss the title.
                        self.__unhighlightItem(item);

                        // Trigger out to the deployment code.
                        self._trigger('itemleave', {}, {
                            'recordid': recordid
                        });
                    }

                });

            });

            // Register the native top offsets.
            this._getItemOffsets();

        },

        /*
         * Scroll to the right.
         */
        scrollRight: function() {

            // Compute the new id.
            var newId = this._getNewScrollId('right');

            // Trigger out to the deployment code.
            this._trigger('itemclick', {}, {
                'recordid': newId,
                'scrollItems': true
            });

        },

        /*
         * Scroll to the right.
         */
        scrollLeft: function() {

            // Compute the new id.
            var newId = this._getNewScrollId('left');

            // Trigger out to the deployment code.
            this._trigger('itemclick', {}, {
                'recordid': newId,
                'scrollItems': true
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
            this.items = this.listContainer.find('.item-title');

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

            // Fetch the markup and get components.
            var item = this._idToItem[id];

            // If the item is present in the squence tray.
            if (item != null) {

                // If another item is expanded, hide.
                if (this._currentItemId != null &&
                    this._currentItemId != id) {
                        this.__hideCurrentDescription();
                        this._currentItem.data('expanded', false);
                }

                // Get the new scrollTop.
                var scrollTop = item.position().top + this.element.scrollTop();

                // If the new scroll is greater than the total height,
                // scroll exactly to the bottom.
                if (scrollTop > this.element[0].scrollHeight) {
                    scrollTop = this.element[0].scrollHeight;
                }

                // Position at the top of the frame.
                this.element.animate({
                    'scrollTop': scrollTop + 1
                }, 200);

                // Expand the description.
                this.__expandDescription(item);

            }

        },

        /*
         * DOM hits.
         */


        /*
         * Gloss title and description on mouseenter.
         */
        __highlightItem: function(item) {
            item.css('background-color', this.options.colors.highlight);
        },

        /*
         * Push title and description back to default state.
         */
        __unhighlightItem: function(item) {
            item.css('background-color', this.options.colors.background);
        },

        /*
         * Pop the title as active.
         */
        __activateTitle: function(item) {

            if (!item.data('expanded')) {
                item.stop().animate({
                    'font-size': '+=5px',
                    'color': this.options.colors.purple
                }, 100);
            }

        },

        /*
         * Return the title to normal.
         */
        __deactivateTitle: function(item, immediate) {

            // Halt if the item is not currently activated.
            if (item.data('expanded')) {

                // If not immediate, animate down.
                if (!immediate) {
                    item.stop().animate({
                        'font-size': '-=5px',
                        'color': this.options.colors.title
                    }, 100);
                }

                // If immediate, manifest directly.
                else {
                    item.css({
                        'font-size': '-=5px',
                        'color': this.options.colors.title
                    });
                }

            }

        },

        /*
         * Expand the description.
         */
        __expandDescription: function(item) {

            var self = this;

            // Capture the id of the new record, get description.
            var recordId = item.attr('recordid');
            var description = item.next('li');

            // Mark the title as active.
            this.__activateTitle(item);

            // Only show the description if it has content.
            if (description.text() != '') {

                // Show and measure the description.
                description.css('display', 'list-item');
                var height = description[0].scrollHeight;

                // Expand.
                description.animate({ 'height': height }, 200);

            }

            // Set trackers.
            self._currentItem = item;
            self._currentItemId = item.attr('recordid');
            item.data('expanded', true);

        },

        /*
         * Expand the description.
         */
        __contractDescription: function(item) {

            // Get the description.
            var description = item.next('li');

            // Mark the title as inactive.
            this.__deactivateTitle(item);

            // Contract and hide.
            description.animate({
                'height': 0
            }, 200, function() {
                description.css('display', 'none');
            });

            // Set trackers.
            this._currentItem = null;
            this._currentItemId = null;
            item.data('expanded', false);

        },

        /*
         * Dissapear the currently-expanded description.
         */
        __hideCurrentDescription: function() {

            // Deactivate the title.
            this.__deactivateTitle(this._currentItem, true);

            // Hide.
            this._currentItem.next('li').css({
                'height': 0,
                'display': 'none'
            });

        }

    });


})( jQuery );
