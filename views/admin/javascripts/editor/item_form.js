/*
 * Manager class for the dropdown item edit forms in the Neatline editor.
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


    $.widget('neatline.itemform', {

        options: {

            // CSS constants.
            css: {

            },

            // Hexes.
            colors: {
                light_blue: '#f3f6ff',
                light_yellow: '#fffef8',
                dark_purple: '#4f1d6a',
                purple: '#724e85',
                text: '#515151',
                gray: '#8d8d8d',
                red: '#ca3c3c',
                orange: '#ffda82'
            }

        },

        /*
         * Get and measure markup.
         */
        _create: function() {

            // Getters.
            this.form =                     this.element.find('form');
            this.cancelButton =             this.form.find('button[type="reset"]');
            this.saveButton =               this.form.find('input[type="submit"]');
            this.title =                    this.form.find('input[name="title"]');
            this.description =              this.form.find('textarea[name="description"]');
            this.startDate =                this.form.find('input[name="start-date-date"]');
            this.startTime =                this.form.find('input[name="start-date-time"]');
            this.endDate =                  this.form.find('input[name="end-date-date"]');
            this.endTime =                  this.form.find('input[name="end-date-time"]');

            // Measure the native height of the form.
            this._measureForm();

        },


        /*
         * =================
         * Public methods.
         * =================
         */


        /*
         * Expand and gloss an item edit form.
         */
        showForm: function(item, scrollMap, scrollTimeline, focusItems) {

            // Getters and setters.
            this.item =                     item;
            this.container =                this.item.next('tr').find('td');
            this.textSpan =                 this.item.find('.item-title-text');

            // Inject the form markup.
            this.container.append(this.element);

            // DOM touches.
            this._getFormData();
            this._showContainer();
            this._expandTitle();
            this._addFormEvents();

        },

        /*
         * Collapse an item edit form and unbind all events.
         */
        hideForm: function(item, immediate) {

            console.log('hide');

        },

        /*
         * Pluck data from form, get geocoverage data, build ajax request and
         * send data for save.
         */
        saveItemForm: function() {

            console.log('save');

        },

        /*
         * Expand/contract the height of an open item form. Called after a width
         * drag on the container div that might affect the wrapped height of the
         * form contents.
         */
        resizeForm: function() {

            console.log('resize');

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


         _showContainer: function() {

            // Display the form and zero the height.
            this.container.css('display', 'table-cell');
            this.element.css('visibility', 'visible');
            this.form.css('height', 0);

            // Animate up the height.
            this.form.animate({
                'height': this._nativeHeight
            }, 300);

         },

        /*
         * Grow title size, set color depending on whether the form has been
         * saved or not.
         */
         _expandTitle: function() {

            // By default, fade to the default text color and weight.
            var textColor = this.options.colors.dark_purple;

            // Keep the title bold red if the form was not saved.
            if (this.textSpan.data('changed')) {
                textColor = this.options.colors.red;
            }

            // Highlight the item title.
            this.textSpan.stop().animate({
                'color': textColor,
                'font-size': 14,
                'font-weight': 'bold'
            }, 100);

         },

        /*
         * Push the form data into the input fields.
         */
         _applyData: function(data) {

            this.title.attr('value', data.title);
            this.description.text(data.description);

         },

         _addFormEvents: function() {

         },


        /*
         * =================
         * Ajax calls.
         * =================
         */


        /*
         * Get data to populate the form.
         */
        _getFormData: function() {

            var self = this;

            $.ajax({

                url: 'form',
                dataType: 'json',

                data: {
                    item_id: this.item.attr('recordid'),
                    neatline_id: Neatline.id
                },

                success: function(data) {

                    // Push the data into the form.
                    self._applyData(data);

                }

            });

        },


        /*
         * =================
         * Utilities.
         * =================
         */

        /*
         * Get the native height of the form.
         */
         _measureForm: function() {

            this._nativeHeight = this.form.height();

         }

    });

})( jQuery );
