/*
 * A simple gloss on a text input that lets the user click and drag up
 * or down to change the integer value of the input.
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


    $.widget('neatline.integerdragger', {

        options: {

            // The minimum possible value. If null, -inf.
            min: null,

            // The maximum possible value. If null, +inf.
            max: null,

            // The default value.
            default: 0,

            // Pixels of cursor movement per integer change.
            px_per_unit: 5,

            // Tooltip parameters.
            tip: {

                // Enable/disable.
                show: true,

                // Content.
                text: 'click and drag',

                // Left padding.
                padding: 10,

                // Element class.
                'class': 'intdragger-tooltip'

            }

        },

        /*
         * Set starting value, call methods to bind events.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this._body =        $('body');
            this._window =      $(window);

            // Trackers.
            this.currentVal = null;
            this.isDragging = false;

            // Set the starting value.
            this._setInputValue(this.options.default);

            // Build the tooltip.
            if (this.options.tip.show) {
                this._buildToolTip();
            }

            // Bind listeners.
            this._addEvents();

        },

        /*
         * Construct and measure the tooltip.
         *
         * - return void.
         */
        _buildToolTip: function() {

            // Construct.
            this.tip = $('<span></span>')
                .addClass(this.options.tip.class)
                .text(this.options.tip.text)
                .css('position', 'absolute');

            // Measure.
            this.tipHeight = this._measureToolTip();
            this.inputHeight = this.element.outerHeight(false);
            this.inputWidth = this.element.outerWidth();

        },

        /*
         * Listen for mouseenter, mouseleave, mousedown, mouseup and drag.
         *
         * - return void.
         */
        _addEvents: function() {

            var self = this;

            this.element.bind({

                // Show the tooltip.
                'mouseenter': function() {
                    if (self.options.tip.show && !self.isDragging) {
                        self._showToolTip();
                    }
                },

                // Hide the tooltip.
                'mouseleave': function() {
                    if (self.options.tip.show && !self.isDragging) {
                        self._hideToolTip();
                    }
                },

                // Listen for drag.
                'mousedown': function(e) {

                    // Set dragging tracker.
                    self.isDragging = true;

                    // Capture starting y-offset and value.
                    var startY = e.pageY;
                    var startVal = self.currentVal;

                    self._window.bind({

                        // On move, compute y-delta and apply.
                        'mousemove': function(e) {
                            var yDelta = (startY - e.pageY) / self.options.px_per_unit;
                            self._setInputValue(startVal + Math.round(yDelta));
                        },

                        // Strip drag listener
                        'mouseup': function() {
                            self.isDragging = false;
                            self._window.unbind('mousemove');
                            self._hideToolTip();
                        }

                    });

                }

            });

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Set the input's value, update tracker.
         *
         * - param integer val: The value.
         *
         * - return boolean: True if the value is permissible and the
         *   change is manifested, False if the value is impermissible.
         */
        _setInputValue: function(val) {

            // If a min is set, and the passed val is too small.
            if (this.options.min != null && val < this.options.min) {
                this.element.val(this.options.min);
                this.currentVal = this.options.min;
                return false;
            }

            // If a max is set, and the passed val is too large.
            if (this.options.max != null && val > this.options.max) {
                this.element.val(this.options.max);
                this.currentVal = this.options.max;
                return false;
            }

            // If passed val is permissible.
            this.element.val(val);
            this.currentVal = val;

            // Emit new value.
            this._trigger('change', {}, {
                value: this.currentVal
            });

            return true;

        },

        /*
         * Compute the height of the tooltip.
         *
         * - return integer: The height of the tip.
         */
        _measureToolTip: function() {

            // Inject, measure, detach.
            this.tip.css({ top: -1000, left: -1000 })
                .appendTo(this._body);

            return this.tip.height();

        },

        /*
         * Show the instruction tooltip to the right of the input.
         *
         * - return void.
         */
        _showToolTip: function() {

            // Get input offset, compute tip top offset.
            var elOff = this.element.offset();
            var topOffset = ((this.inputHeight - this.tipHeight) / 2);

            // Position.
            this.tip.css({
                top: elOff.top + topOffset,
                left: elOff.left + this.inputWidth + this.options.tip.padding,
                opacity: 0
            });

            // Inject and show.
            this._body.append(this.tip);
            this.tip.animate({ opacity: 1 }, 200)

        },

        /*
         * Destroy the instruction tooltip.
         *
         * - return void.
         */
        _hideToolTip: function() {

            var self = this;

            this.tip.animate({ opacity: 0 }, 200, function() {
                self.tip.remove();
            })

        }

    });


})( jQuery );
