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
                map:            '#map',
                timeline:       '#timeline',
                items:          '#items'
            },

            // Positioning constants.
            constants: {
                h_percent:      30,
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
            this.items =                $(this.options.markup.items);

            // Trackers for positioning parameters.
            this._is_map =              this.options.positions.is_map;
            this._is_timeline =         this.options.positions.is_timeline;
            this._is_items =            this.options.positions.is_items;
            this._top =                 this.options.positions.top;          // 'map' or 'timeline'.
            this._items_v_pos =         this.options.positions.items_v_pos;  // 'top' or 'bottom'.
            this._items_h_pos =         this.options.positions.items_h;      // 'right' or 'left'.
            this._items_height =        this.options.positions.items_height; // 'full' or 'partial'.

            // Dimensions tracker.
            this.positions = {

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

            };

        },

        /*
         * Measure the container, compute percentage-based constants.
         */
        measure: function() {

            this.width =                this.element.width();
            this.height =               this.element.height();
            this.minorWidth =           this.width * (this.options.constants.h_percent / 100);
            this.majorWidth =           this.width - this.minorWidth;
            this.majorHeight =          this.height * (this.options.constants.v_percent / 100);
            this.minorHeight =          this.height - this.majorHeight;

        },

        /*
         * Given a fresh parameter loadout, recompute the positions.
         *
         * - param boolean is_m:        Map presence.
         * - param boolean is_t:        Timeline presence.
         * - param boolean is_i:        Items presence.
         * - param string top:          Top element; 'map' or 'timeline'.
         * - param string i_v_pos:      Items vertical position; 'top' or 'bottom'.
         * - param string i_h_pos:      Items horizontal position; 'left' or 'right'.
         * - param string i_h:          Items height; 'full' or 'partial'.
         *
         * - return object positions:   The final positions object literal.
         *
         */
        compute: function(is_m, is_t, is_i, top, i_v_pos, i_h_pos, i_h) {

            // Set trackers.
            this._is_map =              is_m;
            this._is_timeline =         is_t;
            this._is_items =            is_i;
            this._top =                 top;
            this._items_v_pos =         i_v_pos;
            this._items_h_pos =         i_h_pos;
            this._items_height =        i_h;

            /*
             * Case enumeration.
             */

            // MAP and TIMELINE and ITEMS:
            if (this._is_map && this._is_timeline && this._is_items) {

                // MAP top, TIMELINE bottom.
                if (this._top == 'map') {

                    // ITEMS left, bottom, partial:
                    if (this._items_h_pos == 'left' &&
                        this._items_v_pos == 'bottom' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.majorHeight,
                                width:  this.width,
                                top:    0,
                                left:   0
                            },

                            timeline: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   this.minorWidth
                            },

                            items: {
                                height: this.minorHeight,
                                width:  this.minorWidth,
                                top:    this.majorHeight,
                                left:   0
                            }

                        };

                    }

                    // ITEMS left, top, partial:
                    if (this._items_h_pos == 'left' &&
                        this._items_v_pos == 'top' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   this.minorWidth
                            },

                            timeline: {
                                height: this.minorHeight,
                                width:  this.width,
                                top:    this.majorHeight,
                                left:   0
                            },

                            items: {
                                height: this.majorHeight,
                                width:  this.minorWidth,
                                top:    0,
                                left:   0
                            }

                        };

                    }

                    // ITEMS left, full:
                    else if (this._items_h_pos == 'left' &&
                             this._items_height == 'full') {

                        this.positions = {

                            map: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   this.minorWidth
                            },

                            timeline: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   this.minorWidth
                            },

                            items: {
                                height: this.height,
                                width:  this.minorWidth,
                                top:    0,
                                left:   0
                            }

                        };

                    }

                    // ITEMS right, bottom, partial:
                    if (this._items_h_pos == 'right' &&
                        this._items_v_pos == 'bottom' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.majorHeight,
                                width:  this.width,
                                top:    0,
                                left:   0
                            },

                            timeline: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   0
                            },

                            items: {
                                height: this.minorHeight,
                                width:  this.minorWidth,
                                top:    this.majorHeight,
                                left:   this.majorWidth
                            }

                        };

                    }

                    // ITEMS right, top, partial:
                    if (this._items_h_pos == 'right' &&
                        this._items_v_pos == 'top' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   0
                            },

                            timeline: {
                                height: this.minorHeight,
                                width:  this.width,
                                top:    this.majorHeight,
                                left:   0
                            },

                            items: {
                                height: this.majorHeight,
                                width:  this.minorWidth,
                                top:    0,
                                left:   this.majorWidth
                            }

                        };

                    }

                    // ITEMS right, full:
                    else if (this._items_h_pos == 'right' &&
                             this._items_height == 'full') {

                        this.positions = {

                            map: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   0
                            },

                            timeline: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   0
                            },

                            items: {
                                height: this.height,
                                width:  this.minorWidth,
                                top:    0,
                                left:   this.majorWidth
                            }

                        };

                    }

                }

                // MAP bottom, TIMELINE top.
                else if (this._top == 'timeline') {

                    // ITEMS left, bottom, partial:
                    if (this._items_h_pos == 'left' &&
                        this._items_v_pos == 'bottom' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   this.minorWidth
                            },

                            timeline: {
                                height: this.majorHeight,
                                width:  this.width,
                                top:    0,
                                left:   0
                            },

                            items: {
                                height: this.minorHeight,
                                width:  this.minorWidth,
                                top:    this.majorHeight,
                                left:   0
                            }

                        };

                    }

                    // ITEMS left, top, partial:
                    if (this._items_h_pos == 'left' &&
                        this._items_v_pos == 'top' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.minorHeight,
                                width:  this.width,
                                top:    this.majorHeight,
                                left:   0
                            },

                            timeline: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   this.minorWidth
                            },

                            items: {
                                height: this.majorHeight,
                                width:  this.minorWidth,
                                top:    0,
                                left:   0
                            }

                        };

                    }

                    // ITEMS left, full:
                    else if (this._items_h_pos == 'left' &&
                             this._items_height == 'full') {

                        this.positions = {

                            map: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   this.minorWidth
                            },

                            timeline: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   this.minorWidth
                            },

                            items: {
                                height: this.height,
                                width:  this.minorWidth,
                                top:    0,
                                left:   0
                            }

                        };

                    }

                    // ITEMS right, bottom, partial:
                    if (this._items_h_pos == 'right' &&
                        this._items_v_pos == 'bottom' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   0
                            },

                            timeline: {
                                height: this.majorHeight,
                                width:  this.width,
                                top:    0,
                                left:   0
                            },

                            items: {
                                height: this.minorHeight,
                                width:  this.minorWidth,
                                top:    this.majorHeight,
                                left:   this.majorWidth
                            }

                        };

                    }

                    // ITEMS right, top, partial:
                    if (this._items_h_pos == 'right' &&
                        this._items_v_pos == 'top' &&
                        this._items_height == 'partial') {

                        this.positions = {

                            map: {
                                height: this.minorHeight,
                                width:  this.width,
                                top:    this.majorHeight,
                                left:   0
                            },

                            timeline: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   0
                            },

                            items: {
                                height: this.majorHeight,
                                width:  this.minorWidth,
                                top:    0,
                                left:   this.majorWidth
                            }

                        };

                    }

                    // ITEMS right, full:
                    else if (this._items_h_pos == 'right' &&
                             this._items_height == 'full') {

                        this.positions = {

                            map: {
                                height: this.minorHeight,
                                width:  this.majorWidth,
                                top:    this.majorHeight,
                                left:   0
                            },

                            timeline: {
                                height: this.majorHeight,
                                width:  this.majorWidth,
                                top:    0,
                                left:   0
                            },

                            items: {
                                height: this.height,
                                width:  this.minorWidth,
                                top:    0,
                                left:   this.majorWidth
                            }

                        };

                    }

                }

            }

            // MAP and ITEMS:
            else if (this._is_map &&
                     this._is_items &&
                     !this._is_timeline) {

                // MAP left, ITEMS right:
                if (this._items_h_pos == 'right') {

                    this.positions = {

                        map: {
                            height: this.height,
                            width:  this.majorWidth,
                            top:    0,
                            left:   0
                        },

                        timeline: {
                            height: null,
                            width:  null,
                            top:    null,
                            left:   null
                        },

                        items: {
                            height: this.height,
                            width:  this.minorWidth,
                            top:    0,
                            left:   this.majorWidth
                        }

                    };

                }

                // MAP right, ITEMS left:
                else if (this._items_h_pos == 'left') {

                    this.positions = {

                        map: {
                            height: this.height,
                            width:  this.majorWidth,
                            top:    0,
                            left:   this.minorWidth
                        },

                        timeline: {
                            height: null,
                            width:  null,
                            top:    null,
                            left:   null
                        },

                        items: {
                            height: this.height,
                            width:  this.minorWidth,
                            top:    0,
                            left:   0
                        }

                    };

                }

            }

            // TIMELINE and ITEMS:
            else if (this._is_timeline &&
                     this._is_items &&
                     !this._is_map) {

                // TIMELINE left, ITEMS right:
                if (this._items_h_pos == 'right') {

                    this.positions = {

                        map: {
                            height: null,
                            width:  null,
                            top:    null,
                            left:   null
                        },

                        timeline: {
                            height: this.height,
                            width:  this.majorWidth,
                            top:    0,
                            left:   0
                        },

                        items: {
                            height: this.height,
                            width:  this.minorWidth,
                            top:    0,
                            left:   this.majorWidth
                        }

                    };

                }

                // TIMELINE right, ITEMS left:
                else if (this._items_h_pos == 'left') {

                    this.positions = {

                        map: {
                            height: null,
                            width:  null,
                            top:    null,
                            left:   null
                        },

                        timeline: {
                            height: this.height,
                            width:  this.majorWidth,
                            top:    0,
                            left:   this.minorWidth
                        },

                        items: {
                            height: this.height,
                            width:  this.minorWidth,
                            top:    0,
                            left:   0
                        }

                    };

                }

            }

            // MAP and TIMELINE:
            else if (this._is_map &&
                     this._is_timeline &&
                     !this._is_items) {

                // MAP top, TIMELINE bottom.
                if (this._top == 'map') {

                    this.positions = {

                        map: {
                            height: this.majorHeight,
                            width:  this.width,
                            top:    0,
                            left:   0
                        },

                        timeline: {
                            height: this.minorHeight,
                            width:  this.width,
                            top:    this.majorHeight,
                            left:   0
                        },

                        items: {
                            height: null,
                            width:  null,
                            top:    null,
                            left:   null
                        }

                    };

                }

                // MAP bottom, TIMELINE top.
                else if (this._top == 'timeline') {

                    this.positions = {

                        map: {
                            height: this.minorHeight,
                            width:  this.width,
                            top:    this.majorHeight,
                            left:   0
                        },

                        timeline: {
                            height: this.majorHeight,
                            width:  this.width,
                            top:    0,
                            left:   0
                        },

                        items: {
                            height: null,
                            width:  null,
                            top:    null,
                            left:   null
                        }

                    };

                }

            }

            // MAP:
            else if (this._is_map &&
                     !this._is_timeline &&
                     !this._is_items) {

                this.positions = {

                    map: {
                        height: this.height,
                        width:  this.width,
                        top:    0,
                        left:   0
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

                };

            }

            // TIMELINE:
            else if (this._is_timeline &&
                     !this._is_map &&
                     !this._is_items) {

                this.positions = {

                    map: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    },

                    timeline: {
                        height: this.height,
                        width:  this.width,
                        top:    0,
                        left:   0
                    },

                    items: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    }

                };

            }

            // Return the object.
            return this.positions;

        },

        /*
         * Apply computed positions to the markup.
         */
        apply: function() {

            // Map.
            if (this._is_map) {
                this.map.css('display', 'block');
                this.map.css(this.positions.map);
            } else {
                this.map.css('display', 'none');
            }

            // Timeline.
            if (this._is_timeline) {
                this.timeline.css('display', 'block');
                this.timeline.css(this.positions.timeline);
            } else {
                this.timeline.css('display', 'none');
            }

            // Items.
            if (this._is_items) {
                this.items.css('display', 'block');
                this.items.css(this.positions.items);
            } else {
                this.items.css('display', 'none');
            }

        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr:    The name of the attribute.
         *
         * - return mixed attr:    The value of the attribute.
         */
        getAttr: function(attr) {

            return this[attr];

        }

    });


})( jQuery );
