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
                dropdown_container_id: 'configure-layout',
                layout_builder_id: 'layout-builder',
                dropdown_class: 'dropdown-toggle'
            },

            // Animation constants.
            animation: {

            }

        },

        _create: function() {

            // Getters.
            this.button = $('a.' + this.options.markup.dropdown_class);
            this.dropdownContainer = $('#' + this.options.markup.dropdown_container_id);
            this.layoutBuilder = $('#' + this.options.markup.layout_builder_id);

            // Trackers.
            this._expanded = false;

            // Gloss the button.
            this._addButtonEvents();

            // Instantiate the layout builder.
            this.layoutBuilder.layoutbuilder();

        },

        _addButtonEvents: function() {

            var self = this;

            this.button.bind({

                'mousedown': function() {

                    switch (self._expanded) {

                        case false:
                            self.show();
                        break;

                        case true:
                            self.hide();
                        break;

                    }

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        show: function() {

            this._expanded = !this._expanded;
            console.log('show');

        },

        hide: function() {

            this._expanded = !this._expanded;
            console.log('hide');

        }

    });


})( jQuery );
