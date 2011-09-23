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
                top_block_height_percent: 55,
                undated_items_width_percent: 30
            },

            // Hexes.
            colors: {

            }

        },

        _create: function() {

            // Setters.
            this.params = Neatline;

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.map = $('#' + this.options.markup.map_id);
            this.timeline = $('#' + this.options.markup.timeline_id);
            this.undated = $('#' + this.options.markup.undated_id);

            // Position the divs.
            this.positionDivs();

            // Startup for the component widgets.
            this._instantiateBlocks();

        },

        positionDivs: function() {

            // Update the container dimension trackers.
            this._getContainerDimensions();

            // Get percentages.
            var topBlockHeightPercentage =
                this.options.css.top_block_height_percent / 100;

            var undatedItemsWidthPercentage =
                this.options.css.undated_items_width_percent / 100;

            // Get pixel constants.
            var topBlockHeight =
                Math.round(this.containerHeight * topBlockHeightPercentage);

            var bottomBlockHeight =
                this.containerHeight - topBlockHeight;

            var undatedItemsWidth =
                Math.round(this.containerWidth * undatedItemsWidthPercentage);

            var withUndatedItemsWidth =
                this.containerWidth - undatedItemsWidth;

            // ** Position the map. **

            // If there is a map.
            if (this.params.is_map == 1) {

                this.map.css({
                    'left': 0,
                    'display': 'block',
                    'width': this.containerWidth
                });

                // If the map is on top.
                if (this.params.top_element == 'map') {

                    this.map.css({
                        'top': 0,
                        'height': topBlockHeight,
                    });

                }

                // If the map is on the bottom.
                else {

                    this.map.css({
                        'top': topBlockHeight,
                        'height': bottomBlockHeight,
                    });

                }

                // If the timeline is absent, and the map
                // should be full-height.
                if (this.params.is_timeline == 0) {

                    this.map.css({
                        'height': this.containerHeight,
                        'top': 0
                    });

                }

            }

            // ** Position the timeline. **

            // If there is a timeline.
            if (this.params.is_timeline == 1) {

                this.timeline.css({
                    'left': 0,
                    'display': 'block'
                });

                // If the map is on top.
                if (this.params.top_element == 'map') {

                    this.timeline.css({
                        'top': topBlockHeight,
                        'height': bottomBlockHeight
                    });

                }

                // If the map is on the bottom.
                else {

                    this.timeline.css({
                        'top': 0,
                        'height': topBlockHeight
                    });

                }

                // If the map is absent, and the timeline
                // should be full-height.
                if (this.params.is_map == 0) {

                    this.timeline.css({
                        'height': this.containerHeight,
                        'top': 0
                    });

                }

            }

            // ** Position the undated items. **

            // If there is an undated items block.
            if (this.params.is_undated_items == 1 && this.params.is_timeline == 1) {

                this.undated.css({
                    'display': 'block',
                    'width': undatedItemsWidth
                });

                // If the udi is on the left.
                if (this.params.undated_items_position == 'left') {

                    this.timeline.css({
                        'width': withUndatedItemsWidth,
                        'left': undatedItemsWidth
                    });

                }

                // If the udi is on the right.
                else {

                    this.timeline.css({
                        'width': withUndatedItemsWidth,
                        'left': 0
                    });

                    this.undated.css({
                        'left': withUndatedItemsWidth
                    });

                }

                // If the udi is full height.
                if (this.params.undated_items_height == 'full') {

                    this.undated.css({
                        'height': this.containerHeight
                    });

                    // If the udi is on the left.
                    if (this.params.undated_items_position == 'left') {

                        this.map.css({
                            'width': withUndatedItemsWidth,
                            'left': undatedItemsWidth
                        });

                    }

                    // If the udi is on the right.
                    else {

                        this.map.css({
                            'width': withUndatedItemsWidth,
                            'left': 0
                        });

                    }

                }

                // If the udi is partial height.
                else {

                    // If the map is on top.
                    if (this.params.top_element == 'map') {

                        this.undated.css({
                            'height': bottomBlockHeight,
                            'top': topBlockHeight
                        });

                    }

                    // If the map is on the bottom.
                    else {

                        this.undated.css({
                            'height': topBlockHeight
                        });

                    }

                    // If the udi is set to partial height,
                    // but there is no map element, set to full
                    // height.
                    if (this.params.is_map == 0) {

                        this.undated.css({
                            'height': this.containerHeight,
                            'top': 0
                        });

                    }

                }

            }

        },

        _getContainerDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

        },

        _instantiateBlocks: function() {

            // Map.

        }

    });


})( jQuery );
