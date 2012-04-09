/**
 * Worker class that durably positions a div to fill the entire screen.
 * Used by the public isntantiations of Neatline.
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

    $.widget('neatline.fullscreenpositioner', {

        options: {

            // Markup hooks.
            markup: {
                topbar: '#topbar'
            }

        },

        /*
         * Measure window, position, and listen for resizes.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.topbar =                   $(this.options.markup.topbar);

            // Measure the window, listen for resize, position.
            this._measureWindow();
            this._listenForResize();
            this._position();

        },

        /*
         * Register the window size.
         */
        _measureWindow: function() {

            // Measure window and topbar.
            this._windowHeight =            this._window.height();
            this._windowWidth =             this._window.width();
            this._topbarHeight =            this.topbar.height();

        },

        /*
         * On window resize, reposition.
         */
        _listenForResize: function() {

            var self = this;

            this._window.bind({

                'resize': function() {

                    // Do the resize.
                    self._measureWindow();
                    self._position();

                    // Trigger out.
                    self._trigger('resize');

                }

            });

        },

        /*
         * Fill window.
         */
        _position: function() {

            this.element.css({
                'height': this._windowHeight - this._topbarHeight,
                'width': this._windowWidth,
                'top': this._topbarHeight
            });

        }

    });

})( jQuery );

