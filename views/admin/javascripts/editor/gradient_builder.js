/*
 * Gradient builder application for item edit forms.
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


    $.widget('neatline.gradientbuilder', {

        options: {

            // Markup hooks.
            markup: {
                editor_class: 'date-ambiguity-editor',
                color_swatch_class: 'color-swatch',
                left_marker_class: 'stop-marker.left',
                right_marker_class: 'stop-marker.right'
            },

            // Animation constants.
            animation: {

            },

            // CSS constants.
            css: {
                stop_marker_width_correction: 5
            },

            // Hexes.
            colors: {

            }

        },

        /*
         * Get markup, shell out trackers, position the stop markers.
         */
        _create: function() {

            // Getters.
            this._window = $(window);
            this.editor = this.element.find('.' + this.options.markup.editor_class);
            this.leftMarker = this.element.find('.' + this.options.markup.left_marker_class);
            this.rightMarker = this.element.find('.' + this.options.markup.right_marker_class);
            this.swatches = this.element.find('.' + this.options.markup.color_swatch_class)

            // Percentage trackers.
            this.leftPercent = null;
            this.rightPercent = null;

            // Measure markup.
            this._getDimensions();

            // Position the stop markers.
            this.positionMarkers(0, 100);

            // Add events to markers.
            this._addEvents();

        },

        /*
         * Get the size and position of the editor block.
         */
        _getDimensions: function() {

            this.editorWidth = this.editor.width();
            this.editorHeight = this.editor.height();
            this.editorOffset = this.editor.offset();

        },

        /*
         * Set the starting positions of the markers. The percentage
         * parameters define the distance of the left and right markers
         * from the left boundary of the editor block as a percentage
         * of the total width.
         */
        positionMarkers: function(leftPercent, rightPercent) {

            // Calculate offets.
            var leftDecimal = leftPercent / 100;
            var rightDecimal = rightPercent / 100;
            var leftOffset = this.editorWidth * leftDecimal;
            var rightOffset = this.editorWidth - (this.editorWidth * rightDecimal);

            // Position.
            this.leftMarker.css({
                'left': leftOffset - this.options.css.stop_marker_width_correction,
                'top': this.editorHeight
            });

            this.rightMarker.css({
                'right': rightOffset - this.options.css.stop_marker_width_correction,
                'top': this.editorHeight
            });

            // Set the trackers.
            this.leftPercent = leftPercent;
            this.rightPercent = rightPercent;

        },

        /*
         * Set the base color of the editor block.
         */
        setColor: function(color) {

            this.editor.css('background', color);

        },

        /*
         * Add the dragging functionality to the stop markers.
         */
        _addEvents: function() {

            var self = this;

            // Left handle.
            this.leftMarker.bind({
                'mousedown': function(e) {
                    self._doLeftDrag(e);
                }
            });

            // Right handle.
            this.rightMarker.bind({
                'mousedown': function(e) {
                    self._doRightDrag(e);
                }
            });

        },

        /*
         * Manifest a left stop marker drag.
         */
        _doLeftDrag: function(event) {

            var self = this;

            // Capture the starting mouse position and offset.
            var startingX = event.pageX;
            var startingOffset = this.__pxToInt(this.leftMarker.css('left'));

            // Add the mousemove event to the window.
            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offset.
                    var xDelta = e.pageX - startingX;
                    var newOffset = startingOffset + xDelta;

                    // If the new offset is in bounds.
                    if (newOffset + self.options.css.stop_marker_width_correction >= 0) {

                        // Manifest new offest.
                        self.leftMarker.css('left', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.stop_marker_width_correction);
                        self.leftMarker.css('left', newOffset);
                    }

                    // Register the new offest percentage.
                    self.leftPercent = self._leftPercentFromOffset(newOffset);

                },

                'mouseup': function() {

                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Manifest a right stop marker drag.
         */
        _doRightDrag: function(event) {

            var self = this;

            // Capture the starting mouse position and offset.
            var startingX = event.pageX;
            var startingOffset = this.__pxToInt(this.rightMarker.css('right'));

            // Add the mousemove event to the window.
            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offset.
                    var xDelta = e.pageX - startingX;
                    var newOffset = startingOffset - xDelta;

                    // If the new offset is in bounds.
                    if (newOffset + self.options.css.stop_marker_width_correction >= 0) {

                        // Manifest new offest.
                        self.rightMarker.css('right', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.stop_marker_width_correction);
                        self.rightMarker.css('right', newOffset);
                    }

                    // Register the new offest percentage.
                    self.rightPercent = self._rightPercentFromOffset(newOffset);

                },

                'mouseup': function() {

                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Given a left pixel offset, calculate the new relative
         * percentage of the left stop marker.
         */
        _leftPercentFromOffset: function(offset) {



        },

        /*
         * Given a right pixel offset, calculate the new relative
         * percentage of the right stop marker.
         */
        _rightPercentFromOffset: function(offset) {



        },

        /*
         * Extract an integer value from a css string value of format 'Xpx'.
         * No, jQuery does not provide this.
         */
        __pxToInt: function(px) {

            // Find the location of the 'px'.
            var pxIndex = px.indexOf('px');
            return parseInt(px.slice(0, pxIndex));

        }

    });


})( jQuery );
