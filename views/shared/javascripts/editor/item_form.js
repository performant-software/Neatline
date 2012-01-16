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
                default_text_size: 14,
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
            },

            // CLEditor.
            cleditor: {
                width: 340,
                height: 200,
                controls:
                    "bold italic underline | font size " +
                    "| color removeformat | bullets numbering | outdent " +
                    "indent | alignleft center alignright justify | " +
                    "rule image link unlink | source"
            },

            // Default fieldset statuses.
            fieldsets: {
                title_and_description: true,
                date: true,
                date_styles: true,
                map_styles: true
            }

        },

        /*
         * Get and measure markup.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
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
            this.vectorColor =              this.form.find('input[name="vector-color"]');
            this.strokeColor =              this.form.find('input[name="stroke-color"]');
            this.vectorOpacity =            this.form.find('input[name="vector-opacity"]');
            this.strokeOpacity =            this.form.find('input[name="stroke-opacity"]');
            this.strokeWidth =              this.form.find('input[name="stroke-width"]');
            this.pointRadius =              this.form.find('input[name="point-radius"]');
            this.leftPercent =              this.form.find('input[name="left-ambiguity-percentage"]');
            this.rightPercent =             this.form.find('input[name="right-ambiguity-percentage"]');
            this.closeButton =              this.form.find('button[type="reset"]');
            this.saveButton =               this.form.find('input[type="submit"]');
            this.textInputs =               this.form.find('input[type="text"], textarea');
            this.fieldset =                 this.form.find('fieldset');
            this.actions =                  this.form.find('#edit-form-actions');
            this.inputs =                   this.form.find('#edit-form-inputs');
            this.ambiguity =                this.form.find('.date-ambiguity-container');
            this.mapFocus =                 this.form.find('.map-focus');
            this.resetStyles =              this.form.find('.reset-styles');
            this.titleDescriptionFieldset = this.form.find('a.fieldset.title-and-description');
            this.dateInformationFieldset =  this.form.find('a.fieldset.date-information');
            this.dateStylesFieldset =       this.form.find('a.fieldset.date-styles');
            this.mapStylesFieldset =        this.form.find('a.fieldset.map-styles');

            // Trackers.
            this._db =                      TAFFY();
            this._isForm =                  false;
            this.coverage =                 null;

            // Preparatory routines.
            this._buildFormFunctionality();
            this._buildFieldsets();
            this._measureForm();

        },

        /*
         * Build component widgets and attach event listeners.
         */
        _buildFormFunctionality: function() {

            var self = this;

            // ** DESCRIPTION.

            // Construct CLEditor.
            this.rte = this.description.cleditor(
                this.options.cleditor
            )[0];

            // ** DATE AMBIGUITY.
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

            // ** SHAPE COLOR.
            this.vectorColor.miniColors({

                change: function(hex, rgb) {

                    // Trigger out, change gradient.
                    if (!self._opened) {
                        self._trigger('formEdit');
                    }

                    // Change the color.
                    self._trigger('vectorColorEdit', {}, { 'color': hex });
                    self.ambiguity.gradientbuilder('setColor', hex);

                }

            });

            // ** LINE COLOR.
            this.strokeColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('strokeColorEdit', {}, { 'color': hex });
                }

            });

            // ** SHAPE OPACITY.
            this.vectorOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('vectorOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** LINE OPACITY.
            this.strokeOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('strokeOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** LINE THICKNESS.
            this.strokeWidth.integerdragger({
                min: 0,
                def: 1,
                px_per_unit: 8,
                change: function(evt, obj) {
                    self._trigger('strokeWidthEdit', {}, { 'value': obj.value });
                }
            });

            // ** POINT RADIUS.
            this.pointRadius.integerdragger({
                min: 1,
                def: 6,
                px_per_unit: 8,
                change: function(evt, obj) {
                    self._trigger('pointRadiusEdit', {}, { 'value': obj.value });
                }
            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': function() {
                    self._trigger('save');
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // ** DELETE.
            this.deleteButton.bind({

                'mousedown': function() {

                    // Only do the delete if the record is Neatline-endemic.
                    if (typeof this.itemId === 'undefined') {
                        self._fadeDown();
                        self._postRecordDelete();
                    }

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // ** FIX ITEM-SPECIFIC MAP FOCUS
            this.mapFocus.bind({

                'mousedown': function() {
                    self._fadeDown();
                    self._trigger('savemapfocus');
                },

                'click': function(e) {
                    e.preventDefault();
                }

            });

            // ** RESET ITEM STYLES
            this.resetStyles.bind({

                'mousedown': function() {
                    self._fadeDown();
                    self._postResetStyles();
                },

                'click': function(e) {
                    e.preventDefault();
                }

            });

            // On keydown in any of the text fields, trigger change event.
            this.textInputs.bind('keydown', function() {
                self._trigger('formEdit');
            });

        },

        /*
         * Instantiate the fieldset expanders.
         */
        _buildFieldsets: function() {

            var self = this;

            // Title and description.
            this.titleDescriptionFieldset.fieldsetexpander({
                'change': function() {
                    // self.resizeForm();
                }
            });

            // Date information.
            this.dateInformationFieldset.fieldsetexpander({
                'change': function() {
                    // self.resizeForm();
                }
            });

            // Date styles.
            this.dateStylesFieldset.fieldsetexpander({
                default_status: false,
                'change': function() {
                    // self.resizeForm();
                }
            });

            // Map styles.
            this.mapStylesFieldset.fieldsetexpander({
                default_status: false,
                'change': function() {
                    // self.resizeForm();
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
            if (this.itemId == '') {
                this._showDeleteButton();
            }

            // Otherwise, hide it.
            else {
                this._hideDeleteButton();
            }

            // Update the tracker.
            this._isForm = true;

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

            // Update the tracker.
            this._isForm = false;

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

            // If the date styles fieldset is visible, Rebuilt the gradient builder.
            if (this.dateStylesFieldset.fieldsetexpander('isExpanded')) {
                this.ambiguity.gradientbuilder('refresh');
            }

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

            var self = this;

            // Display the form and zero the height.
            this.form.css('height', 0);
            this.container.css('display', 'table-cell');
            this.element.css('visibility', 'visible');

            // Animate up the height.
            this.form.animate({
                'height': this._nativeHeight
            }, this.options.css.form_duration, function() {
                self.form.css('height', 'auto');
            });

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
                'font-size': this.options.css.default_text_size,
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
         * If the record is Neatline-endemic and has a non-empty title, push
         * on the title to the title text span.
         */
        _updateTitleText: function() {

            if (this.itemId == '' && this.title.val() != '') {
                this._trigger('settitle', {}, { 'text': this.title.val() });
            }

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
            this.vectorColor.val(this._data.vector_color);
            this.vectorOpacity.val(this._data.vector_opacity);
            this.strokeColor.val(this._data.stroke_color);
            this.strokeOpacity.val(this._data.stroke_opacity);
            this.strokeWidth.val(this._data.stroke_width);
            this.pointRadius.val(this._data.point_radius);
            this.leftPercent.val(this._data.left_percent);
            this.rightPercent.val(this._data.right_percent);
            this.startDate.val(this._data.start_date);
            this.startTime.val(this._data.start_time);
            this.endDate.val(this._data.end_date);
            this.endTime.val(this._data.end_time);

            // Update CLEditor.
            this.description.val(this._data.description);
            this.rte.updateFrame().refresh();

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
            this.vectorColor.miniColors('value', this._data.vector_color);
            this.strokeColor.miniColors('value', this._data.stroke_color);
            this._opened = false;

         },

        /*
         * Empty out the form data.
         */
        _clearData: function() {

            // Populate inputs.
            this.title.val('');
            this.vectorColor.val('');
            this.leftPercent.val(0);
            this.rightPercent.val(100);
            this.startDate.val('');
            this.startTime.val('');
            this.endDate.val('');
            this.endTime.val('');
            this.description.val('');
            this.rte.updateFrame();

            // Reposition the draggers.
            this.ambiguity.gradientbuilder('positionMarkers', 0, 100);

            // Set the gradient builder color.
            this.ambiguity.gradientbuilder('setColor', this.options.colors.purple);

            // Push the new color onto the picker. Need to set the global
            // _opened tracker to circumvent miniColors' automatic firing of
            // the change callback on value set.
            this._opened = true;
            this.vectorColor.miniColors('value', this.options.colors.purple);
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
            data['vector_color'] =          this.vectorColor.val();
            data['vector_opacity'] =        parseInt(this.vectorOpacity.val());
            data['stroke_color'] =          this.strokeColor.val();
            data['stroke_opacity'] =        parseInt(this.strokeOpacity.val());
            data['stroke_width'] =          parseInt(this.strokeWidth.val());
            data['point_radius'] =          parseInt(this.pointRadius.val());

            // Get the content of the text editor.
            data['description'] =           this._getCLEditorContent();

            return data;

         },

        /*
         * Get form data and merge with status and coverage data.
         */
        _getDataForSave: function(coverage) {

            // Build the base form data.
            var data = this._getData();

            // Merge the status and coverage data.
            data['item_id'] =               this.itemId;
            data['record_id'] =             this.recordId;
            data['exhibit_id'] =            Neatline.id;
            data['space_active'] =          this.space.prop('checked').toString();
            data['time_active'] =           this.time.prop('checked').toString();
            data['geocoverage'] =           coverage;

            return data;

         },

        /*
         * Get the <body> content out of cleditor.
         */
        _getCLEditorContent: function(coverage) {
            return this.description.next('iframe').contents().find('body').html();
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

                    url: 'ajax/form',
                    dataType: 'json',

                    data: {
                        item_id: this.itemId,
                        record_id: this.recordId,
                        exhibit_id: Neatline.id,
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

                url: 'ajax/save',
                dataType: 'json',
                type: 'POST',
                data: data,

                success: function(data) {

                    // Fade up and trigger out.
                    self._fadeUp();
                    self._trigger('savecomplete');

                    // Update space tracker.
                    if (data.statuses.space) {
                        self._trigger('spaceactive');
                    }

                    // Update time tracker.
                    if (data.statuses.time) {
                        self._trigger('timeactive');
                    }

                    // Manifest the recordid on the item row.
                    self._trigger('updatedid', {}, {
                        'recordid': data.recordid
                    });

                    // Update the title text, if necessary.
                    self._updateTitleText();

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

                url: 'ajax/focus',
                type: 'POST',
                data: {
                    item_id: this.itemId,
                    record_id: this.recordId,
                    exhibit_id: Neatline.id,
                    extent: extent,
                    zoom: zoom
                },

                success: function() {

                    // Fade up, reload the map.
                    self._fadeUp();
                    self._trigger('spaceactive');
                    self._trigger('savecomplete');

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

                url: 'ajax/delete',
                type: 'POST',
                data: {
                    exhibit_id: Neatline.id,
                    record_id: this.recordId
                },

                success: function() {
                    self._fadeUp();
                    self._trigger('reload');
                }

            });

        },

        /*
         * Reset record-specific styles.
         */
        _postResetStyles: function() {

            var self = this;

            // Commit.
            $.ajax({

                url: 'ajax/resetstyles',
                type: 'POST',
                data: {
                    exhibit_id: Neatline.id,
                    record_id: this.recordId
                },

                success: function() {
                    self._fadeUp();
                    self._trigger('savecomplete');
                    self._getFormData();
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
            this._nativeHeight = this.actions.position().top +
                this.actions.height();
         },

        /*
         * Emit the current edit item recordid.
         */
        getCurrentEditId: function() {
            return this._isForm ? this.recordId : false;
        },

        /*
         * Emit a protected class attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });

})( jQuery );
