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
                form_duration: 300
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
            this.saveButton =               this.form.find('input[type="submit"]');
            this.deleteButton =             this.form.find('#record-delete-button');
            this.title =                    this.form.find('input[name="title"]');
            this.description =              this.form.find('textarea[name="description"]');
            this.startDate =                this.form.find('input[name="start-date-date"]');
            this.startTime =                this.form.find('input[name="start-date-time"]');
            this.endDate =                  this.form.find('input[name="end-date-date"]');
            this.endTime =                  this.form.find('input[name="end-date-time"]');
            this.endTime =                  this.form.find('input[name="end-date-time"]');
            this.color =                    this.form.find('input[name="color"]');
            this.leftPercent =              this.form.find('input[name="left-ambiguity-percentage"]');
            this.rightPercent =             this.form.find('input[name="right-ambiguity-percentage"]');
            this.closeButton =              this.form.find('button[type="reset"]');
            this.saveButton =               this.form.find('input[type="submit"]');
            this.textInputs =               this.form.find('input[type="text"], textarea');
            this.fieldset =                 this.form.find('fieldset');
            this.ambiguity =                this.form.find('.date-ambiguity-container');
            this.mapFocus =                this.form.find('.map-focus');

            // Trackers.
            this._db = TAFFY();
            this.coverage = null;

            // Preparatory routines.
            this._measureForm();
            this._buildFormFunctionality();

        },

        /*
         * Build component widgets and attach event listeners.
         */
        _buildFormFunctionality: function() {

            var self = this;

            // Gradient builder.
            this.ambiguity.gradientbuilder({

                'stopHandleDrag': function(event, obj) {

                    self._trigger('ambiguityChange', {}, {
                        'itemId': obj.itemId,
                        'color': obj.color,
                        'leftPercent': obj.leftPercent,
                        'rightPercent': obj.rightPercent
                    });

                }

            });

            // Color picker.
            this.color.miniColors({

                'change': function(hex, rgb) {

                    // Trigger out, change gradient.
                    if (!self._opened) {
                        self._trigger('formEdit');
                    }

                    // Change the color.
                    self._trigger('colorEdit', {}, { 'color': hex });
                    self.ambiguity.gradientbuilder('setColor', hex);

                }

            });

            // On keydown in any of the text fields, trigger change event.
            this.textInputs.bind('keydown', function() {
                self._trigger('formEdit');
            });

            // Save button.
            this.saveButton.bind({

                'mousedown': function() {
                    self._trigger('save');
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Delete button.
            this.deleteButton.bind({

                'mousedown': function() {

                    // Only do the delete if the record is Neatline-endemic.
                    if (typeof this.itemId === 'undefined') {
                        self._postRecordDelete();
                    }

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Description text area.
            this.description.bind({

                'mouseup': function() {
                    self.resizeForm();
                }

            });

            // Map focus button.
            this.mapFocus.bind({

                'mousedown': function() {
                    self._fadeDown();
                    self._trigger('savemapfocus');
                },

                'click': function(e) {
                    e.preventDefault();
                }

            });

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
            this.itemId =                   item.attr('itemid');
            this.recordId =                 item.attr('recordid');
            this.itemTitleText =            item.find('.item-title-text');
            this.container =                this.item.next('tr').find('td');
            this.textSpan =                 this.item.find('.item-title-text');
            this.time =                     this.item.find('.time input');
            this.space =                    this.item.find('.space input');

            // Inject the form markup.
            this.container.append(this.element);

            // DOM touches.
            this._showContainer();
            this._expandTitle();
            this._getFormData();

            // If there is no item id, display the delete button.
            if (typeof this.itemId === 'undefined') {
                this._showDeleteButton();
            }

            // Otherwise, hide it.
            else {
                this._hideDeleteButton();
            }

        },

        /*
         * Collapse an item edit form and unbind all events.
         */
        hideForm: function(item, immediate) {

            // If the form is unsaved, store the changed data.
            if (this.itemTitleText.data('changed')) {

                // Grab data out of the form, try to find an existing record.
                var data = this._getData();
                var record = this._db({recordid: this.itemId});

                // Check for an existing record.
                if (record.count()) {
                    record.update({
                        recordid: this.itemId,
                        data: data
                    });
                }

                // If no record, create one.
                else {
                    this._db.insert({
                        recordid: this.itemId,
                        data: data
                    });
                }

            }

            // DOM touches.
            this._hideContainer(immediate);
            this._contractTitle();

        },

        /*
         * Get form data, get geocoverage data, build ajax request and send
         * data for save.
         */
        saveItemForm: function(coverage) {

            // Fade the form, post the data.
            this._fadeDown();
            this._postFormData(coverage);

        },

        /*
         * Expand/contract the height of an open item form. Called after a width
         * drag on the container div that might affect the wrapped height of the
         * form contents.
         */
        resizeForm: function() {

            // Re-measure the form.
            this._measureForm();

            // Animate the height.
            this.form.animate({
                'height': this._nativeHeight
            }, this.options.css.form_duration);

            // Rebuilt the gradient builder.
            this.ambiguity.gradientbuilder('refresh');

        },

        /*
         * Pop the form out of the DOM to avoid overwriting the markup when new
         * items are ajaxed into the browse list.
         */
        detachForm: function() {

            this.element.detach();

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Expand the item form.
         */
        _showContainer: function() {

            // Display the form and zero the height.
            this.container.css('display', 'table-cell');
            this.element.css('visibility', 'visible');
            this.form.css('height', 0);

            // Animate up the height.
            this.form.animate({
                'height': this._nativeHeight
            }, this.options.css.form_duration);

         },

        /*
         * Contract the item form.
         */
        _hideContainer: function(immediate) {

            var self = this;

            // Get the duration.
            var duration = immediate ? 0 : this.options.css.form_duration;

            // Animate down.
            this.form.animate({ 'height': 0 }, duration, function() {
                self.container.css('display', 'none');
            });

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
         * Shrink title size, set color depending on whether the form has been
         * saved or not.
         */
        _contractTitle: function() {

            // By default, fade to the default text color and weight.
            var textColor = this.options.colors.text;
            var textWeight = 'normal';

            // Keep the title bold red if the form was not saved.
            if (this.textSpan.data('changed')) {
                textColor = this.options.colors.red;
                textWeight = 'bold';
            }

            // Highlight the item title.
            this.textSpan.stop().animate({
                'color': textColor,
                'font-size': 12,
                'font-weight': textWeight
            }, 100);

         },

        /*
         * Drop down the opacity during data commit.
         */
        _fadeDown: function() {

            // Highlight the item title.
            this.element.animate({
                'opacity': 0.3
            }, 200);

         },

        /*
         * Push up the opacity after data commit.
         */
        _fadeUp: function() {

            // Highlight the item title.
            this.element.animate({
                'opacity': 1
            }, 200);

         },

        /*
         * Display the delete record button.
         */
        _showDeleteButton: function() {

            this.deleteButton.css('visibility', 'visible');

         },

        /*
         * Hide the delete record button.
         */
        _hideDeleteButton: function() {

            this.deleteButton.css('visibility', 'hidden');

         },

        /*
         * Push the form data into the input fields.
         */
        _applyData: function() {

            // Populate inputs.
            this.title.val(this._data.title);
            this.color.val(this._data.vector_color);
            this.leftPercent.val(this._data.left_percent);
            this.rightPercent.val(this._data.right_percent);
            this.startDate.val(this._data.start_date);
            this.startTime.val(this._data.start_time);
            this.endDate.val(this._data.end_date);
            this.endTime.val(this._data.end_time);
            this.description.val(this._data.description);

            // Reposition the draggers.
            this.ambiguity.gradientbuilder(
                'positionMarkers',
                this._data.left_percent,
                this._data.right_percent);

            // Set the gradient builder color.
            this.ambiguity.gradientbuilder(
                'setColor',
                this._data.vector_color);

            // Push the new color onto the picker. Need to set the global
            // _opened tracker to circumvent miniColors' automatic firing of
            // the change callback on value set.
            this._opened = true;
            this.color.miniColors('value', this._data.vector_color);
            this._opened = false;

         },

        /*
         * Empty out the form data.
         */
        _clearData: function() {

            // Populate inputs.
            this.title.val('');
            this.color.val('');
            this.leftPercent.val(0);
            this.rightPercent.val(100);
            this.startDate.val('');
            this.startTime.val('');
            this.endDate.val('');
            this.endTime.val('');
            this.description.val('');

            // Reposition the draggers.
            this.ambiguity.gradientbuilder('positionMarkers', 0, 100);

            // Set the gradient builder color.
            this.ambiguity.gradientbuilder('setColor', this.options.colors.purple);

            // Push the new color onto the picker. Need to set the global
            // _opened tracker to circumvent miniColors' automatic firing of
            // the change callback on value set.
            this._opened = true;
            this.color.miniColors('value', this.options.colors.purple);
            this._opened = false;

         },

        /*
         * Get form data.
         */
        _getData: function() {

            var data = {};

            // Get the form field data.
            data['title'] =                 this.title.val();
            data['left_percent'] =          parseInt(this.leftPercent.val());
            data['right_percent'] =         parseInt(this.rightPercent.val());
            data['start_date'] =            this.startDate.val();
            data['start_time'] =            this.startTime.val();
            data['end_date'] =              this.endDate.val();
            data['end_time'] =              this.endTime.val();
            data['description'] =           this.description.val();
            data['vector_color'] =          this.color.val();

            return data;

         },

        /*
         * Get form data and merge with status and coverage data.
         */
        _getDataForSave: function(coverage) {

            var data = this._getData();

            // Merge the status and coverage data.
            data['item_id'] =               parseInt(this.itemId);
            data['record_id'] =             parseInt(this.recordId);
            data['neatline_id'] =           Neatline.id;
            data['space_active'] =          this.space.prop('checked').toString();
            data['time_active'] =           this.time.prop('checked').toString();
            data['geocoverage'] =           coverage;

            return data;

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

            // First, check for unsaved data.
            var unsavedData = this._db({recordid: this.itemId}).first();

            // If there is unsaved data, reapply it.
            if (unsavedData) {
                this._data = unsavedData.data;
                this._applyData();
            }

            // Otherwise, hit the server for data.
            else {

                $.ajax({

                    url: 'form',
                    dataType: 'json',

                    data: {
                        item_id: this.itemId,
                        record_id: this.recordId,
                        neatline_id: Neatline.id,
                    },

                    success: function(data) {

                        // Push the data into the form.
                        self._data = data;
                        self._applyData();

                    }

                });

            }

        },

        /*
         * Save form data.
         */
        _postFormData: function(coverage) {

            var self = this;

            // Get the data.
            var data = this._getDataForSave(coverage);

            // Commit.
            $.ajax({

                url: 'save',
                dataType: 'json',
                type: 'POST',
                data: data,

                success: function(data) {

                    // Fade up and trigger out.
                    self._fadeUp();
                    self._trigger('savecomplete');

                    // Update space tracker.
                    if (data.space) {
                        self._trigger('spaceactive');
                    }

                    // Update time tracker.
                    if (data.time) {
                        self._trigger('timeactive');
                    }

                }

            });

        },

        /*
         * Save item-specific map focus.
         */
        postMapFocus: function(extent, zoom) {

            var self = this;

            // Commit.
            $.ajax({

                url: 'focus',
                type: 'POST',
                data: {
                    item_id: this.itemId,
                    record_id: this.recordId,
                    neatline_id: Neatline.id,
                    extent: extent,
                    zoom: zoom
                },

                success: function() {

                    // Fade up.
                    self._fadeUp();

                }

            });

        },

        /*
         * Delete a Neatline endemic record.
         */
        _postRecordDelete: function() {

            var self = this;

            // Commit.
            $.ajax({

                url: 'delete',
                type: 'POST',
                data: {
                    record_id: this.recordId,
                },

                success: function() {

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

            this._nativeHeight = this.fieldset[0].scrollHeight;

         }

    });

})( jQuery );
