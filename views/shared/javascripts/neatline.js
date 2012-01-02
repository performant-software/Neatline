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
                map_id:         'map',
                timeline_id:    'timeline',
                items_id:       'items',
                scroller:       'scroll'
            }

        },

        /*
         * Get markup, capture exhibit parameters, run the positioner.
         *
         * - return void.
         */
        _create: function() {

            // Setters.
            this.params =                   Neatline;

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.map =                      $('#' + this.options.markup.map_id);
            this.timeline =                 $('#' + this.options.markup.timeline_id);
            this.items =                    $('#' + this.options.markup.items_id);
            this.scroller =                 $('#' + this.options.markup.scroller);

            // Trackers.
            this.instantiated_map =         false;
            this.instantiated_timeline =    false;
            this.instantiated_undated =     false;
            this._getMajorBlock();

            // Instantiate the positioning manager.
            this.element.positioner({
                markup: {
                    map:                    '#' + this.options.markup.map_id,
                    timeline:               '#' + this.options.markup.timeline_id,
                    items:                  '#' + this.options.markup.items_id
                }
            });

            // Position divs and run viewport managers.
            this.positionDivs();
            this.instantiateBlocks();

        },

        /*
         * Update the exhibit parameters.
         *
         * - param object params: The new parameter object literal.
         *
         * - return void.
         */
        setParams: function(params) {

            // Set the parameters and re-get the major block.
            this.params = params;
            this._getMajorBlock();

        },

        /*
         * Figure out which viewport should house the scroller.
         *
         * - return void.
         */
        _getMajorBlock: function() {

            // If there is a map and a timeline, take the top div.
            if (this.params.is_map && this.params.is_timeline) {
                this.majorBlock = (this.params.top_element == 'map') ?
                    this.map :
                    this.timeline;
            }

            // Otherwise, take the present block.
            else {
                this.majorBlock = (this.params.is_map) ?
                    this.map :
                    this.timeline;
            }

        },

        /*
         * Measure, compute, and apply a new position loadout.
         *
         * - return void.
         */
        positionDivs: function() {

            // Measure.
            this.element.positioner('measure');

            // Compute the positions.
            this.element.positioner(
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

        /*
         * Measure the container.
         *
         * - return void.
         */
        _getContainerDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();

        },

        /*
         * Construct the map, timeline, and item tray.
         *
         * - return void.
         */
        instantiateBlocks: function() {

            var self = this;

            // ** MAP
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

            // ** TIMELINE
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

            // ** ITEMS
            if (this.params.is_items && !this.instantiated_undated) {

                // If the Neatline is public, instantiate the default item tray.
                if (this.params.public) {

                    this.items.neatlineitems({

                        'itemclick': function(event, obj) {

                            // When the user clicks on an item title.
                            self._trigger('itemclick', {}, {
                                'recordid': obj.recordid,
                                'scrollItems': obj.scrollItems
                            });

                        }

                    });

                }

                // Otherwise, do the editing-enabled tray.
                else {

                    this.items.itemorderer({

                        'itemclick': function(event, obj) {

                            // When the user clicks on an item title.
                            self._trigger('itemclick', {}, {
                                'recordid': obj.recordid,
                                'scrollItems': obj.scrollItems
                            });

                        }

                    });

                }

                // Register the presence of the udi instantiation.
                this.instantiated_undated = true;

            }

            // ** SCROLLER
            this.majorBlock.scroller({

                'left': function() {
                    self.items.neatlineitems('scrollLeft');
                },

                'right': function() {
                    self.items.neatlineitems('scrollRight');
                }

            });

        },


        /*
         * =================
         * Piping methods.
         *
         * These methods delegate behaviors and data retrieval tasks to the
         * invdividual block classes, but they are wired through the master
         * Neatline widget so as to fully encapsulate Neatline functionality
         * and avoid direct communication between the constructor code and
         * the component blocks.
         * =================
         */


        /*
         * Where necessary, reposition component markup inside of the
         * viewports.
         *
         * - return void.
         */
        positionBlockMarkup: function() {
            this.items.neatlineitems('positionMarkup');
        },

        /*
         * After a successful save, render a flashing effect on the
         * exhibit to indicate that data has been committed.
         *
         * - return void.
         */
        saveSuccess: function() {
            this.element.css('opacity', 0);
            this.element.animate({ 'opacity': 1 }, 500);
        },

        /*
         * Put the map into edit mode.
         *
         * - param DOM item: The item row in the browser.
         * - param boolean immedaite: True if the switch should happen
         *   immediately, and the edit controls should not be
         *   smooth-faded in and out of visibility.
         *
         * - return void.
         */
        editMap: function(item, immediate) {
            this.map.neatlinemap('edit', item, immediate);
        },

        /*
         * Return the map to normal display mode after an edit session.
         *
         * - param boolean immedaite: True if the switch should happen
         *   immediately, and the edit controls should not be
         *   smooth-faded in and out of visibility.
         *
         * - return void.
         */
        endMapEditWithoutSave: function(immediate) {
            this.map.neatlinemap('endEditWithoutSave', immediate);
        },

        /*
         * Get the WKT representation of the vectors for the currently
         * edit-active item on the map.
         *
         * - return string: The WKT.
         */
        getWktForSave: function() {
            return this.map.neatlinemap('getWktForSave');
        },

        /*
         * Re-get timeline data.
         *
         * - return void.
         */
        reloadTimeline: function() {
            this.timeline.neatlinetimeline('loadData');
        },

        /*
         * Re-get map data.
         *
         * - return void.
         */
        reloadMap: function() {
            this.map.neatlinemap('loadData');
        },

        /*
         * Re-get item data.
         *
         * - return void.
         */
        reloadItems: function() {
            this.items.neatlineitems('loadData');
        },

        /*
         * Focus the map for a given record.
         *
         * - param integer id: The record id.
         *
         * - return void.
         */
        zoomMapToItemVectors: function(id) {
            this.map.neatlinemap('zoomToItemVectors', id);
        },

        /*
         * Focus the timeline for a given record.
         *
         * - param integer id: The record id.
         *
         * - return void.
         */
        zoomTimelineToEvent: function(id) {
            this.timeline.neatlinetimeline('zoomToEvent', id);
        },

        /*
         * Focus the items tray for a given record.
         *
         * - param integer id: The record id.
         *
         * - return void.
         */
        showItemDescription: function(id) {
            this.items.neatlineitems('scrollToItem', id);
        },

        /*
         * Set the fill color for a record's features.
         *
         * - param string color: The color for the span.
         * - param integer id: The record id.
         *
         * - return void.
         */
        setItemVectorColor: function(color, id) {
            this.map.neatlinemap('setCurrentRecordStyle', 'vector_color', color);
            this.timeline.neatlinetimeline('setDateColor', id, color);
        },

        /*
         * Set the stroke color for the current item.
         *
         * - param string color: The color for the span.
         *
         * - return void.
         */
        setItemStrokeColor: function(color) {
            this.map.neatlinemap('setCurrentRecordStyle', 'stroke_color', color);
        },

        /*
         * Set the vector opacity for the current item.
         *
         * - param integer value: The opacity, 0-100.
         *
         * - return void.
         */
        setItemVectorOpacity: function(value) {
            this.map.neatlinemap('setCurrentRecordStyle', 'vector_opacity', value/100);
        },

        /*
         * Set the stroke opacity for the current item.
         *
         * - param integer value: The opacity, 0-100.
         *
         * - return void.
         */
        setItemStrokeOpacity: function(value) {
            this.map.neatlinemap('setCurrentRecordStyle', 'stroke_opacity', value/100);
        },

        /*
         * Set the stroke width for the current item.
         *
         * - param integer value: The width, 0-+inf.
         *
         * - return void.
         */
        setItemStrokeWidth: function(value) {
            this.map.neatlinemap('setCurrentRecordStyle', 'stroke_width', value);
        },

        /*
         * Set the point radius for the current item.
         *
         * - param integer value: The radius, 0-+inf.
         *
         * - return void.
         */
        setItemPointRadius: function(value) {
            this.map.neatlinemap('setCurrentRecordStyle', 'point_radius', value);
        },

        /*
         * Set the default fill color.
         *
         * - param string color: The color for the span.
         *
         * - return void.
         */
        setDefaultVectorColor: function(color) {
            this.map.neatlinemap('setDefaultStyle', 'vector_color', color);
            this.timeline.neatlinetimeline('setDefaultDateColor', color);
        },

        /*
         * Set the default stroke color.
         *
         * - param string color: The color for the span.
         *
         * - return void.
         */
        setDefaultStrokeColor: function(color) {
            this.map.neatlinemap('setDefaultStyle', 'stroke_color', color);
        },

        /*
         * Set the default vector opacity.
         *
         * - param integer value: The opacity, 0-100.
         *
         * - return void.
         */
        setDefaultVectorOpacity: function(value) {
            this.map.neatlinemap('setDefaultStyle', 'vector_opacity', value/100);
        },

        /*
         * Set the default stroke opacity.
         *
         * - param integer value: The opacity, 0-100.
         *
         * - return void.
         */
        setDefaultStrokeOpacity: function(value) {
            this.map.neatlinemap('setDefaultStyle', 'stroke_opacity', value/100);
        },

        /*
         * Set the default stroke width.
         *
         * - param integer value: The width, 0-+inf.
         *
         * - return void.
         */
        setDefaultStrokeWidth: function(value) {
            this.map.neatlinemap('setDefaultStyle', 'stroke_width', value);
        },

        /*
         * Set the default point radius.
         *
         * - param integer value: The radius, 0-+inf.
         *
         * - return void.
         */
        setDefaultPointRadius: function(value) {
            this.map.neatlinemap('setDefaultStyle', 'point_radius', value);
        },

        /*
         * Render a date ambiguity on a timeline span.
         *
         * - param integer id: The record id.
         * - param string color: The color for the span.
         * - param integer left: The left-hand percentage.
         * - param integer right: The right-hand percentage.
         *
         * - return void.
         */
        setDateAmbiguity: function(id, color, left, right) {
            this.timeline.neatlinetimeline('setDateAmbiguity', id, color, left, right);
        },

        /*
         * Get the current focus extent on the map.
         *
         * - return string: The extent.
         */
        getMapExtent: function() {
            return this.map.neatlinemap('getExtentForSave');
        },

        /*
         * Get the current zoom level on the map.
         *
         * - return integer: The level.
         */
        getMapZoom: function() {
            return this.map.neatlinemap('getZoomForSave');
        },

        /*
         * Get the current focus date on the timeline.
         *
         * - return integer: The level.
         */
        getTimelineCenter: function() {
            if (this.is_instantiated_timeline) {
                return this.timeline.neatlinetimeline('getCenterForSave');
            } else {
                return '';
            }
        },

        /*
         * Put the items tray into reorder mode.
         *
         * - return integer: The level.
         */
        reorderItems: function() {
            this.items.neatlineitems('reorder');
        },

        /*
         * Get an ordering.
         *
         * - return integer: The level.
         */
        getOrder: function() {
            return this.items.neatlineitems('objectifyOrder');
        },

        /*
         * Put the item tray into default mode and return the order.
         *
         * - return integer: The level.
         */
        endReorderItems: function() {
            return this.items.neatlineitems('endreorder');
        }

    });


})( jQuery );
