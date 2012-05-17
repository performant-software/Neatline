/**
 * Timeline dropdown menu.
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


    $.widget('neatline.configuretimeline', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this.content = $('#configure-timeline');
            this.bandActive = this.content.find('input[name="band-active"]');
            this.bandUnit = this.content.find('select[name="band-unit"]');
            this.bandHeight = this.content.find('input[name="band-height"]');
            this.saveButton = this.content.find('button.save');

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
         * Build integer dragger on height input.
         *
         * - return void.
         */
        _constructFormWidgets: function() {

            // ** BAND HEIGHT.
            this.bandHeight.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 2
            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': _.bind(function() {
                    this.postSettings();
                }, this),

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        /*
         * Get values out of inputs.
         *
         * - return object: The data.
         */
        _getData: function() {

            var data = {};

            data.exhibit_id =               Neatline.record.id;
            data.band_active =              this.bandActive.is(':checked');
            data.band_unit =                this.bandUnit.val();
            data.band_height =              parseInt(this.bandHeight.val(), 10);

            return data;

        },

        /*
         * Commit the settings.
         *
         * - return void.
         */
        postSettings: function() {

            var self = this;

            // Get the settings.
            var data = this._getData();

            // Commit.
            $.ajax({

                url: 'ajax/timelinesettings',
                type: 'POST',
                data: data,

                success: function() {
                    self._trigger('newdefaults');
                }

            });

        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return mixed: The attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });

})( jQuery );
