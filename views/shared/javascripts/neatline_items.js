/**
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
         * .
         *
         * - return void.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.listContainer =            $('#items-container');

            // Trackers.
            this._idToItem =                {};
            this._slugToItem =              {};
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
         *
         * - return void.
         */
        loadData: function() {
            this._getItems();
        },

        /*
         * Populate content.
         *
         * - return void.
         */
        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: Neatline.dataSources.undated,
                dataType: 'json',

                success: function(data) {
                    self._renderItems(data);
                    self._glossItems();
                    self._trigger('newitems');
                }

            });

        },

        /*
         * On window resize, recompute the top offsets.
         *
         * - return void.
         */
        _addResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self._getItemOffsets();
            });

        },

        /*
         * Render item listings from JSON.
         *
         * - param object json: The items json.
         *
         * - return void.
         */
        _renderItems: function(json) {

        },

        /*
         * Once the raw markup is from the items ajax query is pushed into the
         * container, build the functionality for each item.
         *
         * - return void.
         */
        _glossItems: function() {

            var self = this;

            // Get the new items.
            this.items = this.listContainer.find('.item-title');

            // Initialize the database.
            this._db = TAFFY();

            // Bind events to the item rows.
            $.each(this.items, function(i, item) {

                // Get item id and description.
                var item = $(item);
                var description = item.next('li.item-description');
                var recordid = parseInt(item.attr('recordid'), 10);
                var slug = item.attr('slug');

                // Set expanded tracker, push onto ordering.
                item.data('expanded', false);
                self._idOrdering.push(recordid);

                // Populate database.
                self._db.insert({
                    recordid: recordid,
                    slug: slug,
                    markup: item
                });

                // Unbind all events.
                item.add(description).unbind();

                // Disable selection on the titles.
                item.disableSelection();

                // Listen for events.
                item.bind({

                    'mousedown': function() {

                        // If hidden, expand.
                        if (!item.data('expanded')) {

                            // Expand description.
                            self.scrollToItem(recordid);

                            // Trigger out to the deployment code.
                            self._trigger('itemclick', {}, {
                                'recordid': recordid,
                                'slug': slug,
                                'scrollItems': true
                            });

                        }

                        // If expanded, hide.
                        else {
                            self.contractDescription(item);
                        }

                    },

                    // Highlight.
                    'mouseenter': function() {

                        // Gloss the title.
                        self.__highlightItem(item);

                        // Trigger out to the deployment code.
                        self._trigger('itementer', {}, {
                            'recordid': recordid,
                            'slug': slug
                        });

                    },

                    // Un-highlight.
                    'mouseleave': function() {

                        // De-gloss the title.
                        self.__unhighlightItem(item);

                        // Trigger out to the deployment code.
                        self._trigger('itemleave', {}, {
                            'recordid': recordid,
                            'slug': slug
                        });
                    }

                });

            });

            // Register the native top offsets.
            this._getItemOffsets();

        },

        /*
         * Scroll to the right.
         *
         * - return void.
         */
        scrollRight: function() {

            // Compute the new id.
            var newId = this.getNewScrollId('right');

            // Get the record.
            var record = this._db({ recordid: newId }).first();

            // Trigger out to the deployment code.
            this._trigger('itemclick', {}, {
                'recordid': newId,
                'slug': record.slug,
                'scrollItems': true
            });

        },

        /*
         * Scroll to the right.
         *
         * - return void.
         */
        scrollLeft: function() {

            // Compute the new id.
            var newId = this.getNewScrollId('left');

            // Get the record.
            var record = this._db({ recordid: newId }).first();

            // Trigger out to the deployment code.
            this._trigger('itemclick', {}, {
                'recordid': newId,
                'slug': record.slug,
                'scrollItems': true
            });

        },

        /*
         * Figure out the id of the item that should be scrolled to. Direction
         * is 'left' or 'right'.
         *
         * - param string direction: 'left' or 'right'.
         *
         * - return integer: The id of the new item.
         */
        getNewScrollId: function(direction) {

            switch (direction) {

                case 'left':

                    // If there is no set current id, scroll to the last item.
                    if (_.isNull(this._currentItemId)) {
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
                    if (_.isNull(this._currentItemId)) {
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
         *
         * - return void.
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
         * Expand the description.
         *
         * - param DOM item: The <li> of the item to expand.
         *
         * - return void.
         */
        expandDescription: function(item) {

            var self = this;

            // Capture the id of the new record, get description.
            var recordId = item.attr('recordid');
            var description = item.next('li');

            // Mark the title as active.
            this.__activateTitle(item);

            // Only show the description if it has content.
            if (description.html() !== '') {

                // Show and measure the description.
                description.css('display', 'list-item');
                var height = description[0].scrollHeight;

                // Expand.
                description.animate({ 'height': height }, 200);

            }

            // Set trackers.
            self._currentItem = item;
            self._currentItemId = parseInt(item.attr('recordid'), 10);
            item.data('expanded', true);

        },

        /*
         * Expand the description.
         *
         * - param DOM item: The <li> of the item to expand.
         *
         * - return void.
         */
        contractDescription: function(item) {

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
         * DOM hits.
         */


        /*
         * Vertical scroll to item.
         *
         * - param integer id: The recordid of the item to scroll to.
         *
         * - return void.
         */
        scrollToItem: function(id) {

            var record = this._db({ recordid: parseInt(id, 10) }).first();
            this._showRecord(record);

        },

        /*
         * Vertical scroll to item by slug.
         *
         * - param integer slug: The slug of the item to scroll to.
         *
         * - return void.
         */
        scrollToItemBySlug: function(slug) {

            var record = this._db({ slug: slug }).first();
            this._showRecord(record);

        },

        /*
         * Scroll to a record.
         *
         * - param DOM item: The item to scroll to.
         *
         * - return void.
         */
        _showRecord: function(record) {

            // If the item is present in the squence tray.
            if (record) {

                // If another item is expanded, hide.
                if (this._currentItemId !== null &&
                    this._currentItemId !== record.recordid) {
                        this.__hideCurrentDescription();
                        this._currentItem.data('expanded', false);
                }

                // Get the new scrollTop.
                var scrollTop = record.markup.position().top +
                    this.element.scrollTop();

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
                this.expandDescription(record.markup);

            }

        },

        /*
         * Gloss title and description on mouseenter.
         *
         * - param DOM item: The <li> of the item to expand.
         *
         * - return void.
         */
        __highlightItem: function(item) {
            item.css('background-color', this.options.colors.highlight);
        },

        /*
         * Push title and description back to default state.
         *
         * - param DOM item: The <li> of the item to expand.
         *
         * - return void.
         */
        __unhighlightItem: function(item) {
            item.css('background-color', this.options.colors.background);
        },

        /*
         * Pop the title as active.
         *
         * - param DOM item: The <li> of the item to expand.
         *
         * - return void.
         */
        __activateTitle: function(item) {

            // If the title it not already activated.
            if (!item.data('expanded')) {

                // Get data attributes.
                var recordid = parseInt(item.attr('recordid'), 10);
                var slug = item.attr('slug');

                // Fade up and grow title.
                item.stop().animate({
                    'font-size': '+=5px',
                    'color': this.options.colors.purple
                }, 100);

                // Trigger out to the deployment code.
                this._trigger('itemactivate', {}, {
                    'recordid': recordid,
                    'slug': slug,
                    'scrollItems': true
                });

            }

        },

        /*
         * Return the title to normal.
         *
         * - param DOM item: The <li> of the item to expand.
         * - param boolean immediate: If true, .css() instead of .animate();
         *
         * - return void.
         */
        __deactivateTitle: function(item, immediate) {

            // Halt if the item is not currently activated.
            if (item.data('expanded')) {

                // Get data attributes.
                var recordid = parseInt(item.attr('recordid'), 10);
                var slug = item.attr('slug');

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

                // Trigger out to the deployment code.
                this._trigger('itemdeactivate', {}, {
                    'recordid': recordid,
                    'slug': slug,
                    'scrollItems': true
                });

            }

        },

        /*
         * Dissapear the currently-expanded description.
         *
         * - return void.
         */
        __hideCurrentDescription: function() {

            // Deactivate the title.
            if (!_.isNull(this._currentItem)) {

                // Deactivate the title.
                this.__deactivateTitle(this._currentItem, true);

                // Hide the description.
                this._currentItem.next('li').css({
                    'height': 0,
                    'display': 'none'
                });

            }

        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return mixed attr: The value of the attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        },

        /*
         * Set a class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return void.
         */
        setAttr: function(attr, value) {
            return this[attr] = value;
        }

    });


})(jQuery);
