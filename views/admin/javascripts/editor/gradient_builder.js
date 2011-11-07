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

            // CSS constants.
            css: {
                stop_marker_width_correction: 5
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
         * Set the base color of the editor block and the swatches.
         */
        setColor: function(color) {

            // Store the value.
            this.color = color;

            // Manifest.
            this.editor.css('background', color);
            this.swatches.css('background', color);

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
                    var newLeftPercent = self._leftPercentFromOffset(newOffset);

                    // If the new offset is in bounds.
                    if (newOffset + self.options.css.stop_marker_width_correction >= 0
                       && newLeftPercent < self.rightPercent) {

                        // Manifest new offest.
                        self.leftMarker.css('left', newOffset);

                    }

                    // If the drag extends beyond the position of the
                    // right dragger, fix the left dragger at the same
                    // position as the right.
                    else if (newLeftPercent >= self.rightPercent) {

                        // Get the offset of the right dragger.
                        newOffset = self.editorWidth - self.__pxToInt(self.rightMarker.css('right')) -
                            (2 * (self.options.css.stop_marker_width_correction)) - 1;

                        // Manifest.
                        self.leftMarker.css('left', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.stop_marker_width_correction);
                        self.leftMarker.css('left', newOffset);
                    }

                    // Register the new offest percentage.
                    self.leftPercent = self._leftPercentFromOffset(newOffset);

                    // Build and apply the new css.
                    self._constructCss();
                    self._applyCss();

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
                    var newRightPercent = self._rightPercentFromOffset(newOffset);

                    // If the new offset is in bounds.
                    if (newOffset + self.options.css.stop_marker_width_correction >= 0
                       && newRightPercent > self.leftPercent) {

                        // Manifest new offest.
                        self.rightMarker.css('right', newOffset);

                    }

                    // If the drag extends beyond the position of the
                    // right dragger, fix the left dragger at the same
                    // position as the right.
                    else if (newRightPercent <= self.leftPercent) {

                        // Get the offset of the right dragger.
                        newOffset = self.editorWidth - self.__pxToInt(self.leftMarker.css('left')) -
                            (2 * (self.options.css.stop_marker_width_correction)) - 1;

                        // Manifest.
                        self.rightMarker.css('right', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.stop_marker_width_correction);
                        self.rightMarker.css('right', newOffset);
                    }

                    // Register the new offest percentage.
                    self.rightPercent = self._rightPercentFromOffset(newOffset);

                    // Build and apply the new css.
                    self._constructCss();
                    self._applyCss();

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

            return Math.round(((offset + this.options.css.stop_marker_width_correction)
                    / this.editorWidth) * 100);

        },

        /*
         * Given a right pixel offset, calculate the new relative
         * percentage of the right stop marker.
         */
        _rightPercentFromOffset: function(offset) {

            return Math.round(((this.editorWidth - offset - this.options.css.stop_marker_width_correction)
                    / this.editorWidth) * 100);


        },

        /*
         * Build the css.
         */
        _constructCss: function() {

            // Build the rgba strings.
            var rgb = this.__hexToRgb(this.color);
            var fullOpacity = this.__rgbObjectToCssValue(rgb, 1);
            var zeroOpacity = this.__rgbObjectToCssValue(rgb, 0);

            this.css = ' \
                background: #2989d8; \
                background: -moz-linear-gradient(top,  #1e5799 0%, #2989d8 99%); \
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-stop(99%,#2989d8)); \
                background: -webkit-linear-gradient(left, ' + zeroOpacity + ' 0%, ' + fullOpacity + ' ' + this.leftPercent + '%, ' + fullOpacity + ' ' + this.rightPercent + '%,' + zeroOpacity + ' 99%); \
                background: -o-linear-gradient(top,  #1e5799 0%,#2989d8 99%); \
                background: -ms-linear-gradient(top,  #1e5799 0%,#2989d8 99%); \
                background: linear-gradient(top,  #1e5799 0%,#2989d8 99%); \
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#1e5799", endColorstr="#2989d8",GradientType=0 );';

        },

        /*
         * Apply the new style to the editor block and trigger out with
         * the new value.
         */
        _applyCss: function() {

            // Push the new style onto the editor block.
            this.editor.attr('style', this.css);

        },

        /*
         * Extract an integer value from a css string value of format 'Xpx'.
         * No, jQuery does not provide this.
         */
        __pxToInt: function(px) {

            // Find the location of the 'px'.
            var pxIndex = px.indexOf('px');
            return parseInt(px.slice(0, pxIndex));

        },

        /*
         * Convert hex to rbg array.
         */
        __hexToRgb: function(hex) {

            if (hex[0] == '#') {
                hex = hex.slice(1);
            }

            var r = parseInt(hex.substring(0,2), 16);
            var g = parseInt(hex.substring(2,4), 16);
            var b = parseInt(hex.substring(4,6), 16);

            return {
                'red': r,
                'green': g,
                'blue': b
            };

        },

        /*
         * Convert rbg array to valid css value.
         */
        __rgbObjectToCssValue: function(rgb, alpha) {

            return 'rgba(' + rgb.red + ', ' + rgb.green + ', ' + rgb.blue + ', ' + alpha + ')';

        }

    });


})( jQuery );
