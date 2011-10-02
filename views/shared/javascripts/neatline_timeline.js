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

            },

            // Animation constants.
            animation: {

            },

            // CSS constants.
            css: {

            },

            // Hexes.
            colors: {

            }

        },

        _create: function() {

            // Getters.
            this.params = Neatline;

            // Ignition.
            this._instantiateTimeglider();

        },

        _instantiateTimeglider: function() {

            var bandInfos = [

                Timeline.createBandInfo({
                    width:          "70%", 
                    intervalUnit:   Timeline.DateTime.MONTH, 
                    intervalPixels: 100
                }),

                Timeline.createBandInfo({
                    width:          "30%", 
                    intervalUnit:   Timeline.DateTime.YEAR, 
                    intervalPixels: 200
                })

            ];

            this.timeline = Timeline.create(document.getElementById("timeline"), bandInfos);

        }

    });


})( jQuery );

