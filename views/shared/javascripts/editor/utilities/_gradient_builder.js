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

            // CSS constants.
            css: {
                width_offset: 5
            }

        },

        /*
         * Get markup, shell out trackers, position the stop markers.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this.editor =                   this.element.find('.date-ambiguity-editor');
            this.leftMarker =               this.element.find('.stop-marker.left');
            this.rightMarker =              this.element.find('.stop-marker.right');
            this.swatches =                 this.element.find('.color-swatch')
            this.leftPercentInput =         this.element.find('input[name="left-ambiguity-percentage"]');
            this.rightPercentInput =        this.element.find('input[name="right-ambiguity-percentage"]');

            // Percentage trackers.
            this.leftPercent = parseInt(this.leftPercentInput.val());
            this.rightPercent = parseInt(this.rightPercentInput.val());

            // Measure markup.
            this.getDimensions();

            // Position the stop markers.
            this.positionMarkers(this.leftPercent, this.rightPercent);

            // Instantiate the span styler on the edit block.
            this.editor.spanstyler();

            // Add events to markers.
            this._addEvents();

        },

        /*
         * Get the size and position of the editor block.
         */
        getDimensions: function() {

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
                'left': leftOffset - this.options.css.width_offset,
                'top': this.editorHeight
            });

            this.rightMarker.css({
                'right': rightOffset - this.options.css.width_offset,
                'top': this.editorHeight
            });

            // Set the trackers and inputs.
            this.leftPercent = leftPercent;
            this.leftPercentInput.val(leftPercent);
            this.rightPercent = rightPercent;
            this.rightPercentInput.val(rightPercent);

        },

        /*
         * Set the base color of the editor block and the swatches.
         */
        setColor: function(color) {

            // Store the value.
            this.color = color;

            // Manifest the color on the block.
            this.editor.spanstyler('constructCss', color, this.leftPercent, this.rightPercent);
            this.editor.spanstyler('applyCss');

            // Change the colors of the stop markers.
            this.swatches.css('background', color);

        },

        /*
         * Recalculate the dimensions, push updated css.
         */
        refresh: function() {

            this.getDimensions();
            this.positionMarkers(this.leftPercent, this.rightPercent);
            this.setColor(this.color);

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
                    if (newOffset + self.options.css.width_offset >= 0
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
                            (2 * (self.options.css.width_offset)) - 1;

                        // Manifest.
                        self.leftMarker.css('left', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.width_offset);
                        self.leftMarker.css('left', newOffset);
                    }

                    // Register the new offest percentage and manifest
                    // the value in the hidden input.
                    self.leftPercent = self._leftPercentFromOffset(newOffset);
                    self.leftPercentInput.val(self.leftPercent);

                    // Build and apply the new css.
                    self.editor.spanstyler('constructCss', self.color, self.leftPercent, self.rightPercent);
                    self.editor.spanstyler('applyCss');

                    // Trigger the change out to the item editor.
                    self._trigger('stopHandleDrag', {}, {
                        'color': self.color,
                        'leftPercent': self.leftPercent,
                        'rightPercent': self.rightPercent
                    });

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
                    if (newOffset + self.options.css.width_offset >= 0
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
                            (2 * (self.options.css.width_offset)) - 1;

                        // Manifest.
                        self.rightMarker.css('right', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.width_offset);
                        self.rightMarker.css('right', newOffset);
                    }

                    // Register the new offest percentage and manifest
                    // the new value in the hidden input.
                    self.rightPercent = self._rightPercentFromOffset(newOffset);
                    self.rightPercentInput.val(self.rightPercent);

                    // Build and apply the new css.
                    self.editor.spanstyler('constructCss', self.color, self.leftPercent, self.rightPercent);
                    self.editor.spanstyler('applyCss');

                    // Trigger the change out to the item editor.
                    self._trigger('stopHandleDrag', {}, {
                        'color': self.color,
                        'leftPercent': self.leftPercent,
                        'rightPercent': self.rightPercent
                    });

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

            return Math.round(((offset + this.options.css.width_offset)
                    / this.editorWidth) * 100);

        },

        /*
         * Given a right pixel offset, calculate the new relative
         * percentage of the right stop marker.
         */
        _rightPercentFromOffset: function(offset) {

            return Math.round(((this.editorWidth - offset - this.options.css.width_offset)
                    / this.editorWidth) * 100);


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
