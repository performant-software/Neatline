/**
 * Worker class that provides basic dropdown functionality for configuration
 * menus across the top bar of the editor.
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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {


    $.widget('neatline.nlDropdown', {

        options: {

            // Markup hooks.
            markup: {
                content: 'div.dropdown-content',
                topbar: '#topbar'
            },

            // CSS constants.
            css: {
                duration: 400
            },

            // These are a set of dropdowns which together act like a set of
            // radiobuttons, hence the name.
            radios: []

        },

        /*
         * Get and prepare markup, run start-up routine.
         */
        _create: function() {

            // Getters.
            this._body =            $('body');
            this._window =          $(window);
            this.topbar =           $(this.options.markup.topbar);
            this.radios =           this.options.radios;

            // Get, detach, and re-append the content div.
            this.content = this.element.next(this.options.markup.content);
            this.content.detach();
            $('body').append(this.content);

            // Trackers.
            this._expanded = false;

            // Start-up.
            this._measure();
            this._addEvents();

        },

        /*
         * Measure markup.
         */
        _measure: function() {

            this.contentWidth =     this.content.width();
            this.contentHeight =    this.content.height();
            this.topbarHeight =     this.topbar.height();
            this.buttonWidth =      this.element.width();

        },

        /*
         * Measure markup offsets.
         */
        _getOffsets: function() {

            this.buttonOffset = this.element.offset();
            this.topbarHeight = this.topbar.height();

        },

        /*
         * Listen for mousedown and click on the dropdown tab, resize on window.
         */
        _addEvents: function() {

            var self = this;

            // Listen for mousedown, suppress click.
            this.element.bind({

                'mousedown': function() {

                    if (self._expanded) { self.hide(); }
                    else { self.show(); }

                },

                'click': function(e) {
                    e.preventDefault();
                }

            });

            // Listen for resize on window.
            this._window.bind('resize', function() {
                self.position();
                self._trigger('resize');
            });

        },

        /*
         * Set the sibling radio dropdowns.
         */
        setRadioDropdowns: function(rs) {
            this.radios = rs;
        },

        /*
         * Position the dropdown relative to the button.
         */
        position: function() {
            var topOffset;

            // Update offsets.
            this._getOffsets();

            // If hidden.
            if (!this._expanded) {

                // Calculate the new top offset.
                topOffset = this.contentHeight - this.topbarHeight;

                // Manifest new position.
                this.content.css({
                    'left': Math.max(0, this.buttonOffset.left + this.buttonWidth - this.contentWidth),
                    'top': -(topOffset)
                });

            }

            // If visible.
            else {

                // Calculate the new top offset.
                topOffset = this.topbarHeight;

                // Manifest new position.
                this.content.css({
                    'left': Math.max(0, this.buttonOffset.left + this.buttonWidth - this.contentWidth),
                    'top': topOffset
                });

            }

        },

        /*
         * Display the dropdown.
         */
        show: function() {

            if (_.isArray(this.radios) && this.radios.length > 0) {
                var showing = _.filter(this.radios, function(d) {
                    return d._expanded;
                });
                var cont = this._createRadioSetHideCont(showing, showing.length, 0);
                cont();
            } else {
                this._show();
            }

        },

        /*
         * This creates a continuation callback that hides a radio set sibling
         * or, if it's already hidden all of them, shows this dropdown.
         */
        _createRadioSetHideCont: function(showing, stop, i) {

            var self = this;

            return function() {
                var next = i + 1;
                if (i >= stop) {
                    self._show();
                } else {
                    showing[i].hide(self._createRadioSetHideCont(showing, stop, next));
                }
            };

        },

        /*
         * This actually shows this dropdown, without hiding the radio set
         * siblings.
         */
        _show: function() {

            var self = this;

            // Position and display.
            this.position();
            this.content.css('display', 'block');
            this._trigger('showstart');

            // Animate down.
            this.content.stop().animate({
                'top': this.topbarHeight
            }, this.options.css.duration, function() {
                self._trigger('show');
            });

            // Add class to button.
            this.element.addClass('open');

            this._expanded = true;

        },

        /*
         * Hide the dropdown.
         */
        hide: function(continuation) {

            var self = this;

            // Animate up.
            this.content.stop().animate({
                'top': -(this.contentHeight)
            }, this.options.css.duration, function() {
                self.content.css('display', 'none');
                self._trigger('hide');
                if (_.isFunction(continuation)) {
                    continuation();
                }
            });

            // Add class to button.
            this.element.removeClass('open');

            this._expanded = false;

        }

    });


})( jQuery );
