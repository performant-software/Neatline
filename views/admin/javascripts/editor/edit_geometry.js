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

            },

            // CSS constants.
            css: {

            },

            // Hexes.
            colors: {

            }

        },

        _create: function() {

            var self = this;

            // Build the buttons, insert, and gloss.
            this.reshapeButton =
                $('<button id="reshape-button" class="btn edit-geometry-small geo-edit">Reshape</button>');

            this.scaleButton =
                $('<button id="scale-button" class="btn edit-geometry-small geo-edit">Scale</button>');

            this.rotateButton =
                $('<button id="rotate-button" class="btn edit-geometry-small geo-edit">Rotate</button>');

            this.dragButton =
                $('<button id="drag-button" class="btn edit-geometry-small geo-edit">Drag</button>');

            // Insert the buttons.
            this.element.append(this.reshapeButton);
            this.element.append(this.dragButton);
            this.element.append(this.rotateButton);
            this.element.append(this.scaleButton);

            // Store starting status data trackers.
            this.reshapeButton.data('activated', false);
            this.scaleButton.data('activated', false);
            this.rotateButton.data('activated', false);
            this.dragButton.data('activated', false);

            // Gloss the drag button.
            this.dragButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.dragButton.data('activated')) {

                        // Trigger the activate event.
                        self._trigger('dragactivate');

                        // Do the color change.
                        self.dragButton.addClass('primary');

                        // Change the trackers.
                        self.dragButton.data('activated', true);
                        self._currentActivatedButton = self.dragButton;

                    }

                    // If activated, deactivate.
                    else {

                        // Trigger the deactivate event.
                        self._trigger('dragdeactivate');

                        // Do the color change.
                        self.dragButton.removeClass('primary');

                        // Change the tracker.
                        self.dragButton.data('activated', false);

                    }

                }

            });

            // Gloss the scale button.
            this.scaleButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.scaleButton.data('activated')) {

                        // Trigger the activate event.
                        self._trigger('scaleactivate');

                        // Do the color change.
                        self.scaleButton.addClass('primary');

                        // Change the trackers.
                        self.scaleButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Trigger the deactivate event.
                        self._trigger('scaledeactivate');

                        // Do the color change.
                        self.scaleButton.removeClass('primary');

                        // Change the tracker.
                        self.scaleButton.data('activated', false);

                    }

                }

            });

            // Gloss the rotate button.
            this.rotateButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.rotateButton.data('activated')) {

                        // Trigger the activate event.
                        self._trigger('rotateactivate');

                        // Do the color change.
                        self.rotateButton.addClass('primary');

                        // Change the tracker.
                        self.rotateButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Trigger the deactivate event.
                        self._trigger('rotatedeactivate');

                        // Do the color change.
                        self.rotateButton.removeClass('primary');

                        // Change the tracker.
                        self.rotateButton.data('activated', false);

                    }

                }

            });

            // Gloss the reshape button.
            this.reshapeButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.reshapeButton.data('activated')) {

                        // Trigger the activate event.
                        self._trigger('reshapeactivate');

                        // Do the color change.
                        self.reshapeButton.addClass('primary');

                        // Change the tracker.
                        self.reshapeButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Trigger the deactivate event.
                        self._trigger('reshapedeactivate');

                        // Do the color change.
                        self.reshapeButton.removeClass('primary');

                        // Change the tracker.
                        self.reshapeButton.data('activated', false);

                    }

                }

            });

        },

        showButtons: function() {

            // Display:block the buttons.
            $('.' + this.options.markup.geo_edit_class).css({
                'display': 'block !important'
            });

        },

        hideButtons: function() {

            // Display:none the buttons.
            $('.' + this.options.markup.geo_edit_class).css({
                'display': 'none !important'
            });

        }

    });


})( jQuery );

