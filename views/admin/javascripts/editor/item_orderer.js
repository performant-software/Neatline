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


    $.widget('neatline.itemorderer', $.extend({}, $.neatline.neatlineundateditems.prototype, {

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Get the button.
            this.reorderItemsButton = $('#' + this.options.markup.reorder_items_id);

            // Status tracker.
            this._isOrdering = false;

            // Add functionality.
            this._addReorderingFunctionality();

            return $.neatline.neatlineundateditems.prototype._create.apply(this, arguments);

        },

        /*
         * Build on the ordering application.
         */
        _addReorderingFunctionality: function() {

            var self = this;

            this.reorderItemsButton.bind({

                'mousedown': function() {

                    // If the stack is not in ordering mode.
                    if (!self._isOrdering) {

                        // Hide the item descriptions, set tracker.
                        self._hideAllDescriptions();
                        self._isOrdering = true;

                    }

                    // If the stack is in ordering mode, commit the order
                    // and return to normal mode.
                    else {

                        // Show the item descriptions, set tracker.
                        self._showAllDescriptions();
                        self._isOrdering = false;

                    }

                }

            });

        },

        /*
         * Hide the item descriptions.
         */
        _hideAllDescriptions: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                // Get the description.
                var item = $(item);
                var descriptionTd = item.next('tr').find('td.' + self.options.markup.description_td_class);

                // Hide the description.
                self.__contractDescription(descriptionTd);

            });

        },

        /*
         * Show the item descriptions.
         */
        _showAllDescriptions: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                // Get the description.
                var item = $(item);
                var descriptionTd = item.next('tr').find('td.' + self.options.markup.description_td_class);

                // Show the description.
                self.__expandDescription(descriptionTd);

            });

        }

    }));

    $.neatline.neatlineundateditems.defaults = $.extend({}, $.neatline.neatlineundateditems.defaults);


})( jQuery );
