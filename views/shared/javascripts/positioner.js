/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Given a set of layout parameters, this class computes the positions for the
 * Neatline blocks inside of the container. Used by the layout builder in the
 * editor and by the main application code that constructs the exhibit at runtime.
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


    $.widget('neatline.positioner', {

        options: {

            // Markup hooks.
            markup: {
                map:            '#drag-map',
                timeline:       '#drag-timeline',
                items:          '#drag-items'
            },

            // Positioning constants.
            constants: {
                h_percent:      20,
                v_percent:      60
            },

            // Starting parameters.
            positions: {
                is_map:         false,
                is_timeline:    false,
                is_items:       false,
                top:            'map',
                items_v_pos:    'bottom',
                items_h_pos:    'right',
                items_height:   'full'
            }

        },

        /*
         * Get markup, shell out local trackers for parameters.
         */
        _create: function() {

            // Get the block markup.
            this.map =                  $(this.options.markup.map);
            this.timeline =             $(this.options.markup.timeline);
            this.items =                $(this.options.markup.timeline);

            // Trackers for positioning parameters.
            this._is_map =              this.options.positions.is_map;
            this._is_timeline =         this.options.positions.is_timeline;
            this._is_items =            this.options.positions.is_items;
            this._top =                 this.options.positions.top;          // 'map' or 'timeline'.
            this._items_v_pos =         this.options.positions.items_v_pos;  // 'top' or 'bottom'.
            this._items_h_pos =         this.options.positions.items_h;      // 'right' or 'left'.
            this._items_height =        this.options.positions.items_height; // 'full' or 'partial'.

            // Dimensions tracker.
            this.positions: {

                map: {
                    height: null,
                    width:  null,
                    top:    null,
                    left:   null
                },

                timeline: {
                    height: null,
                    width:  null,
                    top:    null,
                    left:   null
                },

                items: {
                    height: null,
                    width:  null,
                    top:    null,
                    left:   null
                }

            }

        },

        /*
         * Given a fresh parameter loadout, recompute the positions.
         */
        compute: function() {

            // MAP and TIMELINE and ITEMS:
            if (this._is_map && this._is_timeline && this._is_items) {

                // MAP top, TIMELINE bottom.
                if (this._top == 'map') {

                    // ITEMS left, bottom, partial:
                    if (this._items_h_pos == 'left' && this._items_v_pos == 'bottom' && this._items_height == 'partial') {

                    }

                    // ITEMS left, top, partial:
                    if (this._items_h_pos == 'left' && this._items_v_pos == 'top' && this._items_height == 'partial') {

                    }

                    // ITEMS left, full:
                    else if (this._items_h_pos == 'left' && this._items_height == 'full') {

                    }

                    // ITEMS right, bottom, partial:
                    if (this._items_h_pos == 'right' && this._items_v_pos == 'bottom' && this._items_height == 'partial') {

                    }

                    // ITEMS right, top, partial:
                    if (this._items_h_pos == 'right' && this._items_v_pos == 'top' && this._items_height == 'partial') {

                    }

                    // ITEMS right, full:
                    else if (this._items_h_pos == 'right' && this._items_height == 'full') {

                    }

                }

                // MAP bottom, TIMELINE top.
                else if (this._top == 'timeline') {

                    // ITEMS left, bottom, partial:
                    if (this._items_h_pos == 'left' && this._items_v_pos == 'bottom' && this._items_height == 'partial') {

                    }

                    // ITEMS left, top, partial:
                    if (this._items_h_pos == 'left' && this._items_v_pos == 'top' && this._items_height == 'partial') {

                    }

                    // ITEMS left, full:
                    else if (this._items_h_pos == 'left' && this._items_height == 'full') {

                    }

                    // ITEMS right, bottom, partial:
                    if (this._items_h_pos == 'right' && this._items_v_pos == 'bottom' && this._items_height == 'partial') {

                    }

                    // ITEMS right, top, partial:
                    if (this._items_h_pos == 'right' && this._items_v_pos == 'top' && this._items_height == 'partial') {

                    }

                    // ITEMS right, full:
                    else if (this._items_h_pos == 'right' && this._items_height == 'full') {

                    }

                }

            }

            // MAP and ITEMS:
            else if (this._is_map && this._is_items && !this._is_timeline) {

                // MAP left, ITEMS right:
                if (this._items_h_pos == 'right') {

                }

                // MAP right, ITEMS left:
                else if (this._items_h_pos == 'left') {

                }

            }

            // TIMELINE and ITEMS:
            else if (this._is_timeline && this._is_items && !this._is_map) {

                // TIMELINE left, ITEMS right:
                if (this._items_h_pos == 'right') {

                }

                // TIMELINE right, ITEMS left:
                else if (this._items_h_pos == 'left') {

                }

            }

            // MAP and TIMELINE:
            else if (this._is_map && this._is_timeline && !this._is_items) {

                // MAP top, TIMELINE bottom.
                if (this._top == 'map') {

                }

                // MAP bottom, TIMELINE top.
                else if (this._top == 'timeline') {

                }

            }

            // MAP:
            else if (this._is_map && !this._is_timeline && !this._is_items) {

            }

            // TIMELINE:
            else if (this._is_timeline && !this._is_map && !this._is_items) {

            }

        },

        /*
         * Apply computer positions to the markup.
         */
        apply: function() {

            this.map.css(this.positions.map);
            this.timeline.css(this.positions.timeline);
            this.items.css(this.positions.items);

        },

    });


})( jQuery );
