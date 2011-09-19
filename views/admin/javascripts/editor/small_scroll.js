/*
 * Widget to add small, non-browser-default scrollbar to tight UX elements.
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


    $.widget('neatline.smallscroll', {

        options: {

            // CSS and tween constants.
            slide_region_padding: 20,
            bar_right_offset: 8,
            default_opacity: 0.2,
            highlight_opacity: 0.9,
            highlight_width_percentage: 20,
            fade_duration: 300,

            // Hexes.
            colors: {
                purple: '#724E85',
                gray: '#c3c3c3'
            }

        },

        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');

            // Initialize trackers.
            this._is_scrolling = false;
            this._at_top = true;
            this._at_bottom = true;

            // Add the scroller.
            this._addBar();

        },

        _destroy: function() {



        },

        _addBar: function() {

            var self = this;

            // Construct the slider bar and the highlight region div.
            this.highlightRegion = $('<div class="highlight-region"></div>');
            this.bar = $('<div class="small-scrollbar"></div>');

            // Inject.
            this.element.append(this.highlightRegion);
            this.highlightRegion.append(this.bar);

            // Fade in the bar.
            this.bar.animate({
                'opacity': this.options.default_opacity
            }, this.options.fade_duration);

            // Position.
            this._positionBar();

            // ** Glossers.

            this.highlightRegion.bind({

                'mouseenter': function() {

                    self.bar.animate({
                        'opacity': self.options.highlight_opacity
                    }, self.options.fade_duration);

                },

                'mouseleave': function() {

                    if (!self._is_scrolling) {
                        self.bar.animate({
                            'opacity': self.options.default_opacity
                        }, self.options.fade_duration);
                    }

                }

            });

            this.bar.bind({

                'mousedown': function(event) {

                    self._scroll(event);

                }

            });

        },

        _positionBar: function() {

            // Recalculate the heights and offsets.
            this._getSizes();

            // Position the slider.
            this.bar.css({
                'top': this.options.slide_region_padding,
                'right': this.options.bar_right_offset,
                'height': this.scrollbarHeight
            });

            this.highlightRegion.css({
                'width': this.containerWidth *
                    (this.options.highlight_width_percentage / 100)
            });

        },

        _getSizes: function() {

            // Measure the container.
            this.containerHeight = this.element.height();
            this.containerWidth = this.element.width();

            // Calculate the height of the slide region and
            // the top offset.
            this.slideRegionHeight = this.containerHeight -
                (2 * this.options.slide_region_padding);

            // Calculate the height of the scrollbar. Since
            // the container div is being truncated (hence the
            // need for the scrollbar), clone the div, position
            // it offscreen, auto-height the clone, measure,
            // and destroy.
            var cloneContainer = this.element
                .clone()
                .css({
                    'top': -1000,
                    'left': -1000,
                    'height': 'auto'
                })
                .appendTo(this._body);

            // Measure and remove.
            this.scrollbarHeight = (this.containerHeight / cloneContainer.height()) * this.slideRegionHeight;
            cloneContainer.remove();

            // Get the total number of pixels that the bar can
            // slide along, and set the current top offset.
            this.slideHeight = this.slideRegionHeight - this.scrollbarHeight;
            this.slideOffset = 0;

        },

        _scroll: function(trigger_event) {

            var self = this;
            this._is_scrolling = true;

            // Record coordinates of starting mousedown and
            // the value of the starting slide offset.
            var startingX = trigger_event.pageX;
            var startingY = trigger_event.pageY;
            var startingSlideOffset = this.slideOffset;
            var lastOffsetY = startingSlideOffset;

            var startingOffsetY = self.bar.css('top').replace('px', '');

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate the new offsets.
                    var positionY = e.pageY
                    var offsetY = positionY - startingY;
                    var newOffsetY = parseInt(startingOffsetY) + parseInt(offsetY);

                    // If the bar can slide up or down on the track, do the change.
                    if (startingSlideOffset + offsetY >= 0 && startingSlideOffset + offsetY <= self.slideHeight) {

                        if (!(self.slideOffset == 0 && (newOffsetY < lastOffsetY)) &&
                            !(self.slideOffset == self.slideHeight && (newOffsetY > lastOffsetY))) {

                            self.bar.css({
                                'top': newOffsetY
                            });

                            self.slideOffset = startingSlideOffset + offsetY;

                            // Record the most recent slide offset.
                            lastOffsetY = newOffsetY;

                        }

                    }

                },

                'mouseup': function() {

                    // Remove the move listener.
                    self._window.unbind('mousemove');
                    self._is_strolling = false;

                }

            });

        }

    });


})( jQuery );
