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


    $.widget('neatline.itemorderer', $.extend(
        {}, $.neatline.neatlineitems.prototype, {

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Trackers.
            this._isOrdering = false;
            this._dragId = null;

            return $.neatline.neatlineitems.prototype._create.apply(
                this,
                arguments
            );

        },

        /*
         * Build an array of the starting record id ordering.
         */
        _getRowOrder: function() {

            var self = this;
            this._order = [];

            // Re-get the items.
            var items = this.element.find('.item-title');

            // Walk the items.
            $.each(items, function(i, item) {

                var item = $(item);
                self._order.push(parseInt(item.attr('recordid')));

            });

        },

        /*
         * Build on the ordering application.
         */
        reorder: function() {

            // If there is an expanded description, close it.
            if (!_.isNull(this._currentRecord)) {
                this.contractDescription(this._currentRecord);
            }

            // Disable selection.
            this.element.disableSelection();

            // Hide the item descriptions, set tracker.
            this.__hideAllDescriptions();
            this._addOrderingEventsToItems();
            this._isOrdering = true;

            // Register the row order.
            this._getRowOrder();

        },

        /*
         * Remove the ordering application, return the order.
         */
        endreorder: function() {

            // Change the cursor.
            this.__setPointerCursor();

            // Recalculate native item offsets.
            this._getItemOffsets();
            this._removeOrderingEventsToItems();
            this._isOrdering = false;

            return this.objectifyOrder();

        },

        /*
         * Bind the dragging functionality onto the rows.
         */
        _addOrderingEventsToItems: function() {

            var self = this;

            // Set the cursor.
            self.__setMoveCursor();

            // Walk the items.
            $.each(this.items, function(i, item) {

                var item = $(item);

                // Strip off the default mousedown glossing.
                item.unbind('mousedown');

                // Bind on the click and move events.
                item.bind('mousedown', function() {
                    self._doItemDrag(item);
                });

            });

        },

        /*
         * Return the rows to normal state.
         */
        _removeOrderingEventsToItems: function() {

            var self = this;

            // Walk the items.
            $.each(this.items, function(i, item) {

                var item = $(item);
                item.unbind('mousedown');

            });

            // Regloss the items as normal.
            this.loadData();

        },

        /*
         * Drag item.
         */
        _doItemDrag: function(dragItem) {

            var self = this;

            // Get the description row.
            var dragDescription = dragItem.next('li.item-description');

            // Register the starting row order.
            this._getRowOrder();

            // Track the drag id.
            this._dragId = parseInt(dragItem.attr('recordid'));

            // Gray out the item.
            this.__fadeItem(dragItem);

            // On each of the items, listen for mouseenter.
            $.each(this.items, function(i, item) {

                var item = $(item);
                var enterItemId = parseInt(item.attr('recordid'));

                // Get the item description.
                var enterDescription = item.next('li.item-description');

                item.bind({

                    'mouseenter': function() {

                        // If the new item different from the item being dragged.
                        if (enterItemId != self._dragId) {

                            // If the item being dragged is currently below the item
                            // that is being dragged into.
                            if (self._order.indexOf(enterItemId)
                                < self._order.indexOf(self._dragId)) {

                                dragItem.detach().insertBefore(item);
                                dragDescription.detach().insertAfter(dragItem);

                            }

                            // If the item being dragged is currently above the item
                            // that is being dragged into.
                            else if (self._order.indexOf(enterItemId) >
                                     self._order.indexOf(self._dragId)) {

                                dragItem.detach().insertAfter(enterDescription);
                                dragDescription.detach().insertAfter(dragItem);

                            }

                        }

                        // Update the ordering and title offsets.
                        self._getRowOrder();

                    }

                });

            });

            // Listen for mouseup on window.
            this._window.bind({

                // Pop off the events, fade up.
                'mouseup': function() {
                    self._endItemDrag(dragItem);
                }

            });

        },

        /*
         * Close out an item drag.
         */
        _endItemDrag: function(dragItem) {

            this.__unfadeItem(dragItem);
            this._window.unbind('mouseup');
            this.items.unbind('mouseenter');

        },

        /*
         * DOM hits.
         */
        /*
         * Hide the item descriptions.
         */
        __hideAllDescriptions: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                // Get the description.
                var item = $(item);
                var description = item.next('li.item-description');

                // Hide the description.
                description.css('display', 'none');

            });

        },

        /*
         * Set move cursor on item.
         */
        __setMoveCursor: function() {

            $.each(this.items, function(i, item) {
                $(item).css('cursor', 'move');
            });

        },

        /*
         * Set pointer cursor on item.
         */
        __setPointerCursor: function() {

            $.each(this.items, function(i, item) {
                $(item).css('cursor', 'pointer');
            });

        },

        /*
         * Gray out an item.
         */
        __fadeItem: function(item) {

            item.css('opacity', 0.4);

        },

        /*
         * Fade up an item.
         */
        __unfadeItem: function(item) {

            item.css('opacity', 1);

        },

        /*
         * Gray out the items.
         */
        __fadeItems: function() {

            this.items.animate({
                'opacity': 0.3
            }, 200);

        },

        /*
         * Return the items to full opacity.
         */
        __unfadeItems: function() {

            this.items.animate({
                'opacity': 1
            }, 200);

        },

        /*
         * Convert the ordering array into an object literal of format
         * recordid => order integer.
         */
        objectifyOrder: function() {

            var order = {};
            $.each(this._order, function(i, recordid) {
                order[recordid] = i;
            });

            return order;

        }

    }));

    $.neatline.neatlineitems.defaults = $.extend(
        {},$.neatline.neatlineitems.defaults);


})( jQuery );
