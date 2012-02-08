/*
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
 * @copyright   2011 The Board and Visitors of the University of Virginia
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

            // Tracker array for tape elements.
            this._idToTapeElements =    {};
            this._zoomSteps =           this.getZoomIndexArray();
            this._currentZoomStep =     Neatline.timelineZoom;

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
        _instantiateSimile: function() {

            var self = this;

            // Detach the zoom buttons container.
            this.zoomContainer.detach();

            // Instantiate the event source object.
            this.eventSource = new Timeline.DefaultEventSource();

            // Get the starting intervalUnit and intervalPixels.
            var startingZoomStep =  this._zoomSteps[this._currentZoomStep]
            var intervalUnit =      startingZoomStep.unit;
            var intervalPixels =    startingZoomStep.pixelsPerInterval;

            // Define band data.
            this.bandInfos = [

                Timeline.createBandInfo({
                    eventSource:    this.eventSource,
                    width:          "80%",
                    intervalUnit:   intervalUnit,
                    intervalPixels: intervalPixels,
                    zoomIndex:      this._currentZoomStep,
                    zoomSteps:      this._zoomSteps
                }),

                Timeline.createBandInfo({
                    overview:       true,
                    eventSource:    this.eventSource,
                    width:          "20%",
                    intervalUnit:   Timeline.DateTime.DECADE,
                    intervalPixels: 70
                })

            ];

            // Sync bands.
            this.bandInfos[1].syncWith = 0;
            this.bandInfos[1].highlight = true;

            // Instantiate and load JSON.
            var container = document.getElementById('timeline');
            this.timeline = Timeline.create(container, this.bandInfos);
            this.loadData();

            // Override default click and zom callbacks.
            this._catchClickCallback();
            this._catchZoomCallback();

            // Reposition on window resize.
            this._window.bind({

                'resize': function() {
                    self.timeline.layout();
                }

            });

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
                    'recordid': evt._eventID
                });

            }

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

            }

        },

        /*
         * Fetch and render events.
         *
         * - return void.
         */
        loadData: function() {

            var self = this;

            // Ping the json server and get the events data.
            this.timeline.loadJSON(Neatline.dataSources.timeline, function(json, url) {

                // Render the events.
                self.eventSource.clear();
                self.eventSource.loadJSON(json, url);

            });

            // Set the starting date, if defined.
            if (Neatline.default_focus_date != null) {
                var startDate = Date.parse(Neatline.default_focus_date);
                this.timeline.getBand(0).setCenterVisibleDate(startDate);
            }

            // Apply the ambiguity gradients.
            var band0 = this.timeline.getBand(0);
            var painter0 = band0.getEventPainter();

            painter0.addEventPaintListener(function(band, op, evt, els) {

                if (els != null) {

                    // Get the tape element.
                    var tape = $(els[0]);

                    // Store the Simile positioning styles.
                    tape.data('positioningStyles', tape.attr('style'));

                    // Instantiate the span styler on the tape.
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
                    self._idToTapeElements[evt._eventID] = [tape];

                }

            });

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
                x: -(parseInt($(band).css('left'))) + (this.element.width() / 2),
                y: -(parseInt($(band).css('top'))) + (this.element.height() / 2)
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

                if (event._eventID == id) {
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
         * Get array of zoom indices.
         *
         * - return void.
         */
        getZoomIndexArray: function() {

            return new Array(
                {pixelsPerInterval: 280,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval: 140,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval:  70,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval:  35,  unit: Timeline.DateTime.HOUR},
                {pixelsPerInterval: 400,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.DAY},
                {pixelsPerInterval: 400,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.MONTH},
                {pixelsPerInterval: 400,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.YEAR},
                {pixelsPerInterval: 400,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval: 200,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval: 100,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval:  50,  unit: Timeline.DateTime.DECADE},
                {pixelsPerInterval: 400,  unit: Timeline.DateTime.CENTURY},
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
         * Rerender the timeline.
         */
        refresh: function() {
            this.timeline.layout()
        }

    });

})( jQuery );
