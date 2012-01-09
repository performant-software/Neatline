/*
 * Map dropdown menu.
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


    $.widget('neatline.configurelayout', {

        /*
         * Get and prepare markup, run start-up routine.
         */
        _create: function() {

            // Get the buttons.
            this.saveArrangementButton =    $('#save-arrangement');
            this.fixPositionsButton =       $('#fix-positions');

            // Construct the dropdown manager.
            this._constructDropdown();

            // Instantiate the layout builder.
            this.layoutBuilder = $('#configure-layout');
            this.layoutBuilder.layoutbuilder();

            // Add events to buttons.
            this._addEvents();

        },

        /*
         * Listen for mousedown on the buttons.
         */
        _addEvents: function() {

            var self = this;

            this.saveArrangementButton.bind({
                'mousedown': function() {
                    self.saveArrangement();
                }
            });

            this.fixPositionsButton.bind({
                'mousedown': function() {
                    self._trigger('savepositions');
                }
            });

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         */
        _constructDropdown: function() {

            var self = this;

            this.element.dropdown({

                // On resize, update the layout builder markup.
                'resize': function() {
                    self.layoutBuilder.layoutbuilder('getPxConstants');
                    self.layoutBuilder.layoutbuilder('centerAllTags');
                },

                'showstart': function() {
                    self.layoutBuilder.layoutbuilder('getPxConstants');
                    self.layoutBuilder.layoutbuilder('centerAllTags');
                },

                'show': function() {
                    self.layoutBuilder.layoutbuilder('getPxConstants');
                    self.layoutBuilder.layoutbuilder('centerAllTags');
                }

            });

        },

        /*
         * Post a new set of arrangement parameters.
         */
        saveArrangement: function() {

            var self = this;
            var params = this.layoutBuilder.layoutbuilder('getArrangementParameters');

            // Save data.
            $.ajax({

                url: 'arrangement',
                type: 'POST',
                dataType: 'json',
                data: params,

                success: function(data) {

                    // Trigger the block updates in the exhibit.
                    self._trigger('newarrangement', {}, {
                        'params': data
                    });

                }

            });

        },

        /*
         * Post a new positioning defaults.
         */
        savePositions: function(mapExtent, mapZoom, timelineCenter) {

            var self = this;

            // Save data.
            $.ajax({

                url: 'positions',
                type: 'POST',

                data: {
                    neatline_id: Neatline.id,
                    map_extent: mapExtent,
                    map_zoom: mapZoom,
                    timeline_center: timelineCenter
                },

                success: function() {
                    self._trigger('newpositions');
                }

            });

        }

    });


})( jQuery );
