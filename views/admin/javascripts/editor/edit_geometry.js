/*
 * Geometry editor widget that appears at the top right corner of the
 * map during an item edit in the Neatline editor.
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


    $.widget('neatline.editgeometry', {

        options: {

            // Markup hooks.
            markup: {
                geo_edit_class: 'geo-edit'
            },

            // Animation constants.
            animation: {
                fade_duration: 500
            }

        },

        _create: function() {

            var self = this;

            // Build the buttons, insert, and gloss.
            this.scaleButton =
                $('<button id="scale-button" class="btn edit-geometry-small geo-edit">Scale</button>');

            this.rotateButton =
                $('<button id="rotate-button" class="btn edit-geometry-small geo-edit">Rotate</button>');

            this.dragButton =
                $('<button id="drag-button" class="btn edit-geometry-small geo-edit">Drag</button>');

            this.deleteButton =
                $('<button id="delete-button" class="btn danger edit-geometry-small geo-edit">Delete</button>');

            // Insert the buttons.
            this.element.append(this.dragButton);
            this.element.append(this.rotateButton);
            this.element.append(this.scaleButton);
            this.element.append(this.deleteButton);

            // Store starting status data trackers.
            this.scaleButton.data('activated', false);
            this.rotateButton.data('activated', false);
            this.dragButton.data('activated', false);

            // Gloss the drag button.
            this.dragButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.dragButton.data('activated')) {

                        // Do the color change.
                        self.dragButton.addClass('primary');

                        // Change the trackers.
                        self.dragButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Do the color change.
                        self.dragButton.removeClass('primary');

                        // Change the tracker.
                        self.dragButton.data('activated', false);

                    }

                    // Fire out the update event.
                    self._trigger('update', {}, {
                        'drag': self.dragButton.data('activated'),
                        'rotate': self.rotateButton.data('activated'),
                        'scale': self.scaleButton.data('activated')
                    });

                }

            });

            // Gloss the scale button.
            this.scaleButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.scaleButton.data('activated')) {

                        // Do the color change.
                        self.scaleButton.addClass('primary');

                        // Change the trackers.
                        self.scaleButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Do the color change.
                        self.scaleButton.removeClass('primary');

                        // Change the tracker.
                        self.scaleButton.data('activated', false);

                    }

                    // Fire out the update event.
                    self._trigger('update', {}, {
                        'drag': self.dragButton.data('activated'),
                        'rotate': self.rotateButton.data('activated'),
                        'scale': self.scaleButton.data('activated')
                    });

                }

            });

            // Gloss the rotate button.
            this.rotateButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.rotateButton.data('activated')) {

                        // Do the color change.
                        self.rotateButton.addClass('primary');

                        // Change the tracker.
                        self.rotateButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Do the color change.
                        self.rotateButton.removeClass('primary');

                        // Change the tracker.
                        self.rotateButton.data('activated', false);

                    }

                    // Fire out the update event.
                    self._trigger('update', {}, {
                        'drag': self.dragButton.data('activated'),
                        'rotate': self.rotateButton.data('activated'),
                        'scale': self.scaleButton.data('activated')
                    });

                }

            });

            // Gloss the delete button.
            this.deleteButton.bind({

                // Fire out the delete event.
                'mousedown': function() {
                    self._trigger('delete');
                }

            });

        },

        showButtons: function() {

            // Display:block the buttons.
            $('.' + this.options.markup.geo_edit_class).css({
                'display': 'block !important',
                'opacity': 0
            }).stop().animate({ 'opacity': 1}, this.options.animation.fade_duration);

            // By default, deactivate all buttons.
            this.deactivateAllButtons();

        },

        hideButtons: function() {

            // Get the buttons.
            var buttons = $('.' + this.options.markup.geo_edit_class);

            // Fade down.
            buttons.stop().animate({
                'opacity': 0
            }, this.options.markup.fade_duration, function() {
                buttons.css('display', 'none !important');
            });

        },

        deactivateAllButtons: function() {

            // Drag.
            this.dragButton.removeClass('primary');
            this.dragButton.data('activated', false);

            // Scale.
            this.scaleButton.removeClass('primary');
            this.scaleButton.data('activated', false);

            // Rotate.
            this.rotateButton.removeClass('primary');
            this.rotateButton.data('activated', false);

        }

    });


})( jQuery );

