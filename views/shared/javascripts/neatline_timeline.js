/**
 * Component widget that controls the timeline. Instantiated by the parent
 * Neatline widget.
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

    $.widget('neatline.neatlinetimeline', {

        /*
         * .
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this.zoomContainer =            $('#zoom-buttons');
            this.zoomIn =                   this.zoomContainer.find('.zoom-in');
            this.zoomOut =                  this.zoomContainer.find('.zoom-out');

            // Tracker2.
            this._idToTapeElements = {};
            this._zoomSteps = this.getZoomIndexArray();
            this._currentZoomStep = Neatline.timelineZoom;
            this._currentDate = null;

            // Start-up.
            this._instantiateSimile();
            this._constructZoomButtons();
            this.element.disableSelection();

        },

        /*
         * Construct the timeline.
         *
         * - return void.
         */
        _instantiateSimile: function(skipClobber) {

            var self = this;

            // Detach the zoom buttons container.
            this.zoomContainer.detach();

            // Instantiate the event source object.
            this.eventSource = new Timeline.DefaultEventSource();

            // Get the starting intervalUnit and intervalPixels.
            var startingZoomStep =  this._zoomSteps[this._currentZoomStep];
            var intervalUnit =      startingZoomStep.unit;
            var intervalPixels =    startingZoomStep.pixelsPerInterval;

            // Create theme.
            var theme = Timeline.ClassicTheme.create();
            theme.event.track.height = 15;
            theme.event.tape.height = 10;

            // Get band heights.
            var mainHeight = 100;
            if (Neatline.timeline.isContextBand === 1) {
                mainHeight -= Neatline.timeline.contextBandHeight;
            }

            // Define band data.
            this.bandInfos = [

                Timeline.createBandInfo({
                    eventSource:    this.eventSource,
                    width:          mainHeight+"%",
                    intervalUnit:   intervalUnit,
                    intervalPixels: intervalPixels,
                    zoomIndex:      this._currentZoomStep,
                    zoomSteps:      this._zoomSteps,
                    theme:          theme,
                    timeZone:       SimileAjax.DateTime.getTimezone()
                })

            ];

            // Build context band.
            if (Neatline.timeline.isContextBand === 1) {
                var bandUnit = Neatline.timeline.contextBandUnit.toUpperCase();

                // Push on the band.
                this.bandInfos.push(
                    Timeline.createBandInfo({
                        overview:       true,
                        eventSource:    this.eventSource,
                        width:          Neatline.timeline.contextBandHeight+"%",
                        intervalUnit:   Timeline.DateTime[bandUnit],
                        intervalPixels: 300
                    })
                );

                // Sync bands.
                this.bandInfos[1].syncWith = 0;
                this.bandInfos[1].highlight = true;

            }

            // Instantiate and load JSON.
            var container = document.getElementById('timeline');
            this.timeline = Timeline.create(container, this.bandInfos);
            this.loadData();

            // Override default click and zom callbacks.
            if (!skipClobber) {
                this._catchClickCallback();
                this._catchZoomCallback();
            }

            // Scroll callback.
            this.timeline.getBand(0).addOnScrollListener(_.bind(function() {

                var date = this.timeline.getBand(0).getCenterVisibleDate();

                // Emit current date.
                this._trigger('scroll', {}, {
                    'date': date
                });

                // Set tracker.
                this._currentDate = date;

            }, this));

        },

        /*
         * Construct and gloss the zoom buttons.
         *
         * - return void.
         */
        _constructZoomButtons: function() {

            var self = this;

            // Re-inject the container.
            this.element.append(this.zoomContainer);

            // Listen for zoom in click.
            this.zoomIn.bind('mousedown', function() {

                // If the zoom track is not at min.
                if (self._currentZoomStep > 0) {

                    // Compute center coordinate and zoom.
                    var centerCoords = self._getCenterOffset();
                    self.timeline.getBand(0).zoom(
                        true,
                        centerCoords.x,
                        centerCoords.y
                    );

                }

                // Re-render.
                self.refresh();

            });

            // Listen for zoom out click.
            this.zoomOut.bind('mousedown', function() {

                // If the zoom track is not at max.
                if (self._currentZoomStep < self._zoomSteps.length-1) {

                    // Compute center coordinate and zoom.
                    var centerCoords = self._getCenterOffset();
                    self.timeline.getBand(0).zoom(
                        false,
                        centerCoords.x,
                        centerCoords.y
                    );

                }

                // Re-render.
                self.refresh();

            });

        },

        /*
         * Listen for event clicks.
         *
         * - return void.
         */
        _catchClickCallback: function() {

            var self = this;

            // Whitewash over the default bubble popup event so as to get event id data.
            Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {

                // Trigger out to the deployment code.
                self._trigger('eventclick', {}, {
                    'recordid': evt._eventID,
                    'slug': evt._obj.slug
                });

            };

        },

        /*
         * Listen for zoom.
         *
         * - return void.
         */
        _catchZoomCallback: function() {

            var self = this;

            // Whitewash over the default bubble popup event so as to get event id data.
            Timeline._Band.prototype.zoom = function(zoomIn, x, y, target) {

                if (!this._zoomSteps) {
                    return;
                }

                // Shift the x value by our offset
                x += this._viewOffset;

                var zoomDate = this._ether.pixelOffsetToDate(x);
                var netIntervalChange = this._ether.zoom(zoomIn);
                this._etherPainter.zoom(netIntervalChange);

                // Shift our zoom date to the far left
                this._moveEther(Math.round(-this._ether.dateToPixelOffset(zoomDate)));

                // Then shift it back to where the mouse was
                this._moveEther(x);

                // Increment zoom step.
                if (zoomIn) {
                    self._incrementZoomStepDown();
                } else {
                    self._incrementZoomStepUp();
                }

            };

        },

        /*
         * Fetch and render events.
         *
         * - return void.
         */
        loadData: function() {

            var self = this;
            var date;

            // Get event data.
            this.timeline.loadJSON(Neatline.dataSources.timeline, _.bind(function(json, url) {

                // Apply data.
                this.eventSource.clear();
                this.eventSource.loadJSON(json, url);

            }, this));

            // Reapply date.
            if (!_.isNull(this._currentDate)) {
                date = this._currentDate;
                this.timeline.getBand(0).setCenterVisibleDate(date);
            }

            // Set the starting date, if defined.
            else if (Neatline.default_focus_date !== null) {
                date = Date.parse(Neatline.record.default_focus_date);
                this.timeline.getBand(0).setCenterVisibleDate(date);
            }

            // Apply the ambiguity gradients.
            var band0 = this.timeline.getBand(0);
            var painter0 = band0.getEventPainter();

            // Apply span stylers and hover listeners.
            painter0.addEventPaintListener(_.bind(function(band, op, evt, els) {
                if (els !== null) {
                    this._buildSpanStyler(evt, els);
                    this._listenForHover(evt, els);
                }
            }, this));

        },

        /*
         * Instantiate a gradient span styler on a tape.
         *
         * @param {Object} evt: The event object.
         * @param {Array} els: An array of DOM elements.
         *
         * @return void.
         */
        _buildSpanStyler: function(evt, els) {

            // Instantiate span styler.
            var tape = $(els[0]);
            tape.data('positioningStyles', tape.attr('style'));
            tape.spanstyler();

            // Build CSS.
            tape.spanstyler(
                'constructCss',
                evt._obj.color,
                evt._obj.left_ambiguity,
                evt._obj.right_ambiguity
            );

            // Manifest.
            tape.spanstyler('applyCss');

            // Push the id-element association into the tracker object.
            this._idToTapeElements[evt._eventID] = [tape];

        },

        /*
         * Listen for mouseenter and mouseleave on a tape.
         *
         * @param {Object} evt: The event object.
         * @param {Array} els: An array of DOM elements.
         *
         * @return void.
         */
        _listenForHover: function(evt, els) {

            _.each(els, _.bind(function(el) {
                $(el).bind({

                    'mouseenter': _.bind(function() {
                        this._trigger('evententer', {}, {
                            id: evt._eventID,
                            title: evt._text,
                            description: evt._description,
                            show_bubble: evt._obj.show_bubble
                        });
                    }, this),

                    'mouseleave': _.bind(function() {
                        this._trigger('eventleave', {}, {
                            id: evt._eventID,
                            title: evt._text,
                            description: evt._description,
                            show_bubble: evt._obj.show_bubble
                        });
                    }, this)

                });
            }, this));

        },

        /*
         * Calculate the offset of the center point on the timeline.
         *
         * - return object:         An object with x and y values.
         */
        _getCenterOffset: function() {

            // Get the main band div.
            var band = this.timeline.getBand(0)._div;

            return {
                x: -(parseInt($(band).css('left'), 10)) + (this.element.width() / 2),
                y: -(parseInt($(band).css('top'), 10)) + (this.element.height() / 2)
            };

        },

        /*
         * Focus on the listing for the record with the passed id.
         *
         * - param integer id:      The id of the record.
         *
         * - return void.
         */
        zoomToEvent: function(id) {

            var self = this;

            $.each(this.timeline._bands[0]._eventSource._events._idToEvent, function(i, event) {

                if (event._eventID === parseInt(id, 10)) {
                    self.timeline.getBand(0).setCenterVisibleDate(event._start);
                }

            });

        },

        /*
         * Focus on the listing for the record with the passed slug.
         *
         * - param integer slug:      The slug of the record.
         *
         * - return void.
         */
        zoomToEventBySlug: function(slug) {

            var self = this;

            $.each(this.timeline._bands[0]._eventSource._events._idToEvent, function(i, event) {

                if (event._obj.slug === slug) {
                    self.timeline.getBand(0).setCenterVisibleDate(event._start);
                }

            });

        },

        /*
         * Get the current center date.
         *
         * - return string date             The center date.
         */
        getCenterForSave: function() {
            return this.timeline.getBand(0).getCenterVisibleDate().toString();
        },

        /*
         * Get the current zoom level.
         *
         * - return integer zoome           The zoom level.
         */
        getZoomForSave: function() {
            return this._currentZoomStep;
        },

        /*
         * Set the date ambiguity for the record with the passed id.
         *
         * - param integer id:              The id of the record.
         * - param string color:            The color to set.
         * - param integer leftPercent:     The left percentage threshold.
         * - param integer rightPercent:    The right percentage threshold.
         *
         * - return void.
         */
        setDateAmbiguity: function(id, color, leftPercent, rightPercent) {

            var self = this;

            if (typeof this._idToTapeElements[id] !== 'undefined') {

                $.each(this._idToTapeElements[id], function(i, el) {

                    // First, strip off the styles and reapply just the simile positioning.
                    el.attr('style', el.data('positioningStyles'));

                    // Apply the gradient style.
                    el.spanstyler('constructCss', color, leftPercent, rightPercent);
                    el.spanstyler('applyCss');

                });

            }

        },

        /*
         * Set the color for the record with the passed id.
         *
         * - param integer id:      The id of the record.
         * - param string color:    The color to set.
         *
         * - return void.
         */
        setDateColor: function(id, color) {

            var self = this;

            if (typeof this._idToTapeElements[id] !== 'undefined') {

                $.each(this._idToTapeElements[id], function(i, el) {

                    // First, strip off the styles and reapply just the simile positioning.
                    el.attr('style', el.data('positioningStyles'));

                    // Apply the gradient style.
                    el.spanstyler('constructCss', color, null, null);
                    el.spanstyler('applyCss');

                });

            }

        },

        /*
         * Render new defaults.
         *
         * - param integer height: The height of the context band, as %.
         * - param string unit: The context band unit.
         * - param integer isContext: 1 if the context band is active.
         *
         * - return void.
         */
        renderDefaults: function(height, unit, isContext) {

            // Update exhibit defaults.
            Neatline.record.is_context_band             = isContext;
            Neatline.record.default_context_band_height = height;
            Neatline.record.default_context_band_unit   = unit;
            Neatline.timeline.isContextBand             = isContext;
            Neatline.timeline.contextBandUnit           = unit;
            Neatline.timeline.contextBandHeight         = height;

            // Reinstantiate.
            this.reinstantiate();

        },

        /*
         * Get array of zoom indices.
         *
         * - return void.
         */
        getZoomIndexArray: function() {

            return new Array(
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.WEEK},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.WEEK},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.WEEK},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.WEEK},
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval: 300,  unit: Timeline.DateTime.CENTURY},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.CENTURY},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.CENTURY},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.CENTURY}
            );

        },

        /*
         * Increment zoom step up.
         */
        _incrementZoomStepUp: function() {
            if (this._currentZoomStep < this._zoomSteps.length-1) {
                this._currentZoomStep++;
            }
        },

        /*
         * Increment zoom step down.
         */
        _incrementZoomStepDown: function() {
            if (this._currentZoomStep > 0) {
                this._currentZoomStep--;
            }
        },

        /*
         * Reinstantiate the timeline.
         */
        reinstantiate: function() {
            this.timeline.dispose();
            this.timeline = undefined;

            this._instantiateSimile();
            this._constructZoomButtons();
            this.element.disableSelection();
        },

        /*
         * Rerender the timeline.
         */
        refresh: function() {
            this.timeline.layout();
        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return mixed attr: The value of the attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });

})(jQuery);
