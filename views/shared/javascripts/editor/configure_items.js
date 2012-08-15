/**
 * Items dropdown menu.
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


    $.widget('neatline.configureitems', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this.content =              $('#configure-items');
            this.reorderButton =        this.content.find('button.loop');
            this.saveButton =           this.content.find('button.save');

            // Trackers.
            this._isOrdering = false;

            // Construct the dropdown manager and form widgets.
            this._constructDropdown();
            this._constructFormWidgets();

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         *
         * - return void.
         */
        _constructDropdown: function() {
            this.element.nlDropdown();
        },

        /*
         * Instantiate miniColors and integerDragger on the inputs.
         *
         * - return void.
         */
        _constructFormWidgets: function() {

            var self = this;

            // ** REORDER.
            this.reorderButton.bind({

                'mousedown': function() {

                    // End reorder.
                    if (self._isOrdering) {
                        self._trigger('endreorder');
                        self._isOrdering = false;
                        self.reorderButton.removeClass('btn-neatline');
                    }

                    // Start reorder.
                    else {
                        self._trigger('reorder');
                        self._isOrdering = true;
                        self.reorderButton.addClass('btn-neatline');
                    }

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': function() {
                    self.saveOrder();
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        /*
         * Set the order.
         *
         * - param object order: The order object.
         *
         * - return void.
         */
        setOrder: function(order) {
            this.order = order;
        },

        /*
         * Commit the order.
         *
         * - param object order: The order object.
         *
         * - return void.
         */
        saveOrder: function() {

            var self = this;

            // Get ordering.
            this._trigger('getorder');
            console.log('test');

            // Commit.
            $.ajax({

                url: 'ajax/order',
                type: 'POST',
                data: {
                    exhibit_id: Neatline.record.id,
                    order: this.order
                },

                success: function() {
                    self._trigger('neworder');
                }

            });

        }

    });

})( jQuery );
