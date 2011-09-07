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
            top_block_percentage: 60,
            undated_items_width: 150
        },

        _create: function() {

            // Getters for options and dragbox divs.
            this.buttons = $('#' + this.options.options_id);
            this.dragbox = $('#' + this.options.dragbox_id);

            // Get fixed pixel values for heights.
            this._getPxHeights();

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
            this._toggleMap();
            this._toggleTimeline();
            this._toggleUndatedItems();

        },

        _getPxHeights: function() {

            this._dragbox_height = this.dragbox.height();
            this._dragbox_width = this.dragbox.width();

            this._top_block_height = this._dragbox_height * (this.options.top_block_percentage/100);
            this._bottom_block_height = this._dragbox_height - this._top_block_height;

            this._undated_items_left_offset = this._dragbox_width - this.options.undated_items_width;

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

            // Instantiate buttons, define callbacks.

            $('#toggle-map').togglebutton({
                pressed_by_default: true,
                press: function() { },
                unpress: function() { }
            });

            $('#toggle-timeline').togglebutton({
                pressed_by_default: true,
                press: function() { },
                unpress: function() { }
            });

            $('#toggle-undated-items').togglebutton({
                pressed_by_default: true,
                press: function() { },
                unpress: function() { }
            });

        },

        _toggleMap: function() {

            switch(this._is_map) {

                case true:
                    // remove.
                    this._is_map = false;
                break;

                case false:

                    // create the div
                    this.map_drag = $('<div id="drag-map" class="draggable">\
                                          <span class="drag-tag">Map</span>\
                                       </div>');

                    // if timeline
                    if (this._is_timeline) {

                    }

                    // if no timeline
                    else {

                        this.map_drag.css('height', this._dragbox_height);
                        this.map_drag.css('width', this._dragbox_width);
                        this.dragbox.append(this.map_drag);
                        this._position_tag(this.map_drag);

                    }

                    this._is_map = true;

                break;

            }

        },

        _toggleTimeline: function() {

            switch(this._is_timeline) {

                case true:
                    // remove.
                    this._is_timeline = false;
                break;

                case false:

                    // create the div
                    this.timeline_drag = $('<div id="drag-timeline" class="draggable">\
                                               <span class="drag-tag">Timeline</span>\
                                            </div>');

                    // if map
                    if (this._is_map) {

                        // if map on top
                        if (this._top_element == 'map') {

                            this.map_drag.css('height', this._top_block_height + 'px');
                            this._position_tag(this.map_drag);

                            this.timeline_drag.css('height', this._bottom_block_height + 'px');
                            this.timeline_drag.css('width', this._dragbox_width + 'px');
                            this.timeline_drag.css('top', this._top_block_height + 'px');
                            this.dragbox.append(this.timeline_drag);
                            this._position_tag(this.timeline_drag);

                        }

                        // if timeline on top
                        else {



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

        _toggleUndatedItems: function() {

            switch(this._is_undated_items) {

                case true:
                    // remove.
                    this._is_undated_items = false;
                break;

                case false:

                    // create the div
                    this.undated_items_drag = $('<div id="drag-undated-items" class="draggable">\
                                                    <span class="drag-tag">Undated Items</span>\
                                                 </div>');

                    // set height based on current loadout

                    var height = null;

                    if (this._undated_items_height == 'full') {
                        height = this._dragbox_height;
                    }
                    else {
                        if (this._top_element == 'map') {
                            height = this._bottom_block_height;
                        }
                        else {
                            height = this._top_block_height;
                        }
                    }

                    this.undated_items_drag.css('height', height + 'px');

                    // set width

                    this.undated_items_drag.css('width', this.options.undated_items_width + 'px');

                    // set left offset

                    var left_offset = null;

                    if (this.undated_items_position == 'left') {
                        left_offset = 0;
                    }
                    else {
                        left_offset = this._undated_items_left_offset;
                    }

                    this.undated_items_drag.css('left', left_offset + 'px');

                    // set top offset

                    var top_offset = null;

                    if (this._top_element == 'map') {
                        top_offset = this._top_block_height;
                    }
                    else {
                        top_offset = 0;
                    }

                    this.undated_items_drag.css('top', top_offset + 'px');

                    // append and reposition label
                    this.dragbox.append(this.undated_items_drag);
                    this._position_tag(this.undated_items_drag);

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
