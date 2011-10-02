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

            // Markup hooks.
            content_class: 'small-scroll-content',

            // CSS and tween constants.
            slide_region_padding: 20,
            bar_right_offset: 8,
            default_opacity: 0.2,
            highlight_opacity: 0.9,
            highlight_width_percentage: 20,
            fade_duration: 300,

            // Hexes.
            colors: {
                purple: '#9a7baa',
                gray: '#c3c3c3'
            }

        },

        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.content = this.element.find('.' + this.options.content_class);

            // Initialize trackers.
            this._is_scrolling = false;
            this._at_top = true;
            this._at_bottom = true;
            this._in_highlight_region = false;;
            this.factor = 0;

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
            this.positionBar();

            // ** Glossers.

            this.highlightRegion.bind({

                'mouseenter': function() {

                    self._in_highlight_region = true;

                    self.bar.stop().animate({
                        'opacity': self.options.highlight_opacity
                    }, self.options.fade_duration);

                },

                'mouseleave': function() {

                    self._in_highlight_region = false;

                    if (!self._is_scrolling) {
                        self.bar.stop().animate({
                            'opacity': self.options.default_opacity
                        }, self.options.fade_duration);
                    }

                }

            });

            this.bar.bind({

                'mouseenter': function() {
                    self.bar.css('background-color', self.options.colors.purple);
                },

                'mouseleave': function() {
                    if (!self._is_scrolling) {
                        self.bar.css('background-color', self.options.colors.gray);
                    }
                },

                'mousedown': function(event) {
                    self._scroll(event);
                }

            });

        },

        positionBar: function() {

            // Recalculate the heights and offsets.
            this._getSizes();

            // Position the slider.
            this.bar.css({
                'right': this.options.bar_right_offset,
                'height': this.scrollbarHeight,
                'display': 'block'
            });

            this.highlightRegion.css({
                'width': this.containerWidth *
                    (this.options.highlight_width_percentage / 100)
            });

            // If the scrollbar is not needed because all of the div
            // is visible, display:none the bar.
            if (this.scrollbarHeight >= this.slideRegionHeight) {
                this.bar.css('display', 'none');
            }

            // Scroll the bar down to the right starting position,
            // per the factor tracker.
            this._scrollBar();

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

            // Register the total height of the div and the height
            // of the occluded content.
            this.totalHeight = cloneContainer.height()
            this.occludedHeight = this.totalHeight - this.containerHeight;

            // Measure and remove.
            this.scrollbarHeight = (this.containerHeight / this.totalHeight) * this.slideRegionHeight;
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
            var startingSlideOffset = (this.slideRegionHeight - this.scrollbarHeight) * this.factor;
            var lastOffsetFactor = this.factor;

            var startingOffsetY = this._getCurrentBarOffset();

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate the new offsets.
                    var positionY = e.pageY
                    var offsetY = positionY - startingY;
                    var newOffsetY = Math.round(startingOffsetY + offsetY);
                    var lastOffsetY = (this.slideRegionHeight - this.scrollbarHeight) * lastOffsetFactor;

                    // If the bar can slide up or down on the track, do the change.
                    if ((startingSlideOffset + offsetY) >= 0
                        && (startingSlideOffset + offsetY) <= self.slideHeight) {

                        if (!(self.slideOffset == 0 && (newOffsetY < lastOffsetY)) &&
                            !(self.slideOffset == self.slideHeight && (newOffsetY > lastOffsetY))) {

                            // Reposition the bar.
                            self.bar.css({
                                'top': newOffsetY
                            });

                            self.slideOffset = startingSlideOffset + offsetY;

                            // Scroll the content.
                            self.factor = self.slideOffset / self.slideHeight;
                            self.scrollContent();

                            // Record the most recent slide offset.
                            lastOffsetY = newOffsetY;

                        }

                    }

                    // If the mouse his gone above the top threshold.
                    else if ((startingSlideOffset + offsetY) < 0) {

                        // Reposition the bar.
                        self.bar.css({
                            'top': self.options.slide_region_padding
                        });

                        self.slideOffset = 0;

                        // Scroll the content.
                        self.factor = self.slideOffset / self.slideHeight;
                        self.scrollContent();

                        // Record the most recent slide offset.
                        lastOffsetY = self.options.slide_region_padding;

                    }

                    // If the mouse his dipped under the bottom threshold.
                    else if ((startingSlideOffset + offsetY) > self.slideHeight) {

                        // Reposition the bar.
                        self.bar.css({
                            'top': self.options.slide_region_padding + self.slideHeight
                        });

                        self.slideOffset = self.slideHeight;

                        // Scroll the content.
                        self.factor = self.slideOffset / self.slideHeight;
                        self.scrollContent();

                        // Record the most recent slide offset.
                        lastOffsetY = self.options.slide_region_padding + self.scrollbarHeight;

                    }

                },

                'mouseup': function() {

                    // Remove the move listener.
                    self._window.unbind('mousemove');
                    self._is_scrolling = false;

                    // Fade down the scrollbar, if the cursor drifted off of it
                    // during the scroll.
                    if (!self._in_highlight_region) {
                        self.bar.stop().animate({
                            'opacity': self.options.default_opacity,
                            'background-color': self.options.colors.gray
                        }, self.options.fade_duration);
                    }

                }

            });

        },

        scrollContent: function() {

            // Calculate the pixel offset for the scroll.
            var offset = this.occludedHeight * this.factor;

            // Apply the change.
            this.content.css('top', -offset);

        },

        _scrollBar: function() {

            // Calculate the pixel offset for the bar.
            var offset = this._getCurrentBarOffset();

            this.bar.css('top', offset);

        },

        _getCurrentBarOffset: function() {

            return this.options.slide_region_padding +
                (this.slideRegionHeight - this.scrollbarHeight) * this.factor;

        }

    });


})( jQuery );
