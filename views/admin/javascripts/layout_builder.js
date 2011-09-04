/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * JavaScript for the layout builder application in the add view.
 *
 * PHP version 5
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

    $.widget('neatline.layoutbuilder', {

        options: {
            draggable_id: 'drag-box',
            options_id: 'options'
        },

        _create: function() {

            this._createButtons();

            // Set tracker variables for element presence.
            this._is_map = false;
            this._is_timeline = false;
            this._is_undated_items = false;

            // Set tracker variables for element position.
            this._top_element = 'map'; // 'map' or 'timeline'
            this._undated_items_position = 'right'; // 'right' or 'left'
            this._undated_items_height = 'partial'; // 'partial' or 'full'

            // By default, add all elements.
            this._toggle_map();
            this._toggle_timeline();
            this._toggle_undated_items();

        },

        _destroy: function() {

        },

        _createButtons: function() {

            // Button-ify the map, timeline, and undated items checkboxes.
            $('#toggle_map').button();
            $('#toggle_timeline').button();
            $('#toggle_undated_items').button();
            $('#' + this.options.options_id).buttonset();

        },

        _toggle_map: function() {

            switch(this._is_map) {

                case true:
                    // remove.
                    this._is_map = false;
                break;

                case false:
                    // add.
                    this._is_map = true;
                break;

            }

        },

        _toggle_timeline: function() {

            switch(this._is_timeline) {

                case true:
                    // remove.
                    this._is_timeline = false;
                break;

                case false:
                    // add.
                    this._is_timeline = true;
                break;

            }

        },

        _toggle_undated_items: function() {

            switch(this._is_undated_items) {

                case true:
                    // remove.
                    this._is_undated_items = false;
                break;

                case false:
                    // add.
                    this._is_undated_items = true;
                break;

            }

        }

    });

})( jQuery );


// Usage.
jQuery(document).ready(function($) {

    $('#layout-builder').layoutbuilder();

});
