/**
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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {

  'use strict';

    $.widget('neatline.neatline', {

        options: {

            // False in the editor.
            isPublic: true,

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
            this.frozenOut =                null;
            this._getMajorBlock();

            // Position divs and run viewport managers.
            this._instantiatePositioner();
            this.positionDivs();
            this.instantiateBlocks();
            this.instantiateBubbles();
            this.refreshDivs();

            // Disable selection, listen for resize.
            this.element.disableSelection();
            this._window.resize(_.bind(function() {
                this.positionDivs();
            }, this));

        },

        /*
         * Construct the positioner and define callbacks.
         *
         * - return void.
         */
        _instantiatePositioner: function() {

            var self = this;

            this.element.positioner({

                // Pass viewport markup.
                markup: {
                    map:            '#' + this.options.markup.map_id,
                    timeline:       '#' + this.options.markup.timeline_id,
                    items:          '#' + this.options.markup.items_id
                },

                // Positioning constants.
                constants: {
                    h_percent:      this.params.proportions.horizontal,
                    v_percent:      this.params.proportions.vertical
                },

                // On proportion drag.
                drag: function(event, obj) {
                    self._trigger('widthdrag', {}, obj);
                    self.timeline.neatlinetimeline('refresh');
                },

                // On proportion drag completion.
                layoutChange: function() {
                    self.timeline.neatlinetimeline('refresh');
                }

            });

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
            this.params.record = params;
            this._getMajorBlock();

        },

        /*
         * Figure out which viewport should house the scroller.
         *
         * - return void.
         */
        _getMajorBlock: function() {

            // If there is a map and a timeline, take the top div.
            if (this.params.record.is_map && this.params.record.is_timeline) {

                // If map.
                if (this.params.record.top_element === 'map') {
                    this.majorBlock = this.map;
                    this.majorBlockId = 'map';
                }

                // If timeline.
                else if (this.params.record.top_element === 'timeline') {
                    this.majorBlock = this.timeline;
                    this.majorBlockId = 'timeline';
                }

            }

            // Otherwise, take the present block.
            else {

                // If map.
                if (this.params.record.is_map) {
                    this.majorBlock = this.map;
                    this.majorBlockId = 'map';
                }

                // If timeline.
                else if (this.params.record.is_timeline) {
                    this.majorBlock = this.timeline;
                    this.majorBlockId = 'timeline';
                }

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
            this.positions = this.element.positioner(
                'compute',
                this.params.record.is_map,
                this.params.record.is_timeline,
                this.params.record.is_items,
                this.params.record.top_element,
                this.params.record.items_v_pos,
                this.params.record.items_h_pos,
                this.params.record.items_height
            );

            // Manifest.
            this.element.positioner('apply');
            this.refreshDivs();

        },

        /*
         * Position the exhibit controls.
         *
         * - return void.
         */
        refreshDivs: function() {

            // Rerender map and timeline.
            this.timeline.neatlinetimeline('refresh');

            if (this.options.isPublic) {
                this.map.neatlinemap('refresh', this.positions.map);
            } else {
                this.map.mapeditor('refresh', this.positions.map);
            }

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
            if (this.params.record.is_map && !this.instantiated_map) {

                // Define callbacks.
                var callbacks = {

                    'featureadded': function(event, obj) {
                        self._trigger('mapfeatureadded', {}, obj);
                    },

                    'featureenter': function(event, obj) {

                        // Trigger out.
                        self._trigger('mapfeatureenter', {}, obj);

                        // Render bubble.
                        if (self.options.isPublic && obj.record.data.show_bubble == 1 &&
                            (!obj.record.selected || self.items.length === 0)
                        ) {

                            self.freezeOut(obj.record.data);

                            // Show the bubble.
                            self.element.bubbles('show',
                                 obj.record.data.title,
                                 obj.record.data.description
                            );

                        }

                    },

                    'featureleave': function(event, obj) {

                        var bubbles = jQuery(self.element).data('bubbles');

                        // Trigger out.
                        self._trigger('mapfeatureleave', {}, obj);

                        // Remove bubble.
                        if (self.options.isPublic &&
                            bubbles != null && bubbles.bubble != null) {
                            bubbles.hide();
                        }

                        self.thawOut(true);
                        self._trigger('mapfeatureleave', {}, obj);

                    },

                    'featureclick': function(event, obj) {

                        // Trigger out.
                        self._trigger('mapfeatureclick', {}, obj);

                        // Freeze bubble.
                        if (self.options.isPublic) {
                            self.useFrozen();
                            self.element.bubbles('freeze');
                        }

                    },

                    'featureunselect': function(event, obj) {

                        // Close bubble.
                        if (self.options.isPublic &&
                            self.element.bubbles('getTitle') === obj.record.data.title
                        ) {
                            self.element.bubbles('close');
                        }
                        self.thawOut();

                    }

                };

                // If the Neatline is public, instantiate the default map.
                if (this.options.isPublic) {
                    this.map.neatlinemap(callbacks);
                }

                // Otherwise, construct map editor.
                else {
                    this.map.mapeditor(callbacks);
                }

                // Alias the OpenLayers instance.
                this.openlayers = this.map.data('neatlinemap').map;

                // Register the presence of the map instantiation.
                this.instantiated_map = true;

            }

            // ** TIMELINE
            if (this.params.record.is_timeline && !this.instantiated_timeline) {

                this.timeline.neatlinetimeline({

                    'scroll': function(event, obj) {
                        self.map.neatlinemap('renderVisibility', obj.date);
                        self.items.neatlineitems('renderVisibility', obj.date);
                    },

                    'evententer': function(event, obj) {

                        // Render bubble.
                        if (self.options.isPublic && obj.show_bubble == 1) {
                            self.element.bubbles('show',
                                 obj.title,
                                 obj.description
                            );
                        }

                    },

                    'eventleave': function(event, obj) {

                        // Remove bubble.
                        if (self.options.isPublic) {
                            self.element.bubbles('hide');
                        }

                    },

                    'eventclick': function(event, obj) {

                        // Trigger out.
                        self._trigger('timelineeventclick', {}, obj);

                        // Freeze bubble.
                        if (self.options.isPublic) {
                            self.element.bubbles('freeze');
                        }

                    }

                });

                // Register the presence of the timeline instantiation.
                this.instantiated_timeline = true;

            }

            // ** ITEMS
            if (this.params.record.is_items && !this.instantiated_undated) {

                // Define items callbacks.
                var callbacks = {

                    // When the user clicks on an item title.
                    'itemclick': function(event, obj) {

                        // Trigger out.
                        self._trigger('itemclick', {}, obj);

                    },

                    // When the cursor enters an item title.
                    'itementer': function(event, obj) {

                        // Trigger out.
                        self._trigger('itementer', {}, obj);

                        // Highlight map vectors.
                        self.map.neatlinemap('highlightVectors', obj.recordid);

                    },

                    // When the cursor leaves an item title.
                    'itemleave': function(event, obj) {

                        // Trigger out.
                        self._trigger('itemleave', {}, obj);

                        // Unhilight map vectors.
                        self.map.neatlinemap('unhighlightVectors', obj.recordid);

                    },

                    // When an item is activated.
                    'itemactivate': function(event, obj) {

                        // Trigger out.
                        self._trigger('itemactivate', {}, obj);
                        self.map.neatlinemap('selectVectors', obj.recordid);

                    },

                    // When an item is deactivated.
                    'itemdeactivate': function(event, obj) {

                        // Trigger out.
                        self._trigger('itemdeactivate', {}, obj);
                        self.map.neatlinemap('unselectVectors', obj.recordid);

                    }

                };

                // If the Neatline is public, instantiate the default item tray.
                if (this.options.isPublic) {
                    this.items.neatlineitems(callbacks);
                }

                // Otherwise, do the editing-enabled tray.
                else {
                    this.items.itemorderer(callbacks);
                }

                // Register the presence of the udi instantiation.
                this.instantiated_undated = true;

            }

        },

        /*
         * Construct the bubbles manager.
         *
         * - return void.
         */
        instantiateBubbles: function() {

            this.element.bubbles({

                'openlayers': this.openlayers,

                // When the cursor leaves the exhibit container.
                'cursorleave': _.bind(function() {
                    this.map.neatlinemap('unhighlightHoveredRecord');
                }, this),

                // When the bubble is closed.
                'close': _.bind(function() {
                    this.map.neatlinemap('unselectSelectedRecord');
                }, this)

            });

        },

        /*
         * This keeps track of the state that needs to be restored when a
         * feature has been frozen out.
         */
        freezeOut: function(data) {
            if (this.element.bubbles('isFrozen')) {
                var _window = $(window);
                var _this   = this;

                this.frozenOut = {
                    data  : data,
                    event : null
                };
                _window.on('mousemove.frozen', function(event) {
                    if (_.isNull(_this.frozenOut)) {
                        _window.off('mousemove.frozen');
                    } else {
                        _this.frozenOut.event = event;
                    }
                });
            }
        },

        /*
         * This frees the state when the frozen state is thawed.
         */
        thawOut: function(force) {
            if (! _.isNull(this.frozenOut) &&
                (force ||
                 this.frozenOut.data.title == this.element.bubbles('getTitle')
            )) {
                $(window).off('mousemove.frozen');
                this.frozenOut = null;
            }
        },

        /*
         * This creates the bubble for the frozen feature.
         */
        useFrozen: function() {
            if (! _.isNull(this.frozenOut)) {
                var el = this.element;
                el.bubbles(
                    'show',
                    this.frozenOut.data.title,
                    this.frozenOut.data.description
                );
                el.bubbles('position', this.frozenOut.event);
                this.thawOut(true);
            }
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
            if (this.instantiated_map) {
                return this.map.neatlinemap('getWktForSave');
            } else {
                return null;
            }
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
         * Focus the map for a given record identified by its slug.
         *
         * - param integer slug: The record slug.
         *
         * - return void.
         */
        zoomMapToItemVectorsBySlug: function(slug) {
            this.map.neatlinemap('zoomToItemVectorsBySlug', slug);
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
         * Focus the timeline for a given record identified by its slug.
         *
         * - param string slug: The record slug.
         *
         * - return void.
         */
        zoomTimelineToEventBySlug: function(id) {
            this.timeline.neatlinetimeline('zoomToEventBySlug', id);
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
         * Focus the items tray for a given record identified by its slug.
         *
         * - param string slug: The record slug.
         *
         * - return void.
         */
        showItemDescriptionBySlug: function(id) {
            this.items.neatlineitems('scrollToItemBySlug', id);
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
         * Set the highlight color for the current item.
         *
         * - param string color: The color for the span.
         *
         * - return void.
         */
        setItemHighlightColor: function(color) {
            this.map.neatlinemap('setCurrentRecordStyle', 'highlight_color', color);
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
         * Set the graphic opacity for the current item.
         *
         * - param integer value: The opacity, 0-100.
         *
         * - return void.
         */
        setItemGraphicOpacity: function(value) {
            this.map.neatlinemap('setCurrentRecordStyle', 'graphic_opacity', value/100);
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
         * Set the default highlight color.
         *
         * - param string color: The color for the span.
         *
         * - return void.
         */
        setDefaultHighlightColor: function(color) {
            this.map.neatlinemap('setDefaultStyle', 'highlight_color', color);
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
         * Highlight map features by slug.
         *
         * - param string slug: The slug.
         *
         * - return void.
         */
        highlightMapBySlug: function(slug) {
            this.map.neatlinemap('highlightVectorsBySlug', slug);
        },

        /*
         * Unhighlight map features by slug.
         *
         * - param string slug: The slug.
         *
         * - return void.
         */
        unhighlightMapBySlug: function(slug) {
            this.map.neatlinemap('unhighlightVectorsBySlug', slug);
        },

        /*
         * Unselect the currently selected record on the map.
         *
         * - return void.
         */
        unselectMapSelectedRecord: function() {
            this.map.neatlinemap('unselectSelectedRecord');
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
         * Get the current focus center on the map.
         *
         * - return string: The center.
         */
        getMapCenter: function() {
            return this.map.neatlinemap('getCenterForSave');
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
         * Get the name of the current base layer.
         *
         * - return string: The layer name.
         */
        getMapBaseLayer: function() {
            return this.map.neatlinemap('getBaseLayerForSave');
        },

        /*
         * Get the current focus date on the timeline.
         *
         * - return string: The date.
         */
        getTimelineCenter: function() {
            if (this.instantiated_timeline) {
                return this.timeline.neatlinetimeline('getCenterForSave');
            } else {
                return null;
            }
        },

        /*
         * Get the current zoom level on the timeline.
         *
         * - return integer: The level.
         */
        getTimelineZoom: function() {
            if (this.instantiated_timeline) {
                return this.timeline.neatlinetimeline('getZoomForSave');
            } else {
                return null;
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
        },

        /*
         * Manifest new timeline defaults.
         *
         * - param integer height: The height of the context band, as %.
         * - param string unit: The context band unit.
         * - param integer isContext: 1 if the context band is active.
         *
         * - return void.
         */
        renderTimelineDefaults: function(height, unit, isContext) {

            // Reinstantiate Simile.
            this.timeline.neatlinetimeline('renderDefaults',
                height, unit, isContext
            );

        },

        /*
         * Render a new h_percent and v_percent loadout.
         *
         * - param float h_percent: The new h_percent.
         * - param float v_percent: The new v_percent.
         *
         * - return void.
         */
        applyViewportProportions: function(h_percent, v_percent) {

            // Rerender the viewports.
            this.element.positioner(
                'applyProportions',
                h_percent,
                v_percent
            );

            // Resize Simile.
            this.timeline.neatlinetimeline('refresh');

        }

    });


})( jQuery );
