/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Controls the slug auto-generation/recommendation in the /add view.
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
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2012 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {


    $.widget('neatlinewebservice.slugBuilder', {

        options: {

            // The base for the URL previews.
            web_root: '',

            colors: {
                light_gray: '#a3a3a3',
                dark_gray: '#3a3a3a'
            }

        },

        /*
         * .
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this._body =        $('body');
            this._window =      $(window);
            this.title =        $('input[name="name"]');
            this.slug =         $('input[name="slug"]');

            // Trackers.
            this._hasTyped = false;

            // Bind listeners, set starting styles and root.
            this.setSlugInputToGray();
            this._addEvents();

        },

        /*
         * Bind listeners to the inputs.
         *
         * - return void.
         */
        _addEvents: function() {

            var self = this;

            this.title.bind({

                'keyup': function() {
                    if (!self._hasTyped) {
                        var slug = self.slugify(self.title.val())
                        self.slug.val(slug);
                    }
                }

            });

            this.slug.bind({

                // Before a keystroke.
                'keydown': function(e) {

                    // Replace spaces with '-'.
                    if (e.keyCode == 32) {

                        e.preventDefault();

                        var val = self.slug.val();
                        self.slug.val(val + '-');
                        self.slug.trigger('keyup');

                    }

                },

                // After a keystroke.
                'keyup': function(e) {

                    // Render the change.
                    var slug = self.slugify(self.slug.val())

                    // If first keystroke, fade up.
                    if (!self._hasTyped) {
                        self.fadeUpSlugInput();
                    }

                    // Set tracker.
                    self._hasTyped = true;

                }

            });

        },

        /*
         * Convert string into slug. Remove trim, remove extra spaces,
         * and replace spaces with '-'.
         *
         * - param string text:     The text to convert.
         *
         * - return string slug:    The slug.
         */
        slugify: function(value) {
            return $.trim(value).
                replace(/\s+/g, '-').
                replace(/(&nbsp;)+/g, '-').
                replace(/[^\w+-]+/g, '').
                toLowerCase();
        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Fade up the slug input to indicate that it is not tied to the
         * title input anymore.
         *
         * - return void.
         */
        fadeUpSlugInput: function() {
            this.slug.animate({
                color: this.options.colors.dark_gray
            }, 200);
        },

        /*
         * Set slug color to light gray.
         *
         * - return void.
         */
        setSlugInputToGray: function() {
            this.slug.css('color', this.options.colors.light_gray);
        },


        /*
         * =================
         * Attribute emitter.
         * =================
         */


        /*
         * Emit a widget attribute.
         *
         * - param string attr:     The name of the attribute.
         *
         * - return mixed:          The attribute value.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });


})( jQuery );
