/**
 * Left and right scroll buttons.
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

    'use strict';

    $.widget('neatline.scroller', {

        options: {

            colors: {
                text: '#404040',
                purple: '#866398',
                orange: '#f19f00'
            },

            durations: {
                enter: 70,
                leave: 120,
                click: 300
            }

        },

        /*
         * Inject the markup, bind events.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this._body =        $('body');
            this._window =      $(window);
            this.container =    $('#scroll');
            this.leftArrow =    this.container.find('.arrow-left');
            this.rightArrow =   this.container.find('.arrow-right');

            // Inject and show the container.
            this.element.append(this.container);
            this._showContainer();

            // Bind events.
            this._addEvents();

        },

        /*
         * Listen for mouseenter, mousedown, mouseleave.
         *
         * - return void.
         */
        _addEvents: function() {

            var self = this;

            // Left.
            this.leftArrow.bind({

                // Highlight.
                'mouseenter': function() {
                    self._highlightArrow(self.leftArrow);
                },

                // Un-highlight.
                'mouseleave': function() {
                    self._unhighlightArrow(self.leftArrow);
                },

                // Click.
                'mousedown': function() {
                    self._clickArrow(self.leftArrow);
                    self._trigger('left');
                }

            });

            // Right.
            this.rightArrow.bind({

                // Highlight.
                'mouseenter': function() {
                    self._highlightArrow(self.rightArrow);
                },

                // Un-highlight.
                'mouseleave': function() {
                    self._unhighlightArrow(self.rightArrow);
                },

                // Click.
                'mousedown': function() {
                    self._clickArrow(self.rightArrow);
                    self._trigger('right');
                }

            });

            // Disable selection.
            this.element.disableSelection();

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Positions the container.
         *
         * - param Object positions: The container dimensions.
         *
         * - return void.
         */
        position: function(positions) {

            // Get conatiner dimensions.
            var containerWidth = this.element.width();
            var containerHeight = this.element.height();

            // Position.
            this.container.css({
                top: positions.top+20,
                left: containerWidth-(positions.left+positions.width)+50
            });

        },

        /*
         * Show the container.
         *
         * - return void.
         */
        _showContainer: function() {
            this.container.css('display', 'block');
        },

        /*
         * Fade up an arrow on mouseenter.
         *
         * - param DOM arrow: The arrow.
         *
         * - return void.
         */
        _highlightArrow: function(arrow) {

            arrow.stop().animate({
                'color': this.options.colors.purple
            }, this.options.durations.enter);

        },

        /*
         * Fade down an arrow on mouseleave.
         *
         * - param DOM arrow: The arrow.
         *
         * - return void.
         */
        _unhighlightArrow: function(arrow) {

            arrow.stop().animate({
                'color': this.options.colors.text
            }, this.options.durations.leave);

        },

        /*
         * Click effect.
         *
         * - param DOM arrow: The arrow.
         *
         * - return void.
         */
        _clickArrow: function(arrow) {

            var self = this;

            // Pop.
            arrow.css('color', this.options.colors.orange);

            // Fade down.
            arrow.stop().animate({
                'color': self.options.colors.purple
            }, self.options.durations.click, 'easeInQuart');

        }

    });


})(jQuery);
