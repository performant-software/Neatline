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
            dragbox_id: 'drag-box',
            options_id: 'options',
            top_block_percentage: 60
        },

        _create: function() {

            // Getters for options and dragbox divs.
            this.buttons = $('#' + this.options.options_id);
            this.dragbox = $('#' + this.options.dragbox_id);

            // Squash text selection and gloss the buttons.
            this._disableSelect();
            this._createButtons();

            // Set tracker variables for element presence.
            this._is_map = false;
            this._is_timeline = false;
            this._is_undated_items = false;

            // Set tracker variables for element position.
            this._top_element = 'map'; // 'map' or 'timeline'
            this._undated_items_position = 'right'; // 'right' or 'left'
            this._undated_items_height = 'partial'; // 'partial' or 'full'

            // Create class-globals for the drag divs.
            this.map_drag = null;
            this.timeline_drag = null;
            this.undated_items_drag = null;

            // By default, add all elements.
            this._toggle_map();
            this._toggle_timeline();
            this._toggle_undated_items();

        },

        _disableSelect: function() {

            // Turn off text selection on the whole container div.
            this.element.css('MozUserSelect', 'none');
            this.element.bind('selectstart mousedown', function() {
                return false;
            });

            // Fix the pointer style in the drag box.
            this.dragbox.css('cursor', 'default');

        },

        _createButtons: function() {

            // Button-ify the map, timeline, and undated items checkboxes.
            $('#toggle-map').togglebutton({ pressed_by_default: true });
            $('#toggle-timeline').togglebutton({ pressed_by_default: true });
            $('#toggle-undated-items').togglebutton({ pressed_by_default: true });

        },

        _toggle_map: function() {

            switch(this._is_map) {

                case true:
                    // remove.
                    this._is_map = false;
                break;

                case false:

                    this.map_drag = $('<div id="drag-map" class="draggable">\
                                          <span class="drag-tag">Map</span>\
                                       </div>');

                    // if timeline
                    if (this._is_timeline) {

                    }

                    // if no timeline
                    else {

                        this.dragbox.append(this.map_drag);
                        this.map_drag.css('height', '100%');
                        this._position_tag(this.map_drag);

                    }

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

                    this.timeline_drag = $('<div id="drag-timeline" class="draggable">\
                                               <span class="drag-tag">Timeline</span>\
                                            </div>');

                    // if map
                    if (this._is_map) {

                        // if map on top
                        if (this._top_element == 'map') {

                            this.map_drag.css('height', this.options.top_block_percentage + '%');
                            this._position_tag(this.map_drag);

                            this.dragbox.append(this.timeline_drag);
                            this.timeline_drag.css('height', 100-this.options.top_block_percentage + '%');
                            this._position_tag(this.timeline_drag);

                        }

                    }

                    // if no map
                    else {

                        this.dragbox.append(this.timeline_drag);
                        this.timeline_drag.css('height', '100%');
                        this._position_tag(this.timeline_drag);

                    }

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

        },

        _position_tag: function(draggable) {

            var tag = draggable.find('.drag-tag');
            var draggable_height = draggable.height();
            var tag_height = tag.height();

            tag.css('top', (draggable_height/2)-(tag_height/2) + 'px');

        },

        _destroy: function() {

        }

    });

})( jQuery );


// Usage.
jQuery(document).ready(function($) {

    $('#layout-builder').layoutbuilder();

});
