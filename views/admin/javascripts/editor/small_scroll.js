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

            // Hexes.
            colors: {
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

            // Construct and inject.
            this.bar = $('<div class="small-scrollbar"></div>');
            this.element.append(this.bar);

            // Position.
            this._positionBar();

            // Add events.


        },

        _positionBar: function() {

            // Recalculate the
            this._getSizes();

            // Position
            this.bar.css({
                'top': this.options.slide_region_padding,
                'right': this.options.bar_right_offset,
                'height': this.scrollbarHeight
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
            this.scrollbarHeight = cloneContainer.height();
            cloneContainer.remove();

        }

    });


})( jQuery );
