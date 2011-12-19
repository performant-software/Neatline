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
                items_id: 'undated'
            }

        },

        _create: function() {

            // Setters.
            this.params =                   Neatline;

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.map =                      $('#' + this.options.markup.map_id);
            this.timeline =                 $('#' + this.options.markup.timeline_id);
            this.items =                    $('#' + this.options.markup.items_id);

            // Trackers for instantiation status of blocks.
            this.instantiated_map =         false;
            this.instantiated_timeline =    false;
            this.instantiated_undated =     false;

            // Instantiate the positioning manager.
            this.element.positioner({
                markup: {
                    map:                    '#' + this.options.markup.map_id,
                    timeline:               '#' + this.options.markup.timeline_id,
                    items:                  '#' + this.options.markup.items_id
                }
            });

            // Position the divs.
            this.positionDivs();

            // Startup for the component widgets.
            this.instantiateBlocks();

        },

        setParams: function(params) {

            this.params = params;

        },

        positionDivs: function() {

            // Compute the positions.
            this.positions = this.element.positioner(
                'compute',
                this.params.is_map,
                this.params.is_timeline,
                this.params.is_items,
                this.params.top_element,
                this.params.items_v_pos,
                this.params.items_h_pos,
                this.params.items_height
            );

            // Manifest.
            this.element.positioner('apply');

        },

        _getContainerDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

        },

        instantiateBlocks: function() {

            var self = this;

            // Map.
            if (this.params.is_map && !this.instantiated_map) {

                this.map.neatlinemap({

                    'featureadded': function() {
                        self._trigger('mapfeatureadded');
                    },

                    'featureclick': function(event, obj) {
                        self._trigger('mapfeatureclick', {}, {
                            'recordid': obj.recordid
                        });
                    }

                });

                // Register the presence of the map instantiation.
                this.instantiated_map = true;

            }

            // Timeline.
            if (this.params.is_timeline && !this.instantiated_timeline) {

                this.timeline.neatlinetimeline({

                    'eventclick': function(event, obj) {
                        self._trigger('timelineeventclick', {}, {
                            'recordid': obj.recordid
                        });
                    }

                });

                // Register the presence of the timeline instantiation.
                this.instantiated_timeline = true;

            }

            // Undated items.
            if (this.params.is_items && !this.instantiated_undated) {

                // If the Neatline is public, instantiate the default item tray.
                if (this.params.public) {

                    this.items.neatlineitems({

                        'undateditemclick': function(event, obj) {

                            // When the user clicks on an item title.
                            self._trigger('undateditemclick', {}, {
                                'recordid': obj.recordid,
                                'scrollItems': obj.scrollItems
                            });

                        }

                    });

                }

                // Otherwise, do the editing-enabled tray.
                else {

                    this.items.itemorderer({

                        'undateditemclick': function(event, obj) {

                            // When the user clicks on an item title.
                            self._trigger('undateditemclick', {}, {
                                'recordid': obj.recordid,
                                'scrollItems': obj.scrollItems
                            });

                        }

                    });

                }

                // Register the presence of the udi instantiation.
                this.instantiated_undated = true;

            }

        },

        positionBlockMarkup: function() {

            // Items tray.
            this.items.neatlineitems('positionMarkup');

        },

        /*
         * Interface callbacks with deployment scripts. These methods mostly
         * just delegate behaviors / data retrieval tasks to the individual block
         * classes, but they are wired through the master Neatline plugin so as
         * to fully encapsulate all Neatline functionality and avoid any direct
         * communication among the deployment code and the component blocks.
         */

        saveSuccess: function() {

            this.element.css('opacity', 0);
            this.element.animate({ 'opacity': 1 }, 1000);

        },

        editMap: function(item, immediate) {

            this.map.neatlinemap('edit', item, immediate);

        },

        endMapEditWithoutSave: function(id, immediate) {

            this.map.neatlinemap('endEditWithoutSave', id, immediate);

        },

        getWktForSave: function() {

            return this.map.neatlinemap('getWktForSave');

        },

        reloadTimeline: function() {

            this.timeline.neatlinetimeline('loadData');

        },

        reloadMap: function() {

            this.map.neatlinemap('loadData');

        },

        reloadUndatedItems: function() {

            this.items.neatlineitems('loadData');

        },

        zoomMapToItemVectors: function(id) {

            this.map.neatlinemap('zoomToItemVectors', id);

        },

        zoomTimelineToEvent: function(id) {

            this.timeline.neatlinetimeline('zoomToEvent', id);

        },

        showItemDescription: function(id) {

            this.items.neatlineitems('scrollToItem', id);

        },

        setItemColor: function(color, id) {

            this.map.neatlinemap('setItemColor', color);
            this.timeline.neatlinetimeline('setDateColor', id, color);

        },

        setDateAmbiguity: function(id, color, leftPercent, rightPercent) {

            this.timeline.neatlinetimeline('setDateAmbiguity', id, color, leftPercent, rightPercent);

        },

        getMapExtent: function() {

            return this.map.neatlinemap('getExtentForSave');

        },

        getMapZoom: function() {

            return this.map.neatlinemap('getZoomForSave');

        },

        getTimelineCenter: function() {

            return this.timeline.neatlinetimeline('getCenterForSave');

        }

    });


})( jQuery );
