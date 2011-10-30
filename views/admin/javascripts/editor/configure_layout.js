/*
 * Configure layout dropdown in Neatline Editor.
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

        options: {

            // Markup hooks.
            markup: {
                topbar_id: 'topbar',
                dropdown_container_id: 'configure-layout',
                layout_builder_id: 'layout-builder',
                dropdown_button_id: 'configure-layout-button'
            },

            // CSS constants.
            css: {
                offset_padding: 3
            },

            // Animation constants.
            animation: {
                duration: 400
            }

        },

        _create: function() {

            var self = this;

            // Getters.
            this._window = $(window);
            this.button = $('#' + this.options.markup.dropdown_button_id);
            this.dropdownContainer = $('#' + this.options.markup.dropdown_container_id);
            this.layoutBuilder = $('#' + this.options.markup.layout_builder_id);
            this.topbar = $('#' + this.options.markup.topbar_id);

            // Trackers.
            this._expanded = false;

            // Get positioning constants and position.
            this._getPxConstants();

            // Instantiate the layout builder.
            this.layoutBuilder.layoutbuilder();

            // Gloss the button.
            this._addButtonEvents();

            // Add resize event.
            this._window.bind('resize', function() {
                self._position();
                self._updateLayoutBuilderConstants();
            });

        },

        _addButtonEvents: function() {

            var self = this;

            this.button.bind({

                'mousedown': function() {

                    // Hide if shown.
                    if (self._expanded) {
                        self.hide();
                    }

                    // Show if hidden.
                    else {
                        self.show();
                    }

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        show: function() {

            var self = this;

            // Position.
            this._position();

            // Show and recalculate positions on the layout builder.
            this.dropdownContainer.css('display', 'block');
            this._updateLayoutBuilderConstants();

            // Animate.
            this.dropdownContainer.stop().animate({
                'top': this.topbarHeight - this.options.css.offset_padding
            }, this.options.animation.duration, function() {
                self._updateLayoutBuilderConstants();
            });

            // Update tracker.
            this._expanded = true;

        },

        hide: function() {

            var self = this;

            // Animate.
            this.dropdownContainer.stop().animate({
                'top': 0 - this.dropdownHeight - this.options.css.offset_padding
            }, this.options.animation.duration, function() {

                // Show.
                self.dropdownContainer.css('display', 'none');

            });

            // Update tracker.
            this._expanded = false;

        },

        _getPxConstants: function() {

            this.dropdownWidth = this.dropdownContainer.outerWidth();
            this.dropdownHeight = this.dropdownContainer.height();
            this.topbarHeight = this.topbar.height();
            this.buttonWidth = this.button.outerWidth();

        },

        _position: function() {

            // Get button position and dropdown width.
            var buttonOffset = this.button.offset();
            var buttonRightBoundary = buttonOffset.left + this.buttonWidth;

            // If closed.
            if (!this._expanded) {

                // Calculate the new top offset.
                var topOffset = this.dropdownHeight -
                    this.options.css.offset_padding + this.topbarHeight;

                // Position the dropdown.
                this.dropdownContainer.css({
                    'left': buttonRightBoundary - this.dropdownWidth,
                    'top': -topOffset
                });

            }

            // If expanded.
            else {

                // Calculate the new top offset.
                var topOffset = this.topbarHeight - this.options.css.offset_padding

                // Position the dropdown.
                this.dropdownContainer.css({
                    'left': buttonLeftBoundary - this.dropdownWidth,
                    'top': topOffset
                });

            }

        },

        _updateLayoutBuilderConstants: function() {

            // Recalculate the positioning parameters on the layout
            // builder dependent on display status and page position.
            this.layoutBuilder.layoutbuilder('getPxConstants');
            this.layoutBuilder.layoutbuilder('centerAllTags');

        }

    });


})( jQuery );
