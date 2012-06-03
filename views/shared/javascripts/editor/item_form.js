/**
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

                description: {
                    width: 340,
                    height: 300,
                    controls:
                        "bold italic underline | font size " +
                        "| color removeformat | bullets numbering | outdent " +
                        "indent | alignleft center alignright justify | " +
                        "rule image link unlink | source"
                },

                title: {
                    width: 340,
                    height: 100,
                    controls: "bold italic underline | font size color | " +
                        "bullets outdent indent | source removeformat"
                }

            }

        },

        /*
         * Get and measure markup.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this.item =                     this.element.prev('item-row');
            this.form =                     this.element.find('form');
            this.deleteButton =             this.form.find('#record-delete-button');
            this.closeButton =              this.form.find('#record-close-button');
            this.saveButton =               this.form.find('input[type="submit"]');
            this.title =                    this.form.find('textarea[name="title"]');
            this.slug =                     this.form.find('input[name="slug"]');
            this.description =              this.form.find('textarea[name="description"]');
            this.useDcData =                this.form.find('input[name="use-dc-data"]');
            this.useDcDataLabel =           this.useDcData.next('span');
            this.startDate =                this.form.find('input[name="start-date-date"]');
            this.endDate =                  this.form.find('input[name="end-date-date"]');
            this.startVisibleDate =         this.form.find('input[name="start-visible-date"]');
            this.endVisibleDate =           this.form.find('input[name="end-visible-date"]');
            this.vectorColor =              this.form.find('input[name="vector-color"]');
            this.strokeColor =              this.form.find('input[name="stroke-color"]');
            this.highlightColor =           this.form.find('input[name="highlight-color"]');
            this.vectorOpacity =            this.form.find('input[name="vector-opacity"]');
            this.strokeOpacity =            this.form.find('input[name="stroke-opacity"]');
            this.strokeWidth =              this.form.find('input[name="stroke-width"]');
            this.pointRadius =              this.form.find('input[name="point-radius"]');
            this.leftPercent =              this.form.find('input[name="left-ambiguity-percentage"]');
            this.rightPercent =             this.form.find('input[name="right-ambiguity-percentage"]');
            this.textInputs =               this.form.find('input[type="text"], textarea');
            this.fieldset =                 this.form.find('fieldset');
            this.actions =                  this.form.find('#edit-form-actions');
            this.inputs =                   this.form.find('#edit-form-inputs');
            this.ambiguity =                this.form.find('.date-ambiguity-container');
            this.mapFocus =                 this.form.find('.map-focus');
            this.resetStyles =              this.form.find('.reset-styles');
            this.parentRecord =             this.form.find('select[name="parent-record"]');
            this.titleDescriptionFieldset = this.form.find('a.fieldset.text');
            this.dateInformationFieldset =  this.form.find('a.fieldset.temporal');
            this.mapStylesFieldset =        this.form.find('a.fieldset.styles');
            this.relationshipsFieldset =    this.form.find('a.fieldset.relationships');

            // Trackers.
            this._db =                      TAFFY();
            this._isForm =                  false;
            this._data =                    null;
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

            // ** TITLE.
            this.titleEditor = this.title.cleditor(
                this.options.cleditor.title
            )[0];

            // ** DESCRIPTION.
            this.descriptionEditor = this.description.cleditor(
                this.options.cleditor.description
            )[0];

            // ** USE DC DATA.
            this.useDcData.bind('change', _.bind(function() {

                // If the box is checked, disable text editors.
                if (this.useDcData.prop('checked')) {
                    this._disableTextEditors();
                    this._postDcDefaultStatus(true);
                }

                // If the box is unchecked, enable text editors.
                else {
                    this._enableTextEditors();
                    this._postDcDefaultStatus(false);
                }

            }, this));

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

            // ** HIGHLIGHT COLOR.
            this.highlightColor.miniColors();

            // ** SHAPE OPACITY.
            this.vectorOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('vectorOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** LINE OPACITY.
            this.strokeOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('strokeOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** LINE THICKNESS.
            this.strokeWidth.integerdragger({
                min: 0,
                def: 1,
                px_per_unit: 8,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('strokeWidthEdit', {}, { 'value': obj.value });
                }
            });

            // ** POINT RADIUS.
            this.pointRadius.integerdragger({
                min: 1,
                def: 6,
                px_per_unit: 8,
                tip: { show: false },
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

            // ** CLOSE.
            this.closeButton.bind({

                'mousedown': function() {
                    self._trigger('hide');
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
                        self.postRecordDelete();
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
                    self.postResetStyles();
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
                default_status: true,
                'change': function() {
                    self._measureForm();
                }
            });

            // Date information.
            this.dateInformationFieldset.fieldsetexpander({
                default_status: false,
                'change': function() {
                    self._measureForm();
                }
            });

            // Map styles.
            this.mapStylesFieldset.fieldsetexpander({
                default_status: false,
                'change': function() {
                    self._measureForm();
                }
            });

            // Relationships.
            this.relationshipsFieldset.fieldsetexpander({
                default_status: false,
                'change': function() {
                    self._measureForm();
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
        showForm: function(item) {

            // Getters and setters.
            this.item =                     item;
            var itemRaw =                   item.attr('itemid');
            var recordRaw =                 item.attr('recordid');
            this.itemTitleText =            item.find('.item-title-text');
            this.container =                this.item.next('tr').find('td.edit-form-container');
            this.textSpan =                 this.item.find('.item-title-text');
            this.time =                     this.item.find('.time input');
            this.space =                    this.item.find('.space input');

            // For record ids, fall back to null if undefined.
            this.itemId = itemRaw === '' ?
                null : parseInt(itemRaw, 10);
            this.recordId = recordRaw === '' ?
                null : parseInt(recordRaw, 10);

            // Inject the form markup.
            this.container.append(this.element);

            // DOM touches.
            this._disableButtons();
            this._showContainer();
            this._expandTitle();
            this._getFormData();

            // If there is no item id, display the delete button.
            if (_.isNull(this.itemId)) {
                this._hideItemRecordElements();
            }

            // Otherwise, hide it.
            else {
                this._showItemRecordElements();
            }

            // Update the tracker.
            this._isForm = true;

        },

        /*
         * Collapse an item edit form and unbind all events.
         */
        hideForm: function(item, immediate) {

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
         * Reload the form data.
         */
        reloadForm: function() {
            this._getFormData();
        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Disable the save and delete buttons.
         */
        _disableButtons: function() {
            this.saveButton.attr('disabled', 'disabled');
            this.deleteButton.attr('disabled', 'disabled');
        },

        /*
         * Enable the save and delete buttons.
         */
        _enableButtons: function() {
            this.saveButton.removeAttr('disabled');
            this.deleteButton.removeAttr('disabled');
        },

        /*
         * Expand the item form.
         */
        _showContainer: function() {

            // Display the form and zero the height.
            this.container.css('display', 'table-cell');
            this.element.css('visibility', 'visible');
            this.form.css('height', 'auto');

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

            // Bold the title.
            this.textSpan.css({
                'font-weight': 'bold',
                'color': textColor,
            });

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

            // Set text weight.
            this.textSpan.css('font-weight', textWeight);

            // Highlight the item title.
            this.textSpan.stop().animate({
                'color': textColor,
                'font-size': this.options.css.default_text_size
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
            if (_.isNull(this.itemId) && this.title.val() !== '') {
                this._trigger('settitle', {}, { 'text': this.title.val() });
            }
        },

        /*
         * Show form elements for item-backed record.
         */
        _showItemRecordElements: function() {

            // Hide delete button, enable use-DC button.
            this.deleteButton.css('visibility', 'hidden');
            this.useDcData.removeAttr('disabled');

            // Un-gray-out the checkbox label.
            this.useDcDataLabel.css('opacity', 1);

        },

        /*
         * Show form elements for Neatline-endemic record.
         */
        _hideItemRecordElements: function() {

            // Show delete button, disable use-DC button.
            this.deleteButton.css('visibility', 'visible');
            this.useDcData.attr('disabled', true);

            // Gray out the checkbox label.
            this.useDcDataLabel.css('opacity', 0.3);

        },

        /*
         * Push the form data into the input fields.
         */
        _applyData: function() {

            // Get use-DC as boolean.
            var useDc = Boolean(this._data.use_dc_metadata);

            // Update title.
            this.title.val(this._data.title);
            this.titleEditor.updateFrame().refresh();

            // Update description.
            this.description.val(this._data.description);
            this.descriptionEditor.updateFrame().refresh();

            // If use-DC is activated, disable text editors.
            if (useDc) this._disableTextEditors();
            else this._enableTextEditors();

            // Populate inputs.
            this.slug.val(this._data.slug);
            this.useDcData.prop('checked', useDc);
            this.vectorOpacity.val(this._data.vector_opacity);
            this.strokeOpacity.val(this._data.stroke_opacity);
            this.strokeWidth.val(this._data.stroke_width);
            this.pointRadius.val(this._data.point_radius);
            this.leftPercent.val(this._data.left_percent);
            this.rightPercent.val(this._data.right_percent);
            this.startDate.val(this._data.start_date);
            this.endDate.val(this._data.end_date);
            this.startVisibleDate.val(this._data.start_visible_date);
            this.endVisibleDate.val(this._data.end_visible_date);

            // Reposition the draggers.
            this.ambiguity.gradientbuilder(
                'positionMarkers',
                this._data.left_percent,
                this._data.right_percent);

            // Set the gradient builder color.
            this.ambiguity.gradientbuilder(
                'setColor',
                this._data.vector_color);

            // Push the new colors onto the pickers. Need to set the global
            // _opened tracker to circumvent miniColors' automatic firing of
            // the change callback on value set.
            this._opened = true;
            this.vectorColor.miniColors('value', this._data.vector_color);
            this.strokeColor.miniColors('value', this._data.stroke_color);
            this.highlightColor.miniColors('value', this._data.highlight_color);
            this._opened = false;

            // Populate the non parent record option.
            this.parentRecord.empty();
            var noneOption = $('<option />').val('none').text('-');
            this.parentRecord.append(noneOption);

            // Populate the rest of the list.
            _.each(this._records, _.bind(function(val, key) {
                var option = $('<option />').val(key).text(val);
                this.parentRecord.append(option);
            }, this));

            // Set the value.
            this.parentRecord.val(this._data.parent_record_id);

        },

        /*
         * Empty out the form data.
         */
        _clearData: function() {

            // Clear inputs.
            this.title.val('');
            this.slug.val('');
            this.vectorColor.val('');
            this.leftPercent.val(0);
            this.rightPercent.val(100);
            this.startDate.val('');
            this.endDate.val('');
            this.startVisibleDate.val('');
            this.endVisibleDate.val('');
            this.description.val('');
            this.descriptionEditor.updateFrame();
            this.parentRecord.empty();

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

            // Get the content of the text editors.
            data.description =              this._getDescriptionContent();
            data.title =                    this._getTitleContent();
            data.slug =                     this.slug.val();

            // Get the form field data.
            data.use_dc_metadata =          this.useDcData.is(':checked') ? 1 : 0;
            data.left_percent =             parseInt(this.leftPercent.val(), 10);
            data.right_percent =            parseInt(this.rightPercent.val(), 10);
            data.start_date =               this.startDate.val();
            data.end_date =                 this.endDate.val();
            data.start_visible_date =       this.startVisibleDate.val();
            data.end_visible_date =         this.endVisibleDate.val();
            data.vector_color =             this.vectorColor.val();
            data.stroke_color =             this.strokeColor.val();
            data.highlight_color =          this.highlightColor.val();
            data.vector_opacity =           parseInt(this.vectorOpacity.val(), 10);
            data.stroke_opacity =           parseInt(this.strokeOpacity.val(), 10);
            data.stroke_width =             parseInt(this.strokeWidth.val(), 10);
            data.point_radius =             parseInt(this.pointRadius.val(), 10);
            data.parent_record_id =         parseInt(this.parentRecord.val(), 10);

            // If use-dc is checked, empty description.
            if (data.use_dc_metadata) {
                data.description = '';
            }

            return data;

        },

        /*
         * Get form data and merge with status and coverage data.
         */
        _getDataForSave: function(coverage) {

            // Build the base form data.
            var data = this._getData();

            // Merge the status and coverage data.
            data.item_id =                  this.itemId;
            data.record_id =                this.recordId;
            data.exhibit_id =               Neatline.record.id;
            data.space_active =             this.space.prop('checked').toString();
            data.time_active =              this.time.prop('checked').toString();
            data.geocoverage =              coverage;

            return data;

        },

        /*
         * Get the <body> content out of the description cleditor.
         */
        _getDescriptionContent: function(coverage) {
            return this.description.next('iframe').contents().find('body').html();
        },

        /*
         * Get the <body> content out of the description cleditor.
         */
        _getTitleContent: function(coverage) {
            return this.title.next('iframe').contents().find('body').html();
        },

        /*
         * Disable and gray out the text editors.
         */
        _disableTextEditors: function() {
            this.descriptionEditor.disable(true);
            $(this.descriptionEditor.$main[0]).css('opacity', 0.3);
        },

        /*
         * Enable the text editors.
         */
        _enableTextEditors: function() {
            this.descriptionEditor.disable(false);
            $(this.descriptionEditor.$main[0]).css('opacity', 1);
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

            $.ajax({

                url: 'ajax/form',
                dataType: 'json',

                data: {
                    item_id: this.itemId,
                    record_id: this.recordId,
                    exhibit_id: Neatline.record.id
                },

                success: _.bind(function(data) {

                    // Push the data into the form.
                    this._data = data;
                    this._records = data.records;
                    this._applyData();

                    // Enable the save and delete buttons.
                    this._enableButtons();

                }, this)

            });

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

                    // Reload form.
                    self._getFormData();

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
                    exhibit_id: Neatline.record.id,
                    center: extent,
                    zoom: zoom
                },

                // Fade up.
                success: function() {
                    self._fadeUp();
                    self._trigger('spaceactive');
                    self._trigger('savecomplete');
                }

            });

        },

        /*
         * Delete a Neatline endemic record.
         */
        postRecordDelete: function() {

            var self = this;

            // Commit.
            $.ajax({

                url: 'ajax/delete',
                type: 'POST',
                data: {
                    exhibit_id: Neatline.record.id,
                    record_id: this.recordId
                },

                success: function() {
                    self._fadeUp();
                    self.hideForm(self.item, true);
                    self._trigger('deletecomplete');
                }

            });

        },

        /*
         * Reset record-specific styles.
         */
        postResetStyles: function() {

            var self = this;

            // Commit.
            $.ajax({

                url: 'ajax/resetstyles',
                type: 'POST',
                data: {
                    exhibit_id: Neatline.record.id,
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
         * Reset DC default status.
         */
        _postDcDefaultStatus: function(status) {

            var self = this;

            // Commit.
            $.ajax({

                url: 'ajax/dcdefault',
                type: 'POST',
                dataType: 'html',
                data: {
                    exhibit_id: Neatline.record.id,
                    item_id: this.itemId,
                    record_id: this.recordId,
                    status: status ? 1 : 0
                },

                success: _.bind(function(newDescription) {
                    this.description.val(newDescription);
                    this.descriptionEditor.updateFrame().refresh();
                    self._trigger('savecomplete');
                }, this)

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
         * Insert a data record into the local form data Taffy instance.
         */
        insertLocalData: function(obj) {
            this._db.insert(obj);
        },

        /*
         * Claer the local form data Taffy instance.
         */
        clearLocalData: function() {
            this._db().remove();
        },

        /*
         * Emit a protected class attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });

})( jQuery );
