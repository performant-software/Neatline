/*
 * Worker class to build and apply the color and opacity gradient on a
 * timeline time interval span. Used by the editor to render changes on
 * the "Date Ambiguity" builder block and to apply the settings on the
 * public-facing timeline.
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


    $.widget('neatline.spanstyler', {

        options: {

            // Markup hooks.
            markup: {

            }

        },

        /*
         * Build the css.
         */
        constructCss: function(color, leftPercent, rightPercent) {

            // Build the rgba strings.
            var rgb = this.__hexToRgb(color);
            var fullOpacity = this.__rgbObjectToCssValue(rgb, 1);
            var zeroOpacity = this.__rgbObjectToCssValue(rgb, 0);

            this.css = ' \
                background: #2989d8; \
                background: -moz-linear-gradient(left,  ' + zeroOpacity + ' 0%, ' + fullOpacity + ' ' + leftPercent + '%, ' + fullOpacity + ' ' + rightPercent + '%,' + zeroOpacity + ' 99%); \
                background: -webkit-gradient(linear, left top, right top, color-stop(0%,' + zeroOpacity + '), color-stop(' + leftPercent + '%,' + fullOpacity + '), color-stop(' + rightPercent + '%,' + fullOpacity + '), color-stop(100%,' + zeroOpacity + ')); \
                background: -webkit-linear-gradient(left, ' + zeroOpacity + ' 0%, ' + fullOpacity + ' ' + leftPercent + '%, ' + fullOpacity + ' ' + rightPercent + '%,' + zeroOpacity + ' 99%); \
                background: -o-linear-gradient(left,  ' + zeroOpacity + ' 0%, ' + fullOpacity + ' ' + leftPercent + '%, ' + fullOpacity + ' ' + rightPercent + '%,' + zeroOpacity + ' 99%); \
                background: -ms-linear-gradient(left,  ' + zeroOpacity + ' 0%, ' + fullOpacity + ' ' + leftPercent + '%, ' + fullOpacity + ' ' + rightPercent + '%,' + zeroOpacity + ' 99%); \
                background: linear-gradient(left, ' + zeroOpacity + ' 0%, ' + fullOpacity + ' ' + leftPercent + '%, ' + fullOpacity + ' ' + rightPercent + '%,' + zeroOpacity + ' 99%); \
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#1e5799", endColorstr="#2989d8",GradientType=0 );';

        },

        /*
         * Apply the new style to the editor block and trigger out with
         * the new value.
         */
        applyCss: function() {

            // Push the new style onto the editor block.
            this.element.attr('style', this.css);

        },

        /*
         * Convert hex to rbg array.
         */
        __hexToRgb: function(hex) {

            if (hex[0] == '#') {
                hex = hex.slice(1);
            }

            var r = parseInt(hex.substring(0,2), 16);
            var g = parseInt(hex.substring(2,4), 16);
            var b = parseInt(hex.substring(4,6), 16);

            return {
                'red': r,
                'green': g,
                'blue': b
            };

        },

        /*
         * Convert rbg array to valid css value.
         */
        __rgbObjectToCssValue: function(rgb, alpha) {

            return 'rgba(' + rgb.red + ', ' + rgb.green + ', ' + rgb.blue + ', ' + alpha + ')';

        }

    });


})( jQuery );
