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

        options: {

            // Timeline constants.
            timeglider: {
                min_zoom: 5,
                max_zoom: 60,
                initial_zoom: 40
            },

            // Markup hooks.
            markup: {
                popup_id: 'timeline-popup',
                popup_title: 'h3.title-text',
                popup_content: 'div.content',
                popup_close: 'a.close'
            },

            // Animation constants.
            animation: {

            },

            // CSS constants.
            css: {
                popup_vertical_offset: 30,
                popup_content_max_height: 200
            },

            // Hexes.
            colors: {

            }

        },

        _create: function() {

            // Getters.
            this.params = Neatline;
            this._window = $(window);
            this.popup = $('#' + this.options.markup.popup_id);
            this.popupTitle = this.popup.find(this.options.markup.popup_title);
            this.popupContent = this.popup.find(this.options.markup.popup_content);
            this.popupClose = this.popup.find(this.options.markup.popup_close);

            // Initialize popup and tracker.
            this._onPopup = false;
            this._initializePopup();

            // Initialize resize timer.
            this.resizeTimerId = null;

            // Ignition.
            this._instantiateSimile();

        },

        _initializePopup: function() {

            var self = this;

            // Bind close event.
            this.popupClose.bind('mousedown', function() {
                self._hidePopup();
            });

            // Bind close event to window.
            this._window.bind('mousedown', function() {
                if (!self._onPopup) {
                    self._hidePopup();
                }
            });

            // Set the max-height property on the content div.
            this.popupContent.css('max-height', this.options.css.popup_content_max_height);

        },

        _hidePopup: function() {

            // Fade down.
            this.popup.animate({
                'opacity': 0
            }, 100);

        },

        _instantiateSimile: function() {

            var self = this;

            // Instantiate the event source object.
            this.eventSource = new Timeline.DefaultEventSource();

            // Define band data.
            this.bandInfos = [

                Timeline.createBandInfo({
                    eventSource:    this.eventSource,
                    width:          "60%",
                    intervalUnit:   Timeline.DateTime.MONTH,
                    intervalPixels: 100
                }),

                Timeline.createBandInfo({
                    eventSource:    this.eventSource,
                    width:          "40%",
                    intervalUnit:   Timeline.DateTime.YEAR,
                    intervalPixels: 200
                })

            ];

            // Sync bands.
            this.bandInfos[1].syncWith = 0;
            this.bandInfos[1].highlight = true;

            // Instantiate and load JSON.
            this.timeline = Timeline.create(document.getElementById("timeline"), this.bandInfos);
            this.loadData();

            // Override the default click event callbacks.
            this._overrideClickCallbacks();

            // Reposition on window resize.
            this._window.bind({

                'resize': function() {
                    self.timeline.layout();
                }

            });

        },

        _overrideClickCallbacks: function() {

            var self = this;

            // Whitewash over the default bubble popup event so as to get event id data.
            Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {

                // Trigger out to the deployment code.
                self._trigger('eventclick', {}, {
                    'itemId': evt._eventID
                });

                // Populate data in the popup.
                self.popupTitle.text(evt._text);
                self.popupContent.text(evt._description);

                // Calculate top and left offsets based on the size of the popup.
                var height = self.popup.height();
                var width = self.popup.width();

                // Position the scrollbar.
                self.popupContent.smallscroll('positionBar');

                // Position and show.
                self.popup.css({
                    'display': 'block',
                    'top': y - height - self.options.css.popup_vertical_offset,
                    'left': x - (width / 2)
                });

                // Fade in.
                self.popup.animate({
                    'opacity': 1
                }, 100);

                // Add cursor tracker.
                self.popup.bind({

                    'mouseenter': function() {
                        self._onPopup = true;
                    },

                    'mouseleave': function() {
                        self._onPopup = false;
                    }

                });

            }

        },

        loadData: function() {

            var self = this;

            // Ping the json server and get the events data.
            this.timeline.loadJSON(this.params.dataSources.timeline, function(json, url) {
                self.eventSource.clear();
                self.eventSource.loadJSON(json, url);
            });

        },

        zoomToEvent: function(id) {

            var self = this;

            // Walk the events registry and try to find an event for the item id.
            // This is inefficient, but Simile does not have a utility to get an event
            // by a given attribute. If a match is found, scroll the timeline to
            // the start location of the event.
            $.each(this.timeline._bands[0]._eventSource._events._idToEvent, function(i, event) {
                if (event._eventID == id) {
                    self.timeline.getBand(0).setCenterVisibleDate(event._start);
                }
            });

        }

    });


})( jQuery );

