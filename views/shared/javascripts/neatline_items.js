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

  'use strict';

    $.widget('neatline.neatlineitems', {

        options: {

            // Hexes.
            colors: {
                purple: '#724E85',
                background: '#FFFEF8',
                title: '#202020',
                highlight: '#f2eff3'
            },

            // CSS constants.
            css: {
                def_opacity: 0.7
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

                url: Neatline.dataSources.undated,
                dataType: 'html',

                success: function(data) {
                    self.listContainer.html(data);
                    self._glossItems();
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

                // Listen for events.
                item.add(description).bind({

                    'mousedown': function() {

                        // Trigger out to the deployment code.
                        self._trigger('itemclick', {}, {
                            'recordid': recordid,
                            'scrollItems': true
                        });

                    },

                    // Highlight.
                    'mouseenter': function() {
                        self.__highlightItem(item);
                    },

                    // Un-highlight.
                    'mouseleave': function() {
                        self.__unhighlightItem(item);
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
            this._currentItemId = this._getNewScrollId('right');

            // Trigger out to the deployment code.
            this._trigger('itemclick', {}, {
                'recordid': this._currentItemId,
                'scrollItems': true
            });

        },

        /*
         * Scroll to the right.
         */
        scrollLeft: function() {

            // Compute the new id.
            this._currentItemId = this._getNewScrollId('left');

            // Trigger out to the deployment code.
            this._trigger('itemclick', {}, {
                'recordid': this._currentItemId,
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
                    if (this._currentItemId === null) {
                        return this._idOrdering[this._idOrdering.length - 1];
                    }

                    // If there is a set current id.
                    else {

                        // Get the current id.
                        var currentIndex = this._idOrdering.indexOf(this._currentItemId);

                        // If the current item is the first item, loop to the last.
                        if (currentIndex === 0) {
                            return this._idOrdering[this._idOrdering.length - 1];
                        }

                        else {
                            return this._idOrdering[currentIndex - 1];
                        }

                    }

                break;

                case 'right':

                    // If there is no set current id, scroll to the first item.
                    if (this._currentItemId === null) {
                        return this._idOrdering[0];
                    }

                    // If there is a set current id.
                    else {

                        // Get the current id.
                        var currentIndex = this._idOrdering.indexOf(this._currentItemId);

                        // If the current item is the last item, loop to the first.
                        if (currentIndex === this._idOrdering.length - 1) {
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
                self._idToOffset[itemId] = item.position().top;

            });

        },

        /*
         * Vertical scroll to item.
         */
        scrollToItem: function(id) {

            // Fetch the markup and get components.
            var item = this._idToItem[id];

            // If the item is present in the squence tray.
            if (item !== null) {

                // Set the trackers.
                this._currentItem = item;
                this._currentItemId = id;

                // Position at the top of the frame.
                this.element.animate({
                    'scrollTop': this._idToOffset[id] + 1
                }, 300);

            }

        },

        /*
         * DOM hits.
         */


        /*
         * Gloss title and description on mouseenter.
         */
        __highlightItem: function(item) {

            item.stop().animate({
                'background-color': this.options.colors.highlight
            }, 100);

        },

        /*
         * Push title and description back to default state.
         */
        __unhighlightItem: function(item) {

            item.stop().animate({
                'background-color': this.options.colors.background
            }, 100);

        }

    });


})(jQuery);
