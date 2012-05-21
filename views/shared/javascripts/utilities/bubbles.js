/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Detail bubbles.
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

    'use strict';

    $.widget('neatline.bubbles', {

        /*
         * Construct template.
         *
         * @return void.
         */
        _create: function() {
            this._body = $('body');
            this._window = $(window);
            this.template = _.template($('#bubble-template').html());
        },

        /*
         * Show bubble.
         *
         * @param {String} title: The title.
         * @param {String} body: The body.
         *
         * @return void.
         */
        show: function(title, body) {

            // Render template.
            this.bubble = $(this.template({
                title: title,
                body: body
            }));

            // Inject.
            this.element.append(this.bubble);

            // Listen for mousemove.
            this._window.bind({
                'mousemove.bubbles': _.bind(function(e) {
                    this.position(e);
                }, this)
            });

        },

        /*
         * Hide bubble.
         *
         * @return void.
         */
        hide: function() {
            this.bubble.remove();
            this._window.unbind('mousemove.bubbles');
        },

        /*
         * Position bubble.
         *
         * @param {Object} event: The mousemove event.
         *
         * @return void.
         */
        position: function(event) {

            // Get container offset.
            var offset = this.element.offset();
            var containerX = event.clientX - offset.left;
            var containerY = event.clientY - offset.top;

            // Render position.
            this.bubble.css({
                left: containerX,
                top: containerY
            });

        }

    });


})(jQuery);
