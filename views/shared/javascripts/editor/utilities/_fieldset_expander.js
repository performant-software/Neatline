/**
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

            // The starting expansion status.
            default_status: true,

            // Markup hooks.
            css: {
                expanded: 'fieldset-arrow-down',
                contracted: 'fieldset-arrow-right'
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
            this.fieldset =     this.element.next('div.fieldset');
            this.arrow =        this.element.find('div.fieldset-arrow');

            // Trackers.
            this._expanded = this.options.default_status;

            // Set starting status and bind listeners.
            this._setStartingStatus();
            this._addEvents();

        },

        /*
         * If the starting status is false, hide the fieldset.
         *
         * - return void.
         */
        _setStartingStatus: function() {
            if (!this.options.default_status) this._hideFieldset();
            else this._showFieldset();
        },

        /*
         * Listen for mousedown on the triggering link.
         *
         * - return void.
         */
        _addEvents: function() {

            var self = this;

            this.element.bind({

                'mousedown': function() {
                    if (self._expanded) self._contractFieldset();
                    else self._expandFieldset();
                },

                'click': function(e) {
                    e.preventDefault();
                }

            });

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Disappear the fieldset.
         *
         * - return void.
         */
        _showFieldset: function() {

            // Set height and change arrow.
            this.fieldset.css('height', this.fieldset.get(0).scrollHeight);
            this.arrow.removeClass(this.options.css.contracted);
            this.arrow.addClass(this.options.css.expanded);

            this._trigger('change');
            this._expanded = true;

        },


        /*
         * Appear the fieldset.
         *
         * - return void.
         */
        _hideFieldset: function() {

            // Set height and change arrow.
            this.fieldset.css('height', 0);
            this.arrow.removeClass(this.options.css.expanded);
            this.arrow.addClass(this.options.css.contracted);

            this._trigger('change');
            this._expanded = false;

        },

        /*
         * Animate up the fieldset.
         *
         * - return void.
         */
        _expandFieldset: function() {

            var self = this;

            // Change arrow.
            this.arrow.removeClass(this.options.css.contracted);
            this.arrow.addClass(this.options.css.expanded);

            // Set height.
            this.fieldset.stop().animate({
                height: this.fieldset.get(0).scrollHeight
            }, 100, function() {
                self._trigger('change');
            });

            this._expanded = true;

        },

        /*
         * Animate down the fieldset.
         *
         * - return void.
         */
        _contractFieldset: function() {

            var self = this;

            // Change arrow.
            this.arrow.removeClass(this.options.css.expanded);
            this.arrow.addClass(this.options.css.contracted);

            // Set height.
            this.fieldset.stop().animate({
                height: 0
            }, 100, function() {
                self._trigger('change');
            });

            this._expanded = false;

        },

        /*
         * Get native height of element.
         *
         * - param DOM element: The element.
         *
         * - return void.
         */
        __getNativeHeight: function(element) {

            element.css('overflow', 'auto');
            var height = element[0].scrollHeight;
            element.css('overflow', 'hidden');

            return height;

        },


        /*
         * =================
         * Public methods.
         * =================
         */


        /*
         * Emit expanded tracker.
         *
         * - return void.
         */
        isExpanded: function() {
            return this._expanded;
        }

    });


})( jQuery );
