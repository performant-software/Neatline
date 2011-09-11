/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Custom toggle button widget.
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

    $.widget('neatline.togglebutton', {

        options: {
            enabled_by_default: true,
            pressed_by_default: false,
            visible_by_default: true,
            highlight_border_color: '#6393ff',
            pressed_border_color: '#6393ff',
            pressed_text_color: '#517fe6'
        },

        _create: function() {

            // Add the new class, set status variable, add events.
            this.element.addClass('neatline-toggle-button');
            this.pressed = false;
            this._addEvents();

            if (this.options.pressed_by_default) {
                this.press();
            }

            if (!this.options.visible_by_default) {
                this.element.css('display', 'none');
            }

            if (!this.options.enabled_by_default) {
                this.disable();
            }

        },

        _addEvents: function() {

            this.element.bind({
                'mouseenter mouseleave': $.proxy(this._highlight, this),
                'mousedown': $.proxy(this.press, this)
            });

        },

        press: function() {

            this.element.toggleClass('neatline-pressed');

            if (this.pressed) {
                this._trigger('unpress');
                this.pressed = false;
            } else {
                this._trigger('press');
                this.pressed = true;
            }

        },

        disable: function() {

        },

        _highlight: function() {

            this.element.toggleClass('neatline-highlighted');

        },

        _destroy: function() {
            // do teardown.
        }

    });

})( jQuery );
