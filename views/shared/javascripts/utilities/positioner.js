/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
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

    'use strict';

    $.widget('neatline.positioner', {

        options: {

            // True if the positiner should construct and manage width
            // and height dragging.
            draggable: true,

            colors: {
                drag_active: '#1e1e1e'
            },

            // Markup hooks.
            markup: {
                map:            '#map',
                timeline:       '#timeline',
                items:          '#items'
            },

            // Positioning constants.
            constants: {
                h_percent:      24,
                v_percent:      84,
                drag_width:      5
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
            this._window =              $(window);
            this.map =                  $(this.options.markup.map);
            this.timeline =             $(this.options.markup.timeline);
            this.items =                $(this.options.markup.items);

            // Trackers for positioning parameters.
            this._is_map =              this.options.positions.is_map;
            this._is_timeline =         this.options.positions.is_timeline;
            this._is_items =            this.options.positions.is_items;
            this._top =                 this.options.positions.top;          // 'map' or 'timeline'.
            this._items_v_pos =         this.options.positions.items_v_pos;  // 'top' or 'bottom'.
            this._items_h_pos =         this.options.positions.items_h_pos;  // 'right' or 'left'.
            this._items_height =        this.options.positions.items_height; // 'full' or 'partial'.

            // Shell trackers for drag handles.
            this.v_drag = null;
            this.h_drag = null;

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

            // Build the draggers.
            if (this.options.draggable) {
                this._constructDraggers();
            }

            // By default, measure on creation.
            this.measure();

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
         * The method enumerates these positioning cases:

            - MAP and TIMElLINE and ITEMS
              - MAP top, TIMELINE bottom
                - ITEMS left partial bottom
                - ITEMS left full
                - ITEMS left partial top
                - ITEMS right partial bottom
                - ITEMS right full
                - ITEMS right partial top
              - MAP bottom, TIMELINE top
                - ITEMS left partial bottom
                - ITEMS left full
                - ITEMS left partial top
                - ITEMS right partial bottom
                - ITEMS right full
                - ITEMS partial top
            - MAP and ITEMS
              - MAP left, ITEMS right
              - MAP right, ITEMS left
            - TIMELINE and ITEMS
              - TIMELINE left, ITEMS right
              - TIMELINE right, ITEMS left
            - MAP and TIMELINE
              - MAP top, TIMELINE bottom
              - MAP bottom, TIMELINE top
            - MAP
              - MAP fullscreen
            - TIMELINE
              - TIMELINE fullscreen

         *
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
                if (this._top === 'map') {

                    // ITEMS left, bottom, partial:
                    if (this._items_h_pos === 'left' &&
                        this._items_v_pos === 'bottom' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.minorHeight,
                                width:      this.options.constants.drag_width,
                                top:        this.majorHeight,
                                left:       this.minorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS left, top, partial:
                    if (this._items_h_pos === 'left' &&
                        this._items_v_pos === 'top' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.majorHeight,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.minorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS left, full:
                    else if (this._items_h_pos === 'left' &&
                             this._items_height === 'full') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.height,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.minorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.majorWidth,
                                top:        this.majorHeight,
                                left:       this.minorWidth
                            }
                        };

                    }

                    // ITEMS right, bottom, partial:
                    if (this._items_h_pos === 'right' &&
                        this._items_v_pos === 'bottom' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.minorHeight,
                                width:      this.options.constants.drag_width,
                                top:        this.majorHeight,
                                left:       this.majorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS right, top, partial:
                    if (this._items_h_pos === 'right' &&
                        this._items_v_pos === 'top' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.majorHeight,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.majorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS right, full:
                    else if (this._items_h_pos === 'right' &&
                             this._items_height === 'full') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.height,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.majorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.majorWidth,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                }

                // MAP bottom, TIMELINE top.
                else if (this._top === 'timeline') {

                    // ITEMS left, bottom, partial:
                    if (this._items_h_pos === 'left' &&
                        this._items_v_pos === 'bottom' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.minorHeight,
                                width:      this.options.constants.drag_width,
                                top:        this.majorHeight,
                                left:       this.minorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS left, top, partial:
                    if (this._items_h_pos === 'left' &&
                        this._items_v_pos === 'top' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.majorHeight,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.minorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS left, full:
                    else if (this._items_h_pos === 'left' &&
                             this._items_height === 'full') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.height,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.minorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.majorWidth,
                                top:        this.majorHeight,
                                left:       this.minorWidth
                            }
                        };

                    }

                    // ITEMS right, bottom, partial:
                    if (this._items_h_pos === 'right' &&
                        this._items_v_pos === 'bottom' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.minorHeight,
                                width:      this.options.constants.drag_width,
                                top:        this.majorHeight,
                                left:       this.majorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS right, top, partial:
                    if (this._items_h_pos === 'right' &&
                        this._items_v_pos === 'top' &&
                        this._items_height === 'partial') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.majorHeight,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.majorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.width,
                                top:        this.majorHeight,
                                left:       0
                            }
                        };

                    }

                    // ITEMS right, full:
                    else if (this._items_h_pos === 'right' &&
                             this._items_height === 'full') {

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

                        this.dragPositions = {
                            h: {
                                height:     this.height,
                                width:      this.options.constants.drag_width,
                                top:        0,
                                left:       this.majorWidth
                            },
                            v: {
                                height:     this.options.constants.drag_width,
                                width:      this.majorWidth,
                                top:        this.majorHeight,
                                left:       0
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
                if (this._items_h_pos === 'right') {

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

                    this.dragPositions = {
                        h: {
                            height:     this.height,
                            width:      this.options.constants.drag_width,
                            top:        0,
                            left:       this.majorWidth
                        },
                        v: {
                            height:     null,
                            width:      null,
                            top:        null,
                            left:       null
                        }
                    };

                }

                // MAP right, ITEMS left:
                else if (this._items_h_pos === 'left') {

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

                    this.dragPositions = {
                        h: {
                            height:     this.height,
                            width:      this.options.constants.drag_width,
                            top:        0,
                            left:       this.majorWidth
                        },
                        v: {
                            height:     null,
                            width:      null,
                            top:        null,
                            left:       null
                        }
                    };

                }

            }

            // TIMELINE and ITEMS:
            else if (this._is_timeline &&
                     this._is_items &&
                     !this._is_map) {

                // TIMELINE left, ITEMS right:
                if (this._items_h_pos === 'right') {

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

                    this.dragPositions = {
                        h: {
                            height:     this.height,
                            width:      this.options.constants.drag_width,
                            top:        0,
                            left:       this.majorWidth
                        },
                        v: {
                            height:     null,
                            width:      null,
                            top:        null,
                            left:       null
                        }
                    };

                }

                // TIMELINE right, ITEMS left:
                else if (this._items_h_pos === 'left') {

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

                    this.dragPositions = {
                        h: {
                            height:     this.height,
                            width:      this.options.constants.drag_width,
                            top:        0,
                            left:       this.majorWidth
                        },
                        v: {
                            height:     null,
                            width:      null,
                            top:        null,
                            left:       null
                        }
                    };

                }

            }

            // MAP and TIMELINE:
            else if (this._is_map &&
                     this._is_timeline &&
                     !this._is_items) {

                // MAP top, TIMELINE bottom.
                if (this._top === 'map') {

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

                    this.dragPositions = {
                        h: {
                            height:     null,
                            width:      null,
                            top:        null,
                            left:       null
                        },
                        v: {
                            height:     this.options.constants.drag_width,
                            width:      this.width,
                            top:        this.majorHeight,
                            left:       0
                        }
                    };

                }

                // MAP bottom, TIMELINE top.
                else if (this._top === 'timeline') {

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

                    this.dragPositions = {
                        h: {
                            height:     null,
                            width:      null,
                            top:        null,
                            left:       null
                        },
                        v: {
                            height:     this.options.constants.drag_width,
                            width:      this.width,
                            top:        this.majorHeight,
                            left:       0
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

                this.dragPositions = {
                    h: {
                        height:     null,
                        width:      null,
                        top:        null,
                        left:       null
                    },
                    v: {
                        height:     null,
                        width:      null,
                        top:        null,
                        left:       null
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

                this.dragPositions = {
                    h: {
                        height:     null,
                        width:      null,
                        top:        null,
                        left:       null
                    },
                    v: {
                        height:     null,
                        width:      null,
                        top:        null,
                        left:       null
                    }
                };

            }

            // If dragging is enabled, update handles.
            if (this.options.draggable) {
                this._showDraggers();
            }

            // Return the object.
            return this.positions;

        },

        /*
         * Apply computed positions to the markup.
         */
        apply: function(mapFullscreen) {

            if (_.isUndefined(mapFullscreen)) {
                mapFullscreen = true;
            }

            // Map.
            if (this._is_map) {
                this.map.css('display', 'block');
                if (mapFullscreen) {
                    this.map.css({
                        height: this.height,
                        width: this.width,
                        top: 0,
                        left: 0
                    });
                }
                else {
                    this.map.css(this.positions.map);
                }
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
         * Build and inject the draggers.
         */
        _constructDraggers: function() {

            var self = this;

            // Vertical.
            this.v_drag = $('<div class="v-drag">\
                              </div>');

            // Horizontal.
            this.h_drag = $('<div class="h-drag">\
                              </div>');

            // Ineject.
            this.element.append(this.v_drag, this.h_drag);

            // Bind listeners to horizontal drag handle.
            this.h_drag.bind({

                'mousedown': function(e) {

                    // Register cursor starting coordinates.
                    var startX = e.pageX;
                    var startDragLeft = self.dragPositions.h.left;

                    // Highlight the handle, disable selection.
                    self.__highlightHorizontalHandle();
                    self.__disableSelection();

                    // Listen for mousemove.
                    self._window.bind({

                        // Manifest drag.
                        'mousemove': function(e) {

                            // Get new x offset and max width.
                            var newX = startDragLeft - (startX - e.pageX);
                            var maxWidth = self.width - self.options.constants.drag_width;

                            // If left of viewport.
                            if (newX < 0) {
                                newX = 0;
                            }

                            // If right of container.
                            else if (newX > maxWidth) {
                                newX = maxWidth;
                            }

                            // Manifest.
                            self.h_drag.css('left', newX);

                            // Get new h_percent.
                            switch (self._items_h_pos) {

                                case 'left':
                                    self.options.constants.h_percent =
                                        (newX / self.width) * 100;
                                break;

                                case 'right':
                                    self.options.constants.h_percent =
                                        ((self.width - newX) / self.width) * 100;
                                break;

                            }

                            // Trigger drag callback.
                            self._trigger('drag', {}, {
                                'h_percent': self.options.constants.h_percent,
                                'v_percent': self.options.constants.v_percent
                            });

                            // Rerender.
                            self.refresh();

                        },

                        // Apply new dimensions.
                        'mouseup': function() {

                            // Re-render, hide handle, and strip move listener.
                            self.refresh();
                            self.__unhighlightHorizontalHandle();
                            self.__enableSelection();
                            self._window.unbind('mousemove');

                            // Trigger new layout.
                            self._trigger('layoutChange');

                        }

                    });

                }

            });

            // Bind listeners to vertical drag handle.
            this.v_drag.bind({

                'mousedown': function(e) {

                    // Register cursor starting coordinates.
                    var startY = e.pageY;
                    var startDragTop = self.dragPositions.v.top;

                    // Highlight the handle, disable selection.
                    self.__highlightVerticalHandle();
                    self.__disableSelection();

                    // Listen for mousemove.
                    self._window.bind({

                        // Manifest drag.
                        'mousemove': function(e) {

                            // Get new x offset and max width.
                            var newY = startDragTop - (startY - e.pageY);
                            var maxHeight = self.height - self.options.constants.drag_width;

                            // If left of viewport.
                            if (newY < 0) {
                                newY = 0;
                            }

                            // If right of container.
                            else if (newY > maxHeight) {
                                newY = maxHeight;
                            }

                            // Manifest.
                            self.v_drag.css('top', newY);

                            // Get new v_percent.
                            self.options.constants.v_percent = (newY / self.height) * 100;

                            // Trigger drag callback.
                            self._trigger('drag', {}, {
                                'h_percent': self.options.constants.h_percent,
                                'v_percent': self.options.constants.v_percent
                            });

                            // Rerender.
                            self.refresh();

                        },

                        // Apply new dimensions.
                        'mouseup': function() {

                            // Re-render, hide handle, and strip move listener.
                            self.refresh();
                            self.__unhighlightVerticalHandle();
                            self.__enableSelection();
                            self._window.unbind('mousemove');

                            // Trigger new layout.
                            self._trigger('layoutChange');

                        }

                    });

                }

            });

        },

        /*
         * Show/hide the drag handles.
         */
        _showDraggers: function() {

            // Show/hide vertical dragger.
            if (this._is_map && this._is_timeline) {
                this.v_drag.css('display', 'block');
            } else {
                this.v_drag.css('display', 'none');
            }

            // Show/hide horizontal dragger.
            if (this._is_items) {
                this.h_drag.css('display', 'block');
            } else {
                this.h_drag.css('display', 'none');
            }

            // Manifest the new positions.
            this.h_drag.css(this.dragPositions.h);
            this.v_drag.css(this.dragPositions.v);

        },

        /*
         * Set new viewport proportions and refresh.
         *
         * - param float h_percent: The new h_percent.
         * - param float v_percent: The new v_percent.
         *
         * - return void.
         */
        applyProportions: function(h_percent, v_percent) {

            // Set new percentages.
            this.options.constants.h_percent = h_percent;
            this.options.constants.v_percent = v_percent;

            // Rerender.
            this.refresh();

        },

        /*
         * Re-render exhibit with current set attributes.
         *
         * - return void.
         */
        refresh: function() {

            this.measure();

            this.compute(
                this._is_map,
                this._is_timeline,
                this._is_items,
                this._top,
                this._items_v_pos,
                this._items_h_pos,
                this._items_height
            );

            this.apply();

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Pop the color of the handle during the drag.
         *
         * - return void.
         */
        __highlightHorizontalHandle: function() {

            // Highlight the handle.
            this.h_drag.css(
                'border-left',
                '1px dashed ' + this.options.colors.drag_active
            );

        },

        /*
         * Hide the handle.
         *
         * - return void.
         */
        __unhighlightHorizontalHandle: function() {

            // Highlight the handle.
            this.h_drag.css(
                'border-left',
                ''
            );

        },

        /*
         * Pop the color of the handle during the drag.
         *
         * - return void.
         */
        __highlightVerticalHandle: function() {

            // Highlight the handle.
            this.v_drag.css(
                'border-top',
                '1px dashed ' + this.options.colors.drag_active
            );

        },

        /*
         * Hide the handle.
         *
         * - return void.
         */
        __unhighlightVerticalHandle: function() {

            // Highlight the handle.
            this.v_drag.css(
                'border-top',
                ''
            );

        },

        /*
         * Disable text selection on the container..
         *
         * - return void.
         */
        __disableSelection: function() {
            this.element.css({
                '-moz-user-select': 'none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            });
        },

        /*
         * Enable text selection on the container..
         *
         * - return void.
         */
        __enableSelection: function() {
            this.element.css({
                '-moz-user-select': '',
                '-khtml-user-select': '',
                '-webkit-user-select': '',
                'user-select': ''
            });
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


})(jQuery);
