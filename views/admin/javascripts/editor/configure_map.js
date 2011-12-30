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


    $.widget('neatline.configuremap', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this.content =              $('#configure-map');
            this.vectorColor =          this.content.find('input[name="default-vector-color"]');
            this.strokeColor =          this.content.find('input[name="default-stroke-color"]');
            this.vectorOpacity =        this.content.find('input[name="default-vector-opacity"]');
            this.strokeOpacity =        this.content.find('input[name="default-stroke-opacity"]');
            this.strokeWidth =          this.content.find('input[name="default-stroke-width"]');
            this.pointRadius =          this.content.find('input[name="default-point-radius"]');
            this.baseLayer =            this.content.find('select[name="base-layer"]');
            this.saveButton =           this.content.find('button.save');

            // Construct the dropdown manager and form widgets.
            this._constructDropdown();
            this._constructFormWidgets();

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         *
         * - return void.
         */
        _constructDropdown: function() {
            this.element.dropdown();
        },

        /*
         * Instantiate miniColors and integerDragger on the inputs.
         *
         * - return void.
         */
        _constructFormWidgets: function() {

            var self = this;

            // ** VECTOR COLOR.
            this.vectorColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('vectorColorEdit', {}, { 'color': hex });
                }

            });

            // ** STROKE COLOR.
            this.strokeColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('strokeColorEdit', {}, { 'color': hex });
                }

            });

            // ** VECTOR OPACITY.
            this.vectorOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('vectorOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** STROKE OPACITY.
            this.strokeOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('strokeOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** STROKE WIDTH.
            this.strokeWidth.integerdragger({
                min: 0,
                default: 1,
                px_per_unit: 8,
                change: function(evt, obj) {
                    self._trigger('strokeWidthEdit', {}, { 'value': obj.value });
                }
            });

            // ** POINT RADIUS.
            this.pointRadius.integerdragger({
                min: 1,
                default: 6,
                px_per_unit: 8,
                change: function(evt, obj) {
                    self._trigger('pointRadiusEdit', {}, { 'value': obj.value });
                }
            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': function() {
                    self._trigger('save');
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        }

    });

})( jQuery );
