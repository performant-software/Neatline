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

            // CSS constants.
            slide_region_padding: 20,
            bar_right_offset: 8,
            default_opacity: 0.2,
            highlight_opacity: 0.5,
            highlight_width_percentage: 20,

            // Hexes.
            colors: {
                purple: '#724E85'
            }

        },

        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');

            // Add the scroller.
            this._addBar();

        },

        _destroy: function() {



        },

        _addBar: function() {

            // Construct the slider bar and the highlight region div.
            this.bar = $('<div class="small-scrollbar"></div>');
            this.highlightRegion = $('<div class="highlight-region"></div>');

            // Inject.
            this.element.append(this.bar);
            this.element.append(this.highlightRegion);

            // Fade in the bar.
            this.bar.animate({
                'opacity': this.options.default_opacity
            });

            // Position.
            this._positionBar();

            // ** Glossers.

            this.highlightRegion.bind({

                'mouseenter': function() {

                },

                'mouseleave': function() {

                }

            });

            this.bar.bind({

                'mouseenter': function() {

                },

                'mouseleave': function() {

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

        }

    });


})( jQuery );
