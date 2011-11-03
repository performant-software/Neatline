/*
 * Gradient builder application for item edit forms.
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


    $.widget('neatline.gradientbuilder', {

        options: {

            // Markup hooks.
            markup: {
                editor_class: 'date-ambiguity-editor',
                color_swatch_class: 'color-swatch',
                left_marker_class: 'stop-marker.left',
                right_marker_class: 'stop-marker.right'
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

        /*
         * Get markup, position the stop markers.
         */
        _create: function() {

            // Getters.
            this.editor = this.element.find('.' + this.options.markup.editor_class);
            this.leftMarker = this.element.find('.' + this.options.markup.left_marker_class);
            this.rightMarker = this.element.find('.' + this.options.markup.right_marker_class);
            this.swatches = this.element.find('.' + this.options.markup.color_swatch_class)

            // Position the stop markers.
            this.positionMarkers(0, 100);

        },

        /*
         * Get the size of the editor block.
         */
        _getDimensions: function(leftPercentage, rightPercentage) {

            this.editorWidth = this.editor.width();
            this.editorHeight = this.editor.height();

        },

        /*
         * Set the starting positions of the markers. The percentage
         * parameters define the distance of the left and right markers
         * from the left boundary of the editor block as a percentage
         * of the total width.
         */
        positionMarkers: function(leftPercentage, rightPercentage) {


        },

        /*
         * Set the base color of the editor block and the swatches.
         */
        setColor: function(color) {

            this.editor.css('background', color);
            this.swatches.css('background', color);

        }

    });


})( jQuery );
