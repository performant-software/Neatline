/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Dynamic layout builder application in the add view.
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

            // Ids.
            dragbox_id: 'drag-box',
            options_id: 'options',
            top_element_input_id: 'top_element',
            udi_position_input_id: 'undated_items_horizontal_position',
            udi_height_input_id: 'undated_items_height',
            is_map_input_id: 'is_map',
            is_timeline_input_id: 'is_timeline',
            is_undated_items_input_id: 'is_undated_items',
            timeline_select_id: 'timeline',
            map_select_id: 'map',

            // Css dimension defaults, animation constants.
            top_block_percentage: 60,
            undated_items_width: 150,
            vertical_offset_tier1: 75,
            vertical_offset_tier2: 150,
            gloss_fade_duration: 300,

            // Starting configuration params.
            def_top_element: 'map',
            def_udi_position: 'right',
            def_udi_height: 'partial',
            def_is_map: false,
            def_is_timeline: false,
            def_is_undated_items: false,

            // Miscellaneous
            no_selection_string: '-',

            // Hex defaults.
            colors: {
                map: {
                    default: '#f9f9f9',
                    target: '#fffcf4'
                },
                timeline: {
                    default: '#f4f4f4',
                    target: '#fffcf4'
                },
                undated_items: {
                    default: '#f0f0f0',
                    target: '#fffcf4'
                }
            }

        },

        _create: function() {

            // Get window for mousemove binding.
            this._window = $(window);

            // Getters for options and dragbox divs.
            this.buttons = $('#' + this.options.options_id);
            this.dragbox = $('#' + this.options.dragbox_id);

            // Get fixed pixel values for heights.
            this.getPxConstants();

            // Create draggers.
            this._createDraggers();

            // Squash text selection and gloss the buttons.
            this._disableSelect();
            this._createButtons();

            // Set tracker variables for element position.
            this._setStartingParameters();

            // Set tracker arrays that record the last parameter
            // loadouts that triggered a div slide.
            this._last_map_slide_params = null;
            this._last_timeline_slide_params = null;
            this._last_undated_items_slide_params = null;

            // Gloss.
            this._addDragEvents();

        },

        _setStartingParameters: function() {

            // Get starting parameters out of the Neatline global.
            this._top_element = Neatline.top_element;
            this._undated_items_horizontal_position = Neatline.undated_items_horizontal_position;
            this._undated_items_vertical_position = Neatline.undated_items_vertical_position;
            this._undated_items_height = Neatline.undated_items_height;
            this._is_map = Neatline.is_map;
            this._is_timeline = Neatline.is_timeline;
            this._is_undated_items = Neatline.is_undated_items;

            // If not (on edit page), enable the toggle buttons directly.
            this.map_toggle.togglebutton('enable');
            this.timeline_toggle.togglebutton('enable');
            this.undated_items_toggle.togglebutton('enable');

            // For each block, if active then temporarily knock false
            // the tracker (so that the button press initializes the
            // block to active) and trigger the button press.
            if (this._is_map) {
                this._is_map = false;
                this.map_toggle.togglebutton('press');
            }

            if (this._is_timeline) {
                this._is_timeline = false;
                this.timeline_toggle.togglebutton('press');
            }

            if (this._is_undated_items) {
                this._is_undated_items = false;
                this.undated_items_toggle.togglebutton('press');
            }

        },

        getPxConstants: function() {

            this._dragbox_height = this.dragbox.height();
            this._dragbox_width = this.dragbox.width();
            this._dragbox_position = this.dragbox.offset();

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

            this.map_toggle = $('#toggle-map');
            this.timeline_toggle = $('#toggle-timeline');
            this.undated_items_toggle = $('#toggle-undated-items');

            this.map_toggle.togglebutton({
                pressed_by_default: false,
                enabled_by_default: false,
                press: $.proxy(this._toggleMap, this),
                unpress: $.proxy(this._toggleMap, this)
            });

            this.timeline_toggle.togglebutton({
                pressed_by_default: false,
                enabled_by_default: false,
                press: $.proxy(this._toggleTimeline, this),
                unpress: $.proxy(this._toggleTimeline, this)
            });

            this.undated_items_toggle.togglebutton({
                pressed_by_default: false,
                enabled_by_default: false,
                press: $.proxy(this._toggleUndatedItems, this),
                unpress: $.proxy(this._toggleUndatedItems, this)
            });

        },

        _createDraggers: function() {

            // Create the map.
            this.map_drag = this.__createMapDiv();

            // Create the timeline.
            this.timeline_drag = this.__createTimelineDiv();

            // Create the undated items.
            this.undated_items_drag = this.__createUndatedItemsDiv();

            // Inject.
            this.dragbox.append(
                this.map_drag,
                this.timeline_drag,
                this.undated_items_drag);

        },

        _addToggleEvents: function() {

            var self = this;

            // Bind callback on map selection change.
            this.map_select.bind('change', function() {

                var value = self.map_select.find('option:selected').html();

                if (value != self._last_map_dropdown_selection) {

                    if (value == self.options.no_selection_string && self._is_map) {
                        self.map_toggle.togglebutton('press');
                        self.map_toggle.togglebutton('disable');
                    }

                    else if (value == self.options.no_selection_string && !self._is_map) {
                        self.map_toggle.togglebutton('disable');
                    }

                    else if (value != self.options.no_selection_string && !self._is_map) {
                        self.map_toggle.togglebutton('enable');
                        self.map_toggle.togglebutton('press');
                    }

                }

                self._last_map_dropdown_selection = value;

            });

            // Bind callback on map selection change.
            this.timeline_select.bind('change', function() {

                var value = self.timeline_select.find('option:selected').html();

                if (value != self._last_timeline_dropdown_selection) {

                    if (value == self.options.no_selection_string && self._is_timeline) {

                        if (self._is_undated_items) {
                            self.undated_items_toggle.togglebutton('press');
                            self.undated_items_toggle.togglebutton('disable');
                        }

                        self.timeline_toggle.togglebutton('press');
                        self.timeline_toggle.togglebutton('disable');

                    }

                    else if (value == self.options.no_selection_string && !self._is_timeline) {
                        self.timeline_toggle.togglebutton('disable');
                    }

                    else if (value != self.options.no_selection_string && !self._is_timeline) {
                        self.timeline_toggle.togglebutton('enable');
                        self.timeline_toggle.togglebutton('press');
                        self.undated_items_toggle.togglebutton('enable');
                        self.undated_items_toggle.togglebutton('press');
                    }

                }

                self._last_timeline_dropdown_selection = value;

            });

        },

        _addDragEvents: function() {

            var self = this;

            // Gloss map.
            this.map_drag.bind({

                'mouseenter': function() {
                    if (!self._is_dragging) {
                        self.__mapHighlight('enter');
                    }
                },

                'mouseleave': function() {
                    self.__mapHighlight('leave');
                },

                'mousedown': function(e) {
                    if (!self._is_dragging) {
                        self._current_dragger = 'map';
                        self.__doMapDrag(e);
                    }
                }

            });

            // Gloss timeline.
            this.timeline_drag.bind({

                'mouseenter': function() {
                    if (!self._is_dragging) {
                        self.__timelineHighlight('enter');
                    }
                },

                'mouseleave': function() {
                    self.__timelineHighlight('leave');
                },

                'mousedown': function(e) {
                    if (!self._is_dragging) {
                        self._current_dragger = 'timeline';
                        self.__doTimelineDrag(e);
                    }
                }

            });

            // Gloss undated items.
            this.undated_items_drag.bind({

                'mouseenter': function() {
                    if (!self._is_dragging) {
                        self.__undatedItemsHighlight('enter');
                    }
                },

                'mouseleave': function() {
                    self.__undatedItemsHighlight('leave');
                },

                'mousedown': function(e) {
                    if (!self._is_dragging) {
                        self._current_dragger = 'undated';
                        self.__doUndatedItemsDrag(e);
                    }
                }

            });

        },

        _repositionDraggers: function() {

            // Map.
            this.map_drag.css({
                'height': this.__getMapHeight(),
                'width': this.__getMapWidth(),
                'top': this.__getMapTopOffset(),
                'left': this.__getMapLeftOffset()
            });

            // Timeline.
            this.timeline_drag.css({
                'height': this.__getTimelineHeight(),
                'width': this.__getTimelineWidth(),
                'top': this.__getTimelineTopOffset(),
                'left': this.__getTimelineLeftOffset()
            });

            // Undated items.
            this.undated_items_drag.css({
                'height': this.__getUndatedItemsHeight(),
                'width': this.__getUndatedItemsWidth(),
                'top': this.__getUndatedItemsTopOffset(),
                'left': this.__getUndatedItemsLeftOffset()
            });

            // Center tags.
            this.centerAllTags();

        },

        centerAllTags: function() {

            this._position_tag(this.map_drag);
            this._position_tag(this.timeline_drag);
            this._position_tag(this.undated_items_drag);

        },

        _toggleMap: function() {

            switch(this._is_map) {

                case true:

                    this._is_map = false;

                    // Display none the map.
                    this.map_drag.css('display', 'none');

                break;

                case false:

                    this._is_map = true;

                    // Show the div.
                    this.map_drag.css('display', 'block');

                break;

            }

            // Recalculate all positions for all divs.
            this._repositionDraggers();

        },

        _toggleTimeline: function() {

            switch(this._is_timeline) {

                case true:

                    this._is_timeline = false;

                    // Display none the timeline.
                    this.timeline_drag.css('display', 'none');

                break;

                case false:

                    this._is_timeline = true;

                    // Show the div.
                    this.timeline_drag.css('display', 'block');

                break;

            }

            // Recalculate all positions for all divs.
            this._repositionDraggers();

        },

        _toggleUndatedItems: function() {

            switch(this._is_undated_items) {

                case true:

                    this._is_undated_items = false;

                    // Display none the timeline.
                    this.undated_items_drag.css('display', 'none');

                break;

                case false:

                    this._is_undated_items = true;

                    // Show the div.
                    this.undated_items_drag.css('display', 'block');

                break;

            }

            // Recalculate all positions for all divs.
            this._repositionDraggers();

        },

        _position_tag: function(draggable) {

            var tag = draggable.find('.drag-tag');
            var draggable_height = draggable.height();
            var tag_height = tag.height();

            tag.css('top', (draggable_height/2)-(tag_height/2) + 'px');

        },

        _animate_position_tag: function(draggable, height) {

            var tag = draggable.find('.drag-tag');
            var tag_height = tag.height();

            tag.stop().animate({ 'top': (height/2)-(tag_height/2) + 'px' });

        },

        _destroy: function() {

        },

        /*
         * Glossing and dragging methods.
         */

        __mapHighlight: function(enter_or_leave) {

            // Figure out which color to tween to.
            switch (enter_or_leave) {

                case 'enter':
                    var target = this.options.colors.map.target;
                break;

                case 'leave':
                    var target = this.options.colors.map.default;
                break;

            }

            this.map_drag.clearQueue().animate({
                'background-color': target
            }, this.options.gloss_fade_duration);

        },

        __timelineHighlight: function(enter_or_leave) {

            // Figure out which color to tween to.
            switch (enter_or_leave) {

                case 'enter':
                    var target = this.options.colors.timeline.target
                break;

                case 'leave':
                    var target = this.options.colors.timeline.default
                break;

            }

            this.timeline_drag.clearQueue().animate({
                'background-color': target
            }, this.options.gloss_fade_duration);

        },

        __undatedItemsHighlight: function(enter_or_leave) {

            // Figure out which color to tween to.
            switch (enter_or_leave) {

                case 'enter':
                    var target = this.options.colors.undated_items.target
                break;

                case 'leave':
                    var target = this.options.colors.undated_items.default
                break;

            }

            this.undated_items_drag.clearQueue().animate({
                'background-color': target
            }, this.options.gloss_fade_duration);

        },

        __doMapDrag: function(trigger_event_object) {

            this._is_dragging = true;

            // Get starting pointer coordinates.
            var startingX = trigger_event_object.pageX;
            var startingY = trigger_event_object.pageY;

            // Get starting div offsets.
            var startingOffsetX = this.__getMapLeftOffset();
            var startingOffsetY = this.__getMapTopOffset();

            // Bind self.
            var self = this;

            // Make the drag div see-through and always on top.
            this.map_drag.css({
                'opacity': 0.5,
                'z-index': 99
            });

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offsets.
                    var offsetX = e.pageX - startingX;
                    var offsetY = e.pageY - startingY;

                    // Apply new position.
                    self.map_drag.css({
                        'left': startingOffsetX + offsetX,
                        'top': startingOffsetY + offsetY
                    });

                    // If there is a timeline.
                    if (self._is_timeline || self._is_undated_items) {

                        // If the timeline is on the bottom.
                        if (self._top_element == 'map') {

                            // If the cursor dips below the top border
                            // of the timeline div, slide the timeline up.
                            if (e.pageY > (self._top_block_height + self._dragbox_position.top) && self._is_timeline) {
                                self._top_element = 'timeline';
                                self.__slideTimeline(false);
                                self.__slideUndatedItems(false);
                            }

                            if (self._is_undated_items && self._undated_items_horizontal_position == 'left') {

                                // If the cursor crosses over the centerline going left.
                                if (e.pageX < (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'right';
                                    self.__slideUndatedItems(false);
                                    self.__slideTimeline(false);

                                }

                            }

                            else if (self._is_undated_items && self._undated_items_horizontal_position == 'right') {

                                // If the cursor crosses over the centerline going right.
                                if (e.pageX > (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'left';
                                    self.__slideUndatedItems(false);
                                    self.__slideTimeline(false);

                                }

                            }

                        }

                        // If the timeline is on the top.
                        else {

                            // If the cursor moves above the bottom border
                            // of the timeline div, slide the timeline down.
                            if (e.pageY < (self._dragbox_position.top + self._top_block_height) && self._is_timeline) {
                                self._top_element = 'map';
                                self.__slideTimeline(false);
                                self.__slideUndatedItems(false);
                            }

                            if (self._is_undated_items && self._undated_items_horizontal_position == 'left') {

                                // If the cursor crosses over the centerline going left.
                                if (e.pageX < (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'right';
                                    self.__slideUndatedItems(false);
                                    self.__slideTimeline(false);

                                }

                            }

                            else if (self._is_undated_items && self._undated_items_horizontal_position == 'right') {

                                // If the cursor crosses over the centerline going right.
                                if (e.pageX > (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'left';
                                    self.__slideUndatedItems(false);
                                    self.__slideTimeline(false);

                                }

                            }

                        }

                    }

                },

                'mouseup': function() {

                    self.__slideMap(true);
                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        __doTimelineDrag: function(trigger_event_object) {

            this._is_dragging = true;

            // Get starting pointer coordinates.
            var startingX = trigger_event_object.pageX;
            var startingY = trigger_event_object.pageY;

            // Get starting div offsets.
            var timelineStartingOffsetX = this.__getTimelineLeftOffset();
            var timelineStartingOffsetY = this.__getTimelineTopOffset();

            // Bind self.
            var self = this;

            // Make the drag divs see-through and always on top.
            this.timeline_drag.css({
                'opacity': 0.5,
                'z-index': 99
            });

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offsets.
                    var offsetX = e.pageX - startingX;
                    var offsetY = e.pageY - startingY;

                    // Apply new position.
                    self.timeline_drag.css({
                        'left': timelineStartingOffsetX + offsetX,
                        'top': timelineStartingOffsetY + offsetY
                    });

                    // If there is a map.
                    if (self._is_map || self._is_undated_items) {

                        // Get current map top offset.
                        var mapTopOffset = self.__getMapTopOffset();

                        // If the timeline is on top.
                        if (self._top_element == 'timeline') {

                            // If the cursor dips below the top border
                            // of the timeline div, slide the timeline up.
                            if (e.pageY > (mapTopOffset + self._dragbox_position.top) && self._is_map) {
                                self._top_element = 'map';
                                self.__slideMap(false);
                                self.__slideUndatedItems(false);
                            }

                            if (self._is_undated_items && self._undated_items_horizontal_position == 'left') {

                                // If the cursor crosses over the centerline going left.
                                if (e.pageX < (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'right';
                                    self.__slideUndatedItems(false);
                                    self.__slideMap(false);

                                }

                            }

                            else if (self._is_undated_items && self._undated_items_horizontal_position == 'right') {

                                // If the cursor crosses over the centerline going right.
                                if (e.pageX > (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'left';
                                    self.__slideUndatedItems(false);
                                    self.__slideMap(false);

                                }

                            }

                        }

                        // If the timeline is on the bottom.
                        else {

                            // If the cursor moves above the bottom border
                            // of the timeline div, slide the timeline down.
                            if (e.pageY < (self._dragbox_position.top + self._top_block_height) && self._is_map) {
                                self._top_element = 'timeline';
                                self.__slideMap(false);
                                self.__slideUndatedItems(false);
                            }

                            if (self._is_undated_items && self._undated_items_horizontal_position == 'left') {

                                // If the cursor crosses over the centerline going left.
                                if (e.pageX < (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'right';
                                    self.__slideUndatedItems(false);
                                    self.__slideMap(false);

                                }

                            }

                            else if (self._is_undated_items && self._undated_items_horizontal_position == 'right') {

                                // If the cursor crosses over the centerline going right.
                                if (e.pageX > (self._dragbox_position.left + (self._dragbox_width / 2))) {

                                    self._undated_items_horizontal_position = 'left';
                                    self.__slideUndatedItems(false);
                                    self.__slideMap(false);

                                }

                            }

                        }

                    }

                },

                'mouseup': function() {

                    self.__slideTimeline(true);
                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        __doUndatedItemsDrag: function(trigger_event_object) {

            this._is_dragging = true;

            // Get starting pointer coordinates.
            var startingX = trigger_event_object.pageX;
            var startingY = trigger_event_object.pageY;

            // Get starting div offsets.
            var StartingOffsetX = this.__getUndatedItemsLeftOffset();
            var StartingOffsetY = this.__getUndatedItemsTopOffset();

            // Set starting height and position status.
            this._udi_height_at_start_of_drag = this._undated_items_height;
            this._udi_position_at_start_of_drag = this._undated_items_vertical_position;

            // Bind self.
            var self = this;

            // Create typable facades for vertical tier parameters.
            var vt1 = this.options.vertical_offset_tier1;
            var vt2 = this.options.vertical_offset_tier2;

            // Make the drag div see-through and always on top.
            this.undated_items_drag.css({
                'opacity': 0.5,
                'z-index': 99
            });

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offsets.
                    var offsetX = e.pageX - startingX;
                    var offsetY = e.pageY - startingY;

                    // Apply new position.
                    self.undated_items_drag.css({
                        'left': StartingOffsetX + offsetX,
                        'top': StartingOffsetY + offsetY
                    });

                    // Control flow to determine where/when the udi
                    // should be animated as the mouse position changes.

                    // If udi was partial-height at drag start.
                    if (self._udi_height_at_start_of_drag == 'partial') {

                        // If udi was on the bottom when the drag started.
                        if (self._udi_position_at_start_of_drag == 'bottom') {

                            // If the mouse has moved upwards but has not crossed
                            // through the first offset tier.
                            if (offsetY < 0 && offsetY > -vt1) {
                                self._undated_items_height = 'partial';
                                self._undated_items_vertical_position = 'bottom';
                                self.__slideTimeline(false);
                                self.__slideMap(false);
                            }

                            // If the mouse has moved upwards and the vertical
                            // offset is between the two vertical offset tiers.
                            else if (offsetY < -vt1 && offsetY > -vt2) {
                                self._undated_items_height = 'full';
                                self.__slideTimeline(false);
                                self.__slideMap(false);
                            }

                            // If the mouse has moved upwards and is over the
                            // second tier threshold.
                            else if (offsetY < -vt2) {
                                self._undated_items_height = 'partial';
                                self._undated_items_vertical_position = 'top';
                                self.__slideTimeline(false);
                                self.__slideMap(false);
                            }

                        }

                        // If udi was on the top when the drag started.
                        else if (self._udi_position_at_start_of_drag == 'top') {

                            // If the mouse has moved downwards but has not crossed
                            // through the first offset tier.
                            if (offsetY > 0 && offsetY < vt1) {
                                self._undated_items_height = 'partial';
                                self._undated_items_vertical_position = 'top';
                                self.__slideTimeline(false);
                                self.__slideMap(false);
                            }

                            // If the mouse has moved downwards and the vertical
                            // offset is between the two vertical offset tiers.
                            else if (offsetY > vt1 && offsetY < vt2) {
                                self._undated_items_height = 'full';
                                self.__slideTimeline(false);
                                self.__slideMap(false);
                            }

                            // If the mouse has moved downwards and is over the
                            // second tier threshold.
                            else if (offsetY > vt2) {
                                self._undated_items_height = 'partial';
                                self._undated_items_vertical_position = 'bottom';
                                self.__slideTimeline(false);
                                self.__slideMap(false);
                            }

                        }

                    }

                    // If udi was full-height at the start of the drag.
                    else if (self._udi_height_at_start_of_drag == 'full' && self._is_map && self._is_timeline) {

                        // If the mouse has moved upwards but has not crossed
                        // through the first vertical tier.
                        if (offsetY < 0 && offsetY > -vt1) {
                            self._undated_items_height = 'full';
                            self.__slideTimeline(false);
                            self.__slideMap(false);
                        }

                        // If the mouse has moved upwards and has crossed through
                        // the first vertical tier.
                        else if (offsetY < -vt1) {
                            self._undated_items_height = 'partial';
                            self._undated_items_vertical_position = 'top';
                            self.__slideTimeline(false);
                            self.__slideMap(false);
                        }

                        // If the mouse has moved downwards but has not crossed
                        // through the first vertical tier.
                        else if (offsetY > 0 && offsetY < vt1) {
                            self._undated_items_height = 'full';
                            self.__slideTimeline(false);
                            self.__slideMap(false);
                        }

                        // If the mouse has moved downwards and has crossed through
                        // the first vertical tier.
                        else if (offsetY > vt1) {
                            self._undated_items_height = 'partial';
                            self._undated_items_vertical_position = 'bottom';
                            self.__slideTimeline(false);
                            self.__slideMap(false);
                        }

                    }

                    // If udi is on the right.
                    if (self._undated_items_horizontal_position == 'right') {

                        // If the cursor crosses over the centerline going left.
                        if (e.pageX < (self._dragbox_position.left + (self._dragbox_width / 2))) {

                            self._undated_items_horizontal_position = 'left';
                            self.__slideTimeline(false);
                            self.__slideMap(false);

                        }

                    }

                    // If udi is on the left.
                    else {

                        // If the cursor crosses over the centerline going left.
                        if (e.pageX > (self._dragbox_position.left + (self._dragbox_width / 2))) {

                            self._undated_items_horizontal_position = 'right';
                            self.__slideTimeline(false);
                            self.__slideMap(false);

                        }

                    }

                },

                'mouseup': function() {

                    self.__slideUndatedItems(true);
                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        __slideTimeline: function(ending_slide) {

            var self = this;
            var newTimelineHeight = this.__getTimelineHeight();
            var _current_params = [
                this._top_element,
                this._undated_items_horizontal_position,
                this._undated_items_vertical_position,
                this._undated_items_height
            ];

            if (!$.compare(_current_params, this._last_timeline_slide_params)
                || this._current_dragger == 'timeline') {

                if (ending_slide) {

                    // Slide the timeline and undated items.
                    this.timeline_drag.stop().animate({
                        'height': newTimelineHeight,
                        'width': this.__getTimelineWidth(),
                        'top': this.__getTimelineTopOffset(),
                        'left': this.__getTimelineLeftOffset(),
                        'opacity': 1,
                        'z-index': 0
                    }, function() {

                        // On complete, if the slide is an ending
                        // slide, unset the dragging tracker.
                        self._is_dragging = false;

                    });

                }

                else {

                    // Slide the timeline and undated items.
                    this.timeline_drag.stop().animate({
                        'height': newTimelineHeight,
                        'width': this.__getTimelineWidth(),
                        'top': this.__getTimelineTopOffset(),
                        'left': this.__getTimelineLeftOffset()
                    });

                }

                this._animate_position_tag(this.timeline_drag, newTimelineHeight);

                // Record params loadout for the last slide.
                this._last_timeline_slide_params = [
                    this._top_element,
                    this._undated_items_horizontal_position,
                    this._undated_items_vertical_position,
                    this._undated_items_height
                ];

            }

        },

        __slideMap: function(ending_slide) {

            var self = this;
            var newMapHeight = this.__getMapHeight();
            var _current_params = [
                this._top_element,
                this._undated_items_horizontal_position,
                this._undated_items_vertical_position,
                this._undated_items_height
            ];

            if (!$.compare(_current_params, this._last_map_slide_params)
                || this._current_dragger == 'map') {

                if (ending_slide) {

                    // Slide the timeline and undated items.
                    this.map_drag.stop().animate({
                        'height': newMapHeight,
                        'width': this.__getMapWidth(),
                        'top': this.__getMapTopOffset(),
                        'left': this.__getMapLeftOffset(),
                        'opacity': 1,
                        'z-index': 0
                    }, function() {

                        // On complete, if the slide is an ending
                        // slide, unset the dragging tracker.
                        self._is_dragging = false;

                    });

                }

                else {

                    // Slide the timeline and undated items.
                    this.map_drag.stop().animate({
                        'height': newMapHeight,
                        'width': this.__getMapWidth(),
                        'top': this.__getMapTopOffset(),
                        'left': this.__getMapLeftOffset()
                    });

                }

                this._animate_position_tag(this.map_drag, newMapHeight);

                // Record params loadout for the last slide.
                this._last_map_slide_params = [
                    this._top_element,
                    this._undated_items_horizontal_position,
                    this._undated_items_vertical_position,
                    this._undated_items_height
                ];

            }

        },

        __slideUndatedItems: function(ending_slide) {

            var self = this;
            var newUndatedItemsHeight = this.__getUndatedItemsHeight();
            var _current_params = [
                this._top_element,
                this._undated_items_horizontal_position,
                this._undated_items_vertical_position,
                this._undated_items_height
            ];

            if (!$.compare(_current_params, this._last_undated_items_slide_params)
                || this._current_dragger == 'undated') {

                if (ending_slide) {

                    // Slide the timeline and undated items.
                    this.undated_items_drag.stop().animate({
                        'height': newUndatedItemsHeight,
                        'width': this.__getUndatedItemsWidth(),
                        'top': this.__getUndatedItemsTopOffset(),
                        'left': this.__getUndatedItemsLeftOffset(),
                        'opacity': 1,
                        'z-index': 0
                    }, function() {

                        // On complete, if the slide is an ending
                        // slide, unset the dragging tracker.
                        self._is_dragging = false;

                    });

                }

                else {

                    // Slide the timeline and undated items.
                    this.undated_items_drag.stop().animate({
                        'height': newUndatedItemsHeight,
                        'width': this.__getUndatedItemsWidth(),
                        'top': this.__getUndatedItemsTopOffset(),
                        'left': this.__getUndatedItemsLeftOffset()
                    });

                }

                this._animate_position_tag(this.undated_items_drag, newUndatedItemsHeight);

                // Record params loadout for the last slide.
                this._last_undated_items_slide_params = [
                    this._top_element,
                    this._undated_items_horizontal_position,
                    this._undated_items_vertical_position,
                    this._undated_items_height
                ];

            }

        },

        __updateHiddenInputs: function() {

            this.top_element_input.attr('value', this._top_element);
            this.udi_position_input.attr('value', this._undated_items_horizontal_position);
            this.udi_height_input.attr('value', this._undated_items_height);

        },


        /*
         * Construct the undated items dragger div.
         */
        __toggleUndatedItemsButton: function() {

            if (this._is_timeline) {
                $('#toggle-undated-items').css('display', 'inline');
            }

            else {
                $('#toggle-undated-items').css('display', 'none');
            }

        },

        /*
         * Construct the map dragger div.
         */
        __createMapDiv: function() {

            return $('<div id="drag-map" class="draggable">\
                        <span class="drag-tag">Map</span>\
                      </div>');

        },

        /*
         * Construct the timeline dragger div.
         */
        __createTimelineDiv: function() {

            return $('<div id="drag-timeline" class="draggable">\
                        <span class="drag-tag">Timeline</span>\
                      </div>');

        },

        /*
         * Construct the undated items dragger div.
         */
        __createUndatedItemsDiv: function() {

            return $('<div id="drag-undated-items" class="draggable">\
                        <span class="drag-tag">Undated Items</span>\
                      </div>');

        },

        /*
         * Calculate the height of the undated items block.
         */
        __getUndatedItemsHeight: function() {

            // If UDI is full height.
            if (this._undated_items_height == 'full') {
                return this._dragbox_height;
            }

            // If UDI is partial height.
            if (this._undated_items_height == 'partial' && (!this._is_map || !this._is_timeline)) {

                if (this._is_map) {

                    // If the map and UDI are in matching vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'map') {
                        return this._dragbox_height;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'timeline') {
                        return this._dragbox_height;
                    }

                }

                if (this._is_timeline) {

                    // If the timeline and UDI are in matching vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'timeline') {
                        return this._dragbox_height;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'map') {
                        return this._dragbox_height;
                    }

                }

            }

            // If there is neither a map nor a timeline.
            if (!this._is_timeline && !this._is_map) {
                return this._dragbox_height;
            }

            // If there is a map and a timeline.
            if (this._is_map && this._is_timeline) {

                if (this._undated_items_vertical_position == 'top') {
                    return this._top_block_height;
                }

                else {
                    return this._bottom_block_height;
                }

            }

        },

        /*
         * Calculate the width of the undated items block.
         */
        __getUndatedItemsWidth: function() {

            // If there is neither a map nor a timeline.
            if (!this._is_timeline && !this._is_map) {
                return this._dragbox_width;
            }

            // If UDI is partial height.
            if (this._undated_items_height == 'partial') {

                // If there is a map and not a timeline.
                if (this._is_map && !this._is_timeline) {

                    // If the map and UDI are in opposite vertical
                    // positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'timeline') {
                        return this._dragbox_width;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'map') {
                        return this._dragbox_width;
                    }

                }

                // If there is a timeline and not a map.
                else if (!this._is_map && this._is_timeline) {

                    // If the map and UDI are in opposite vertical
                    // positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'map') {
                        return this._dragbox_width;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'timeline') {
                        return this._dragbox_width;
                    }

                }

            }

            return this.options.undated_items_width;

        },

        /*
         * Calculate the left offset for the undated items block.
         */
        __getUndatedItemsLeftOffset: function() {

            if (this._undated_items_horizontal_position == 'left') {
                return 0;
            }

            if (!this._is_map && !this._is_timeline) {
                return 0;
            }

            if (this._undated_items_height == 'partial') {

                // If there is a map and not a timeline.
                if (this._is_map && !this._is_timeline) {

                    // If the udi and the map are in opposite vertical positions.
                    if (this._top_element == 'map' && this._undated_items_vertical_position == 'bottom') {
                        return 0;
                    }

                    if (this._top_element == 'timeline' && this._undated_items_vertical_position == 'top') {
                        return 0;
                    }

                }

                // If there is a timeline and not a map.
                if (!this._is_map && this._is_timeline) {

                    // If the udi and the timeline are in opposite vertical positions.
                    if (this._top_element == 'map' && this._undated_items_vertical_position == 'top') {
                        return 0;
                    }

                    if (this._top_element == 'timeline' && this._undated_items_vertical_position == 'bottom') {
                        return 0;
                    }

                }

            }

            return this._undated_items_left_offset;

        },

        /*
         * Calculate the top offset for the undated items block.
         */
        __getUndatedItemsTopOffset: function() {

            if (this._undated_items_height == 'partial' && this._undated_items_vertical_position == 'bottom') {

                if (this._is_map && this._top_element == 'map') {
                    return this._top_block_height;
                }

                else if (this._is_timeline && this._top_element == 'timeline') {
                    return this._top_block_height;
                }

            }

            return 0;

        },

        /*
         * Calculate the width of the map block.
         */
        __getMapWidth: function() {

            var partialWidth = this._dragbox_width - this.options.undated_items_width;

            // If UDI is present.
            if (this._is_undated_items) {

                // If UDI is full height.
                if (this._undated_items_height == 'full') {
                    return partialWidth;
                }

                // If UDI is partial height.
                else {

                    // If the map and UDI are in matching vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'map') {
                        return partialWidth;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'timeline') {
                        return partialWidth;
                    }

                }

            }

            return this._dragbox_width;

        },

        /*
         * Calculate the height of the map block.
         */
        __getMapHeight: function() {

            // If there is a timeline.
            if (this._is_timeline) {

                if (this._top_element == 'map') {
                    return this._top_block_height;
                }

                else {
                    return this._bottom_block_height;
                }

            }

            else {

                // If there is UDI.
                if (this._is_undated_items && this._undated_items_height == 'partial') {

                    // If the map and UDI are in opposite vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'timeline') {
                        return this._bottom_block_height;
                    }

                    if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'map') {
                        return this._top_block_height;
                    }

                }

            }

            return this._dragbox_height;

        },

        /*
         * Calculate the left offset for the map block.
         */
        __getMapLeftOffset: function() {

            if (this._is_undated_items && this._undated_items_horizontal_position == 'left') {

                // If UDI is full height.
                if (this._undated_items_height == 'full') {

                    return this.options.undated_items_width;

                }

                // If UDI is partial height.
                else {

                    // If the map and UDI are in matching vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'map') {
                        return this.options.undated_items_width;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'timeline') {
                        return this.options.undated_items_width;
                    }

                }

            }

            return 0;

        },

        /*
         * Calculate the top offset for the map block.
         */
        __getMapTopOffset: function() {

            // If the map is the top element.
            if (this._top_element == 'map') {
                return 0;
            }

            // If there is a timeline.
            if (this._is_timeline && this._top_element == 'timeline') {
                return this._top_block_height;
            }

            return 0;

        },

        /*
         * Calculate the width of the timeline block.
         */
        __getTimelineWidth: function() {

            var partialWidth = this._dragbox_width - this.options.undated_items_width;

            // If UDI is present.
            if (this._is_undated_items) {

                // If UDI is full height.
                if (this._undated_items_height == 'full') {
                    return partialWidth;
                }

                // If UDI is partial height.
                else {

                    // If the timeline and UDI are in matching vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'timeline') {
                        return partialWidth;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'map') {
                        return partialWidth;
                    }

                }

            }

            return this._dragbox_width;

        },

        /*
         * Calculate the height of the timeline block.
         */
        __getTimelineHeight: function() {

            // If there is a map.
            if (this._is_map) {

                if (this._top_element == 'timeline') {
                    return this._top_block_height;
                }

                else {
                    return this._bottom_block_height;
                }

            }

            else {

                // If there is UDI.
                if (this._is_undated_items && this._undated_items_height == 'partial') {

                    // If the timeline and UDI are in opposite vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'map') {
                        return this._bottom_block_height;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'timeline') {
                        return this._top_block_height;
                    }

                }

            }

            return this._dragbox_height;

        },

        /*
         * Calculate the left offset for the timeline block.
         */
        __getTimelineLeftOffset: function() {

            if (this._is_undated_items && this._undated_items_horizontal_position == 'left') {

                // If UDI is full height.
                if (this._undated_items_height == 'full') {

                    return this.options.undated_items_width;

                }

                // If UDI is partial height.
                else {

                    // If the timeline and UDI are in matching vertical positions.
                    if (this._undated_items_vertical_position == 'top' && this._top_element == 'timeline') {
                        return this.options.undated_items_width;
                    }

                    else if (this._undated_items_vertical_position == 'bottom' && this._top_element == 'map') {
                        return this.options.undated_items_width;
                    }

                }

            }

            return 0;

        },

        /*
         * Calculate the top offset for the timeline block.
         */
        __getTimelineTopOffset: function() {

            // If the timeline is the top element.
            if (this._top_element == 'timeline') {
                return 0;
            }

            // If there is a map.
            if (this._is_map && this._top_element == 'map') {
                return this._top_block_height;
            }

            return 0;

        },

        /*
         * Return the current positioning parameter loadout.
         */
        getArrangementParameters: function() {

            // Assemble an object with the position tracker variables.
            return {
                neatline_id: Neatline.id,
                is_map: this._is_map,
                is_timeline: this._is_timeline,
                is_undated_items: this._is_undated_items,
                top_element: this._top_element,
                udi_horizontal_position: this._undated_items_horizontal_position,
                udi_vertical_position: this._undated_items_vertical_position,
                udi_height: this._undated_items_height
            }

        }

    });



    $.extend({

        /*
         * Evaluate two arrays for equality.
         */
        compare: function(array1, array2) {

            if (array1 == null || array2 == null) {
                return false;
            }

            if (array1.length != array2.length) {
                return false;
            }

            var a = $.extend(true, [], array1);
            var b = $.extend(true, [], array2);

            a.sort();
            b.sort();

            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }

            return true

        }

    });


})( jQuery );
