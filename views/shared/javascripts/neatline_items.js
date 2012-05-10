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
            this._currentRecord =           null;
            this._currentRecordId =         null;
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

                    // Render records.
                    self._renderItems(data);
                    self._trigger('newitems');

                    // Set starting visibility.
                    self._setStartingVisibility();

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

            // Initialize the database.
            this._db = TAFFY();

            // Clear list.
            this.listContainer.empty();

            // Walk items.
            _.each(json, _.bind(function(record) {

                // Build markup.
                var title = $('<li class="item-title" />');
                var description = $('<li class="item-description" />');

                // Populate.
                title.html(record.title);
                title.attr('recordid', record.id);
                description.html(record.description);

                // Ineject markup.
                this.listContainer.append(title, description);

                // Set expanded tracker, push onto ordering.
                title.data('expanded', false);
                this._idOrdering.push(record.id);

                // Database record.
                var taffyRecord = {
                    recordid: record.id,
                    slug: record.slug,
                    title: title,
                    description: description,
                    start_visible_date: record.start_visible_date,
                    end_visible_date: record.end_visible_date
                };

                // Insert record.
                this._db.insert(taffyRecord);

                // Bind events to the title.
                title.bind({

                    // Open description.
                    'mousedown': _.bind(function() {

                        // If hidden, expand.
                        if (!title.data('expanded')) {

                            // Expand description.
                            this.scrollToItem(record.id);

                            // Trigger out to the deployment code.
                            this._trigger('itemclick', {}, {
                                'recordid': record.id,
                                'slug': record.slug,
                                'scrollItems': true
                            });

                        }

                        // If expanded, hide.
                        else {
                            this.contractDescription(taffyRecord);
                        }

                    }, this),

                    // Highlight.
                    'mouseenter': _.bind(function() {

                        // Gloss the title.
                        this.__highlightItem(title);

                        // Trigger out to the deployment code.
                        this._trigger('itementer', {}, {
                            'recordid': record.id,
                            'slug': record.slug
                        });

                    }, this),

                    // Un-highlight.
                    'mouseleave': _.bind(function() {

                        // De-gloss the title.
                        this.__unhighlightItem(title);

                        // Trigger out to the deployment code.
                        this._trigger('itemleave', {}, {
                            'recordid': record.id,
                            'slug': record.slug
                        });

                    }, this)

                });

            }, this));

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
                    if (_.isNull(this._currentRecordId)) {
                        return this._idOrdering[this._idOrdering.length - 1];
                    }

                    // If there is a set current id.
                    else {

                        // Get the current id.
                        var currentIndex = this._idOrdering.indexOf(this._currentRecordId);

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
                    if (_.isNull(this._currentRecordId)) {
                        return this._idOrdering[0];
                    }

                    // If there is a set current id.
                    else {

                        // Get the current id.
                        var currentIndex = this._idOrdering.indexOf(this._currentRecordId);

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
         * - param object record: The TaffyDB record for the item.
         *
         * - return void.
         */
        expandDescription: function(record) {

            // Mark the title as active.
            this.__activateTitle(record);

            // Only show the description if it has content.
            if (record.description.html() !== '') {

                // Show and measure the description.
                record.description.css('display', 'list-item');
                var height = record.description[0].scrollHeight;

                // Expand.
                record.description.animate({ 'height': height }, 200);

            }

            // Set trackers.
            this._currentRecord = record;
            this._currentRecordId = record.recordid;
            record.title.data('expanded', true);

        },

        /*
         * Expand the description.
         *
         * - param object record: The TaffyDB record for the item.
         *
         * - return void.
         */
        contractDescription: function(record) {

            // Mark the title as inactive.
            this.__deactivateTitle(record);

            // Contract and hide.
            record.description.animate({
                'height': 0
            }, 200, function() {
                record.description.css('display', 'none');
            });

            // Set trackers.
            this._currentRecord = null;
            this._currentRecordId = null;
            record.title.data('expanded', false);

        },

        /*
         * Filter feature visibility by date.
         *
         * - param string date: The current timeline date.
         *
         * - return void.
         */
        renderVisibility: function(date) {

            // Moment-ify the date.
            var now = moment(date);

            // Walk records.
            this._db().each(_.bind(function(record) {

                // Get record dates.
                var start = moment(Date.parse(record.start_visible_date));
                var end = moment(Date.parse(record.end_visible_date));

                // If both are defined.
                if (!_.isNull(start) && !_.isNull(end)) {
                    var display = now > start && now < end;
                    this._displayRecord(record, display);
                }

                // If just the start is defined.
                else if (!_.isNull(start) && _.isNull(end)) {
                    var display = now > start;
                    this._displayRecord(record, display);
                }

                // If just the end is defined.
                else if (_.isNull(start) && !_.isNull(end)) {
                    var display = now < end;
                    this._displayRecord(record, display);
                }

            }, this));

        },

        /*
         * Set starting visibility.
         */
        _setStartingVisibility: function() {

            // Use default focus if present.
            if (Neatline.record.default_focus_date) {
                this.renderVisibility(Neatline.record.default_focus_date);
            }

            // Otherwise, use the current time.
            else {
                this.renderVisibility(Date.now());
            }

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
         * Show or hide a record.
         *
         * - param object record: The TaffyDB record.
         * - param boolean display: True to show, false to hide.
         *
         * - return void.
         */
        _displayRecord: function(record, display) {

            if (display) {

                // Show the title.
                record.title.css('display', 'list-item');

                // If the title is expanded, show description.
                if (record.title.data('expanded')) {
                    record.description.css('display', 'list-item');
                }

            }

            else {
                record.title.css('display', 'none');
                record.description.css('display', 'none');
            }

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
                if (this._currentRecordId !== null &&
                    this._currentRecordId !== record.recordid) {
                        this.__hideCurrentDescription();
                        this._currentRecord.title.data('expanded', false);
                }

                // Get the new scrollTop.
                var scrollTop = record.title.position().top +
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
                this.expandDescription(record);

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
         * - param object record: TaffyDB record.
         *
         * - return void.
         */
        __activateTitle: function(record) {

            // If the title it not already activated.
            if (!record.title.data('expanded')) {

                // Fade up and grow title.
                record.title.stop().animate({
                    'font-size': '+=5px',
                    'color': this.options.colors.purple
                }, 100);

                // Trigger out to the deployment code.
                this._trigger('itemactivate', {}, {
                    'recordid': record.id,
                    'slug': record.slug,
                    'scrollItems': true
                });

            }

        },

        /*
         * Return the title to normal.
         *
         * - param object record: TaffyDB record.
         * - param boolean immediate: If true, .css() instead of .animate();
         *
         * - return void.
         */
        __deactivateTitle: function(record, immediate) {

            // Halt if the item is not currently activated.
            if (record.title.data('expanded')) {

                // If not immediate, animate down.
                if (!immediate) {
                    record.title.stop().animate({
                        'font-size': '-=5px',
                        'color': this.options.colors.title
                    }, 100);
                }

                // If immediate, manifest directly.
                else {
                    record.title.css({
                        'font-size': '-=5px',
                        'color': this.options.colors.title
                    });
                }

                // Trigger out to the deployment code.
                this._trigger('itemdeactivate', {}, {
                    'recordid': record.id,
                    'slug': record.slug,
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
            if (!_.isNull(this._currentRecord)) {

                // Deactivate the title.
                this.__deactivateTitle(this._currentRecord);

                // Hide the description.
                this._currentRecord.description.css({
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
