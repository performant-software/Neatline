/*
 * The core orchestrator class for a Neatline exhibit. This widget (a) reads in the
 * object literal pushed onto the page by the template with basic information
 * about the Neatline, (b) constructs the component divs, (c) initializes the widgets
 * that control the map, timeline, and undated items, and (d) defines callbacks
 * among the component classes.
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


    $.widget('neatline.neatline', {

        options: {

            // Markup hooks.
            markup: {
                map_id: 'map',
                timeline_id: 'timeline',
                undated_id: 'undated'
            },

            // Animation constants.
            animation: {

            },

            // CSS constants.
            css: {
                top_block_percent: 60
            },

            // Hexes.
            colors: {

            }

        },

        _create: function() {

            // Setters.
            this.neatline = Neatline;

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.map = $('#' + this.options.markup.map_id);
            this.timeline = $('#' + this.options.markup.timeline_id);
            this.undated = $('#' + this.options.markup.undated_id);

            // Position the divs.
            this._positionDivs();

        },

        _positionDivs: function() {

            // Update the container dimension trackers.
            this._getContainerDimensions();

            // ** Position the map. **

            // If there is a map.
            if (this.neatline.is_map == 1) {

                // If the map is on top.
                if (this.neatline.top_element == 'map') {


                    var topBlockHeight = this.containerHeight *
                        (this.options.top_block_percent / 100);

                    this.map.css({
                        'top': 0,
                        'left': 0,
                        'height': topBlockHeight,
                        'display': 'block'
                    });
                    console.log(this.containerHeight);

                }

                // If the map is on the bottom.
                else {

                }

            }

        },

        _getContainerDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

        }

    });


})( jQuery );
