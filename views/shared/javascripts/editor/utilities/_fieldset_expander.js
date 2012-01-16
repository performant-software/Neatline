/*
 * Expand and contract fieldsets.
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


    $.widget('neatline.fieldsetexpander', {

        options: {

            arrow: {
                'class': 'fieldset-expander'
            }

        },

        /*
         * Construct the expander arrow, set starting state, bind events.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this._body =        $('body');
            this._window =      $(window);

            // Bind listeners.
            this._addEvents();

        },

        /*
         * Construct and position the arrow.
         *
         * - return void.
         */
        _buildArrow: function() {

            // Construct.
            this.arrow = $('<span></span>')
                .addClass(this.options.arrow['class'])
                .text(this.options.arrow.text)
                .css('position', 'absolute');

        },

        /*
         * Listen for mousedown on the triggering link.
         *
         * - return void.
         */
        _addEvents: function() {

            var self = this;

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * .
         *
         * - return void.
         */
        _stub: function() {

        },

    });


})( jQuery );
