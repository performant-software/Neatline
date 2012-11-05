/**
 * Item browser and editor column in the Neatline editor.
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


    $.widget('neatline.itembrowser', {

        options: {

            // CSS constants.
            css: {
                default_text_size: 14,
                top_margin: 40,
                fader_width: 40,
                container_min_width: 400
            },

            // Hexes.
            colors: {
                light_blue: '#FFFEF8',
                light_yellow: '#f9f9f9',
                dark_purple: '#594e62',
                purple: '#724e85',
                text: '#515151',
                gray: '#8d8d8d',
                red: '#ca3c3c',
                orange: '#ffda82'
            }

        },

        /*
         * Initialize. Get markup, initialize trackers, and call preparatory methods.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.topBar =                   $('#topbar');
            this.searchBox =                $('#search-box');
            this.itemsList =                $('#items-list-container');
            this.itemsListHeader =          $('#items-list-header');
            this.searchCancel =             $('#search-cancel');
            this.neatlineContainer =        $('#neatline');
            this.dragTip =                  $('#drag-tip');
            this.itemsTip =                 $('#items-tip');
            this.spaceTip =                 $('#space-tip');
            this.timeTip =                  $('#time-tip');
            this.itemsHeader =              $('#items-header');
            this.spaceHeader =              $('#space-header');
            this.timeHeader =               $('#time-header');
            this.editForm =                 $('#edit-form');
            this.newItemButton =            $('#new-item-button');
            this.headerRow =                $('#header-row');

            // Trackers.
            this._searchString =            '';
            this._currentFormItem =         null;
            this._currentFormItemId =       null;
            this._itemsBoxes =              null;
            this._spaceBoxes =              null;
            this._timeBoxes =               null;
            this._neatlineRecords =         [];
            this._omekaRecords =            [];
            this._itemsSorted =             false;
            this._spaceSorted =             false;
            this._timeSorted =              false;
            this._firstRequest =            true;
            this._scrollTop =               0;

            // Prepare the document, position elements, listen for resize.
            this._scrollbarWidth = $.getScrollbarWidth();
            this._addGlobalClasses();
            this._positionDivs();
            this._addWindowResizeListener();
            this._glossSearchBox();
            this._glossColumnHeaders();
            this._glossNewItemButton();
            this._instantiateFormManager();

            // Get starting items.
            this._getItems();

        },


        /*
         * =================
         * Start-up routines, workers, positioners, and calculators.
         * =================
         */


        /*
         * Add document classes to <html> tag.
         */
        _addGlobalClasses: function() {

            // Firefox.
            if ($.browser.mozilla) {
                this._body.addClass('mozilla');
            }

        },

        /*
         * Make the height of the container stretch to fit the height of the window,
         * fix the position of the top bar header (the search bar, filter items) at
         * the top of the container, and call the method to position the Neatline
         * container.
         */
        _positionDivs: function() {

            // Set the starting width of the container.
            this.element.css('width', this.options.css.container_min_width);

            // Update dimensions and set new height.
            this._getDimensions();

            // Set static CSS parameters for the Neatline.
            this.neatlineContainer.css('top', this.topBarHeight);

            // Set the height of the main container.
            this.element.css({
                'width': this.containerWidth,
                'height': this.windowHeight - this.topBarHeight - 1,
                'top': this.topBarHeight
            });

            // Get the absolute offset of the container.
            this.containerOffset = this.element.offset();

            // Set the height of the header.
            this.itemsListHeader.css({
                'top': this.containerOffset.top,
                'width': this.containerWidth - this._scrollbarWidth
            });

            // Position the Neatline div.
            this._positionNeatline();

        },

        /*
         * Calcualte the width and height of the container, window, and top bar.
         */
        _getDimensions: function() {

            this.containerWidth = this.element.width();
            this.containerHeight = this.element.height();
            this.windowWidth = this._window.width();
            this.windowHeight = this._window.height();
            this.topBarHeight = this.topBar.height();

        },

        /*
         * On window resize, reposition all containers.
         */
        _addWindowResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self._positionDivs();
            });

        },

        /*
         * Set the dimensions of the Neatline container.
         */
        _positionNeatline: function() {

            // Position the Neatline container to the right of the item browser.
            this.neatlineContainer.css({
                'height': this.windowHeight - this.topBarHeight,
                'width': this.windowWidth - this.containerWidth - 1
            });

            this._trigger('reposition');

        },

        /*
         * Position the divs that provide the opacity gradient on the right
         * edge of width-occluded item titles in the browser pane.
         */
        _positionTitleFaders: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                var item = $(item);

                // Get the spans for the text and fader.
                var textSpan = item.find('.item-title-text');
                var faderSpan = item.find('.item-title-fader');

                // Measure the height of the block produced by the text
                // and the width of the entire row.
                var titleHeight = textSpan.height();

                // Position the fader.
                faderSpan.css({
                    'height': titleHeight
                });

            });

        },

        /*
         * Given an item <tr> in the browser list, calculate its native top offset
         * relative to the container.
         */
        _calculateTopOffset: function(item) {
            item.data('topOffset', item.position().top);
        },

        /*
         * Do the offset calculation for all current items.
         */
        _calculateAllTopOffsets: function() {

            var self = this;

            // Walk the items and do the offset calculation for each.
            $.each(this.items, function(i, item) {
                self._calculateTopOffset($(item));
            });

        },

        /*
         * Check a space or time status box for an item.
         */
        _checkStatusBlockOn: function(item, viewport) {

            // Get the markup.
            var block = item.find('.' + viewport);
            var checkbox = block.find('input[type="checkbox"]');

            // Check, register.
            checkbox.prop('checked', true);
            item.data(viewport, true);

        },

        /*
         * Uncheck a space or time status box for an item.
         */
        _checkStatusBlockOff: function(item, viewport) {

            // Get the markup.
            var block = item.find('.' + viewport);
            var checkbox = block.find('input[type="checkbox"]');

            // Uncheck, register.
            checkbox.prop('checked', false);
            item.data(viewport, false);

        },

        /*
         * Check or uncheck a space or time status box for an item.
         */
        _checkStatusBlock: function(item, viewport) {

            var block = item.find('.' + viewport);
            var checkbox = block.find('input[type="checkbox"]');
            var newVal = !checkbox.prop('checked');
            checkbox.prop('checked', newVal);

            // Register the new status.
            if (newVal) {
                item.data(viewport, true);
            } else {
                item.data(viewport, false);
            }

        },

        /*
         * Initialize the form manager widget and define callbacks.
         */
        _instantiateFormManager: function() {

            var self = this;

            // Instantiate the widget and define callbacks.
            this.editForm.itemform({

                // When the ambiguity sliders are changed.
                'ambiguityChange': function(event, obj) {
                    var recordid = self._currentFormItem.attr('recordid');
                    self._trigger('ambiguityChange', {}, {
                        'recordid': recordid,
                        'color': obj.color,
                        'leftPercent': obj.leftPercent,
                        'rightPercent': obj.rightPercent
                    });
                },

                // When the vector color is changed.
                'vectorColorEdit': function(event, obj) {
                    if (!_.isNull(self._currentFormItem)) {
                        var recordid = self._currentFormItem.attr('recordid');
                        self._trigger('vectorcoloredit', {}, {
                            'recordid': recordid,
                            'color': obj.color
                        });
                    }
                },

                // When the stroke color is changed.
                'strokeColorEdit': function(event, obj) {
                    self._trigger('strokecoloredit', {}, {
                        'color': obj.color
                    });
                },

                // When the highlight color is changed.
                'highlightColorEdit': function(event, obj) {
                    self._trigger('highlightcoloredit', {}, {
                        'color': obj.color
                    });
                },

                // When the vector opacity is changed.
                'vectorOpacityEdit': function(event, obj) {
                    self._trigger('vectoropacityedit', {}, {
                        'value': obj.value
                    });
                },

                // When the stroke opacity is changed.
                'strokeOpacityEdit': function(event, obj) {
                    self._trigger('strokeopacityedit', {}, {
                        'value': obj.value
                    });
                },

                // When the graphic opacity is changed.
                'graphicOpacityEdit': function(event, obj) {
                    self._trigger('graphicopacityedit', {}, {
                        'value': obj.value
                    });
                },

                // When the stroke width is changed.
                'strokeWidthEdit': function(event, obj) {
                    self._trigger('strokewidthedit', {}, {
                        'value': obj.value
                    });
                },

                // When the point radius.
                'pointRadiusEdit': function(event, obj) {
                    self._trigger('pointradiusedit', {}, {
                        'value': obj.value
                    });
                },

                // When a form is closed.
                'hide': function() {
                    self._hideForm(self._currentFormItem, true);
                },

                // When a form is saved.
                'save': function() {
                    self._trigger('saveform');
                },

                // When a save finishes.
                'savecomplete': function() {
                    self._trigger('savecomplete');
                },

                // Mark space active on current item.
                'spaceactive': function() {
                    self._checkStatusBlockOn(
                        self._currentFormItem,
                        'space'
                    );
                },

                // Mark time active on current item.
                'timeactive': function() {
                    self._checkStatusBlockOn(
                        self._currentFormItem,
                        'time'
                    );
                },

                // Get current map focus for item.
                'savemapfocus': function() {
                    self._trigger('savemapfocus');
                },

                // Reload the items list.
                'reload': function() {
                    self._trigger('savecomplete');
                    self._getItems();
                },

                // Update the current record title.
                'settitle': function(event, obj) {
                    self._currentRecordTitle.html(obj.text);
                },

                // Update the recordid attribute on the current item.
                'updatedid': function(event, obj) {
                    self._currentFormItem.attr('recordid', obj.recordid);
                    self.idToItem[parseInt(obj.recordid, 10)] = self._currentFormItem;
                },

                // After a record is deleted, remove its listing.
                'deletecomplete': function(event, obj) {
                    self._currentFormItem.remove();
                    self._hideForm(self._currentFormItem, true);
                    self._glossItems();
                    self._trigger('savecomplete');
                }

            });

        },


        /*
         * =================
         * Event constructors.
         * =================
         */


        /*
         * Build functionality on the search box. On keyup, fire the request
         * to fetch new items; on mousedown on the cancel 'x', zero out the
         * input value and trigger the keyup event to re-fetch the base-case
         * all results.
         */
        _glossSearchBox: function() {

            var self = this;

            this.searchBox.bind({

                'keyup': function() {
                    self._searchString = self.searchBox.val();
                    self._getItems();
                }

            });

            // Gloss the cancel button.
            this.searchCancel.bind({

                'mousedown': function() {
                    self.searchBox.val('');
                    self.searchBox.trigger('keyup');
                }

            });

        },

        /*
         * Listen for mousedown on the "New" button.
         */
        _glossNewItemButton: function() {

            var self = this;

            this.newItemButton.bind({

                'mousedown': function() {
                    self._getNewItemMarkup();
                }

            });

        },

        /*
         * Add tooltips to column headers.
         */
        _glossColumnHeaders: function() {
            // this.itemsListHeader.find('a.header').tooltip();
        },

        /*
         * Recreate the scrollTop offset that was active before the user
         * opened a form.
         */
        _recuperateScrollTop: function() {
            this.element.scrollTop(this._scrollTop);
        },

        /*
         * Once the raw markup is from the items ajax query is pushed into the
         * container, build the functionality for each item.
         */
        _glossItems: function() {

            var self = this;

            // Get the new items and record headers.
            this.items =                    this.itemsList.find('.item-row');
            this.neatlineRecordsHeader =    this.itemsList.find('#neatline-header');
            this.omekaRecordsHeader =       this.itemsList.find('#omeka-header');

            // Position the faders.
            this._positionTitleFaders();
            this.idToItem = {};
            this._neatlineRecords = [];
            this._omekaRecords = [];

            // Hide header rows.
            this._hideHeaderRows();

            // Add the edit form functionality.
            $.each(this.items, function(i, item) {

                // DOM fetch.
                var item =                  $(item);
                var allCells =              item.find('td');
                var recordid =              item.attr('recordid');
                var itemTitleTd =           item.find('.item-title');
                var itemTitleText =         item.find('.item-title-text');
                var itemsBlock =            item.find('.items');
                var itemsCheckbox =         itemsBlock.find('input[type="checkbox"]');
                var spaceBlock =            item.find('.space');
                var spaceCheckbox =         spaceBlock.find('input[type="checkbox"]');
                var timeBlock =             item.find('.time');
                var timeCheckbox =          timeBlock.find('input[type="checkbox"]');

                // Set expanded false by default.
                item.data('expanded', false);

                // Populate record header trackers.
                if (item.attr('itemid')) self._omekaRecords.push(item);
                else if (item.attr('recordid')) self._neatlineRecords.push(item);

                // Unbind all existing events.
                $.map([item,
                allCells,
                itemTitleTd,
                itemTitleText,
                spaceBlock,
                spaceCheckbox,
                timeBlock,
                timeCheckbox], function(el, i) { el.unbind(); });

                // Register the item, calculate offset.
                self.idToItem[parseInt(recordid)] = item;
                self._calculateTopOffset(item);

                // Store the space/time status on the DOM.
                if (itemsCheckbox.prop('checked')) { item.data('items', true); }
                else { item.data('items', false); }
                if (spaceCheckbox.prop('checked')) { item.data('space', true); }
                else { item.data('space', false); }
                if (timeCheckbox.prop('checked')) { item.data('time', true); }
                else { item.data('time', false); }

                // Disable checkbox behevior for the space/time boxes.
                $.each([spaceCheckbox, timeCheckbox, itemsCheckbox], function(i, box) {
                    box.bind('click', function(event) {
                        event.preventDefault();
                    });
                });

                // Add mouseenter glossing to row.
                item.bind({

                    'mouseenter': function() {
                        item.css('background-color', self.options.colors.light_blue);
                    },

                    'mouseleave': function() {
                        item.css('background-color', self.options.colors.light_yellow);
                    }

                });

                // Bind the checkbox click functionality to the boxes.
                itemsBlock.bind({

                    'mousedown': function() {
                        self._checkStatusBlock(item, 'items');
                        self._saveStatus(item, 'items', true);
                    },

                    'mouseenter': function() {
                        itemsBlock.css('background-color', self.options.colors.orange);
                    },

                    'mouseleave': function() {
                        itemsBlock.css('background-color', '');
                    }

                });

                // Bind the checkbox click functionality to the boxes.
                spaceBlock.bind({

                    'mousedown': function() {
                        self._checkStatusBlock(item, 'space');
                        self._saveStatus(item, 'space', true);
                    },

                    'mouseenter': function() {
                        spaceBlock.css('background-color', self.options.colors.orange);
                    },

                    'mouseleave': function() {
                        spaceBlock.css('background-color', '');
                    }

                });

                // Bind the checkbox click functionality to the boxes.
                timeBlock.bind({

                    'mousedown': function() {
                        self._checkStatusBlock(item, 'time');
                        self._saveStatus(item, 'time', true);
                    },

                    'mouseenter': function() {
                        timeBlock.css('background-color', self.options.colors.orange);
                    },

                    'mouseleave': function() {
                        timeBlock.css('background-color', '');
                    }

                });

                // Bind the form open and close events.
                itemTitleTd.bind({

                    'mousedown': function() {

                        // If the form is not expanded, do expand.
                        if (!item.data('expanded')) {
                            self._showForm(item, true, true, true);
                        }

                        // If the form is not expanded, do expand.
                        else {
                            self._hideForm(item, true);
                        }

                    }

                });

            });

            // Fetch the space and time boxes and set the class global buckets.
            this._itemsBoxes = this.items.find('.items');
            this._spaceBoxes = this.items.find('.space');
            this._timeBoxes = this.items.find('.time');

            // Re-perform the offset calculations.
            this._calculateAllTopOffsets();

             // Show row headers.
            this._showHeaderRows();

        },

        /*
         * Add a new record row to the list and expand it.
         */
        _insertNewRecordRow: function(html) {

            // If there is an open form, close it.
            if (!_.isNull(this._currentFormItem)) {
                this._hideForm(this._currentFormItem, true);
            }

            // If there is no record header row, prepend to list.
            if (this.neatlineRecordsHeader.length === 0) {
                this.itemsList.prepend(html);
            }

            // If there is a record header, append after it.
            else {
                this.neatlineRecordsHeader.after(html);
            }

            // Re-gloss, show new form.
            this._glossItems();

         },


        /*
         * =======================
         * Form interface methods.
         * =======================
         */


        /*
         * Expand an item form.
         */
         _showForm: function(item, scrollMap, scrollTimeline, focusItems) {

            if (this._isEditFormLocked()) return;

            var self = this;
            var immediate = false;
            var recordId = item.attr('recordid');

            // Mark current form item as contracted.
            if (!_.isNull(this._currentFormItem)) {
                this._hideForm(this._currentFormItem, true);
            }

            // Capture the current scrollTop of the container.
            this._scrollTop = this.element.scrollTop();

            // Display the form and action links.
            this.editForm.itemform('showForm', item);

            // Fire events to focus the Neatline blocks.
            this._trigger('itemedit', {}, {
                'recordid': recordId,
                'scrollMap': scrollMap,
                'scrollTimeline': scrollTimeline,
                'focusItems': focusItems
            });

            // Fire event to show the map controls.
            this._trigger('mapedit', {}, {
                'item': item,
                'immediate': immediate
            });

            // Update trackers.
            item.data('expanded', true);
            this._currentFormItem = item;
            this._currentFormItemId = recordId;
            this._currentRecordTitle = item.find('span.item-title-text');

            // Show item rows.
            this._hideItemRows();

         },

        /*
         * Contract an expended item form.
         */
         _hideForm: function(item, immediate) {

            if (this._isEditFormLocked()) return;

            // Hide the form.
            this.editForm.itemform(
                'hideForm',
                item,
                immediate);

            // Fire the end edit without save callback.
            this._trigger('endmapedit', {}, {
                'immediate': immediate
            });

            // Update trackers.
            item.data('expanded', false);
            this._currentFormItem = null;
            this._currentFormItemId = null;

            // Show item rows, recuperate scrollTop.
            this._showItemRows();
            this._recuperateScrollTop();

         },

        /*
         * Hide all non-expanded item rows.
         */
         _hideItemRows: function() {

            // Hide items.
            _.each(this.items, function(row) {
                if (!$(row).data('expanded')) {
                    $(row).hide();
                } else {
                    $(row).show();
                }
            });

             // Hide row headers.
            this._hideHeaderRows();

            // Scroll container to top.
            this.element.scrollTop(0);

         },

        /*
         * Show all non-expanded item rows.
         */
        _showItemRows: function() {

            // Show items.
            _.each(this.items, function(row) {
                $(row).show();
            });

             // Show row headers.
            this._showHeaderRows();

         },

        /*
         * Hide all non-expanded item rows.
         */
        _hideHeaderRows: function() {

             // Hide row headers.
            this.omekaRecordsHeader.hide();
            this.neatlineRecordsHeader.hide();

         },

        /*
         * Show the record header rows if records exist.
         */
        _showHeaderRows: function() {

            // Omeka records.
            if (!_.isEmpty(this._omekaRecords)) {
                this.omekaRecordsHeader.show();
            }

            // Neatline records.
            if (!_.isEmpty(this._neatlineRecords)) {
                this.neatlineRecordsHeader.show();
            }

         },

        /*
         * Ping the form manager to save the current form data.
         */
         saveForm: function(coverage) {
            this.editForm.itemform('saveItemForm', coverage);
         },


        /*
         * =================
         * Ajax calls.
         * =================
         */


        /*
         * Get items for the browser. On success, populate the container with
         * the fresh markup. If it is the first request made on pageload, trigger
         * out to deployment that the Neatline can be instantiated. This ordering
         * is necessary to avoid a tricky suite of positioning bugs that occur
         * if the Neatline is initialized before the full editor markup is present
         * and occupying space on the page.
         */
        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: 'ajax/items',
                dataType: 'html',

                data: {
                    exhibit_id: Neatline.record.id,
                    search: this._searchString
                },

                success: function(data) {

                    // Pop the edit form out of the DOM.
                    self.editForm.itemform('detachForm');

                    // Update items.
                    self.itemsList.html(data);
                    self._positionDivs();
                    self._glossItems();

                    // Trigger neatlineready event.
                    if (self._firstRequest) {
                        self._trigger('neatlineready');
                        self._firstRequest = false;
                    }

                }

            });

        },

        /*
         * When a status checkbox is checked or unchecked, dial back and commit
         * the status record.
         */
        _saveStatus: function(item, viewport, reload) {

            var self = this;

            var block = item.find('.' + viewport);
            var checkbox = block.find('input[type="checkbox"]');
            var value = checkbox.prop('checked');

            // Get the Omeka item id and the title div.
            var recordid = item.attr('recordid');
            var itemid = item.attr('itemid');
            var itemTitleText = item.find('.' + this.options.item_title_text_class);

            // Save the new status.
            $.ajax({

                url: 'ajax/status',
                type: 'POST',
                dataType: 'json',

                data: {
                    exhibit_id: Neatline.record.id,
                    item_id: itemid,
                    record_id: recordid,
                    space_or_time: viewport,
                    value: String(value)
                },

                success: function(data) {

                    // Update the recordid on the item listing.
                    item.attr('recordid', data.record_id);
                    self.idToItem[data.record_id] = item;

                    // Trigger exhibit reload.
                    if (reload) self._trigger('savecomplete');

                }

            });

        },

        /*
         * Hit the server for base markup for a new item row.
         */
        _getNewItemMarkup: function() {

            var self = this;

            // Get the HTML.
            $.ajax({

                url: 'ajax/add',
                type: 'GET',
                dataType: 'html',
                data: { exhibit_id: Neatline.record.id },

                success: function(html) {
                    self._insertNewRecordRow(html);
                }

            });

        },


        /*
         * =================
         * Public methods.
         * =================
         */


        /*
         * Populate a tracker variable with geocoverage data for a given
         * collection of features on the map. Called in advance of the item
         * saving routine.
         */
        setCoverageData: function(data) {
            this.editForm.itemform('setCoverageData', data);
        },

        /*
         * Expand the form for a given record id.
         */
        showFormByRecordId: function(id, scrollMap, scrollTimeline, focusItems) {

            // If the form is already open, break.
            if (id == this._currentFormItemId) return;

            // Get the item from the id hash.
            var item = this.idToItem[id];
            this._showForm(item, scrollMap, scrollTimeline, focusItems);

        },

        /*
         * Set the current map focus on the form widget.
         */
        saveMapFocus: function(extent, zoom) {
            this.editForm.itemform('postMapFocus', extent, zoom);
        },

        /*
         * Reload the item form.
         */
        reloadItemForm: function(extent, zoom) {
            this.editForm.itemform('reloadForm');
        },

        /*
         * Update geocoverage on current form.
         */
        updateGeocoverage: function(geocoverage) {
            this.editForm.itemform('updateGeocoverage', geocoverage);
        },

        /*
         * Retrieve the recordid of the current edit form. If there is not an active
         * edit form, return false.
         */
        getCurrentEditId: function() {
            return this.editForm.itemform('getCurrentEditId');
        },

        /*
         * Emit a protected class attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        },

        /*
         * Is the edit form created and locked?
         */
        _isEditFormLocked: function() {
            var locked = false;
            locked =  this.editForm.itemform != null
                   && this.editForm.itemform('isLocked');
            return locked;
        }

    });

})( jQuery );
;/**
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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
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
                dark_purple: '#594e62',
                purple: '#724e85',
                text: '#515151',
                gray: '#8d8d8d',
                red: '#ca3c3c',
                orange: '#ffda82'
            },

            // Redactor options.
            redactor: [
                'html', 'bold', 'italic', 'underline', '|',
                'image', 'link', '|',
                'fontcolor', 'backcolor', '|',
                'alignleft', 'aligncenter', 'alignright', '|',
                'fullscreen'
            ]

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
            this.saveButton =               this.form.find('#record-save-button');
            this.title =                    this.form.find('textarea[name="title"]');
            this.slug =                     this.form.find('input[name="slug"]');
            this.description =              this.form.find('textarea[name="description"]');
            this.showBubble =               this.form.find('input[name="show-bubble"]');
            this.useDcData =                this.form.find('input[name="use-dc-data"]');
            this.useDcDataLabel =           this.useDcData.next('span');
            this.startDate =                this.form.find('input[name="start-date-date"]');
            this.endDate =                  this.form.find('input[name="end-date-date"]');
            this.startVisibleDate =         this.form.find('input[name="start-visible-date"]');
            this.endVisibleDate =           this.form.find('input[name="end-visible-date"]');
            this.geocoverage =              this.form.find('textarea[name="geocoverage"]');
            this.vectorColor =              this.form.find('input[name="vector-color"]');
            this.strokeColor =              this.form.find('input[name="stroke-color"]');
            this.highlightColor =           this.form.find('input[name="highlight-color"]');
            this.vectorOpacity =            this.form.find('input[name="vector-opacity"]');
            this.selectOpacity =            this.form.find('input[name="select-opacity"]');
            this.strokeOpacity =            this.form.find('input[name="stroke-opacity"]');
            this.graphicOpacity =           this.form.find('input[name="graphic-opacity"]');
            this.strokeWidth =              this.form.find('input[name="stroke-width"]');
            this.pointRadius =              this.form.find('input[name="point-radius"]');
            this.pointImage =               this.form.find('input[name="point-image"]');
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
            this._isLocked =                false;

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
            this.highlightColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('highlightColorEdit', {}, { 'color': hex });
                }

            });

            // ** SHAPE OPACITY.
            this.vectorOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 3,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('vectorOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** SELECT OPACITY.
            this.selectOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 3,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('selectOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** LINE OPACITY.
            this.strokeOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 3,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('strokeOpacityEdit', {}, { 'value': obj.value });
                }
            });

            // ** GRAPHIC OPACITY.
            this.graphicOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 3,
                tip: { show: false },
                change: function(evt, obj) {
                    self._trigger('graphicOpacityEdit', {}, { 'value': obj.value });
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
                    self.saveItemForm();
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

                    // Only delete if record is Neatline-endemic.
                    if (_.isUndefined(this.itemId)) {
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
            this.form.tabs();
        },

        /*
         * Instantiate the editors on title and description.
         */
        _buildEditors: function() {

        },

        /*
         * Destroy editors on title and description.
         */
        _destroyEditors: function() {

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

            if (this._isLocked) return;

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
            this._buildEditors();
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

            if (this._isLocked) return;

            // DOM touches.
            this._hideContainer(immediate);
            this._contractTitle();
            this._destroyEditors();

            // Update the tracker.
            this._isForm = false;

        },

        /*
         * Post form data.
         */
        saveItemForm: function() {

            // Fade the form, post the data.
            this._fadeDown();
            this._postFormData();

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

        _disableCloseButton: function() {
            this.closeButton.attr('disabled', 'disabled');
        },

        /*
         * Enable the save and delete buttons.
         */
        _enableButtons: function() {
            this.saveButton.removeAttr('disabled');
            this.deleteButton.removeAttr('disabled');
        },

        _enableCloseButton: function() {
            this.closeButton.removeAttr('disabled');
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

            // Bold the title.
            this.textSpan.css({
                'font-weight': 'bold',
                'color': this.options.colors.dark_purple
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
            this.element.animate({ 'opacity': 0.3 }, 200);
        },

        /*
         * Push up the opacity after data commit.
         */
        _fadeUp: function() {
            this.element.animate({ 'opacity': 1 }, 200);
        },

        /*
         * If the record is Neatline-endemic and has a non-empty title, push
         * on the title to the title text span.
         */
        _updateTitleText: function() {

            // If the record is Neatline endemic.
            if (_.isNull(this.itemId)) {

                // If there is a title present.
                if (this._data.title !== '') {
                    this._trigger('settitle', {}, {
                        'text': this._data.title
                    });
                }

                // If there is a description present.
                else if (this._data.description !== '') {
                    this._trigger('settitle', {}, {
                        'text': this._data.description.substring(0, 200)
                    });
                }

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
         * Process and apply new form data.
         */
        _ingestData: function(data) {

            // Push the data into the form.
            this._data = data;
            this._records = data.records;
            this._applyData();

            // Enable the save and delete buttons.
            this._enableButtons();

        },

        /*
         * Push the form data into the input fields.
         */
        _applyData: function() {

            // Get use-DC as boolean.
            var useDc = Boolean(parseInt(this._data.use_dc_metadata, 10));
            var showBubble = Boolean(parseInt(this._data.show_bubble, 10));

            // Update editors.
            this.title.val(this._data.title);
            this.description.val(this._data.description);

            // If use-DC is activated, disable text editors.
            if (useDc) this._disableTextEditors();
            else this._enableTextEditors();

            // Populate inputs.
            this.slug.val(this._data.slug);
            this.useDcData.prop('checked', useDc);
            this.showBubble.prop('checked', showBubble);
            this.vectorOpacity.val(this._data.vector_opacity);
            this.selectOpacity.val(this._data.select_opacity);
            this.strokeOpacity.val(this._data.stroke_opacity);
            this.graphicOpacity.val(this._data.graphic_opacity);
            this.strokeWidth.val(this._data.stroke_width);
            this.pointRadius.val(this._data.point_radius);
            this.pointImage.val(this._data.point_image);
            this.leftPercent.val(this._data.left_percent);
            this.rightPercent.val(this._data.right_percent);
            this.startDate.val(this._data.start_date);
            this.endDate.val(this._data.end_date);
            this.startVisibleDate.val(this._data.start_visible_date);
            this.endVisibleDate.val(this._data.end_visible_date);
            this.geocoverage.val(this._data.geocoverage);

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
                if (!_.isNull(val)) {
                    var option = $('<option />').val(key).text(val);
                    this.parentRecord.append(option);
                }
            }, this));

            // Set the value.
            this.parentRecord.val(this._data.parent_record_id);

        },

        /*
         * Get form data.
         */
        _getData: function() {

            var data = {};

            // Get the content of the text editors.
            data.description =              this.description.val();
            data.title =                    this.title.val();
            data.slug =                     this.slug.val();

            // Get the form field data.
            data.use_dc_metadata =          this.useDcData.is(':checked') ? 1 : 0;
            data.show_bubble =              this.showBubble.is(':checked') ? 1 : 0;
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
            data.select_opacity =           parseInt(this.selectOpacity.val(), 10);
            data.stroke_opacity =           parseInt(this.strokeOpacity.val(), 10);
            data.graphic_opacity =          parseInt(this.graphicOpacity.val(), 10);
            data.stroke_width =             parseInt(this.strokeWidth.val(), 10);
            data.point_radius =             parseInt(this.pointRadius.val(), 10);
            data.point_image =              this.pointImage.val();
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
        _getDataForSave: function() {

            // Build the base form data.
            var data = this._getData();

            // Merge the status and coverage data.
            data.item_id =                  this.itemId;
            data.record_id =                this.recordId;
            data.exhibit_id =               Neatline.record.id;
            data.space_active =             this.space.prop('checked').toString();
            data.time_active =              this.time.prop('checked').toString();
            data.geocoverage =              this.geocoverage.val();

            return data;

        },

        /*
         * Disable and gray out the text editors.
         */
        _disableTextEditors: function() {
            // this.descriptionEditor.disable(true);
            // $(this.descriptionEditor.$main[0]).css('opacity', 0.3);
        },

        /*
         * Enable the text editors.
         */
        _enableTextEditors: function() {
            // this.descriptionEditor.disable(false);
            // $(this.descriptionEditor.$main[0]).css('opacity', 1);
        },

        /*
         * Update the geocoverage textarea.
         */
        updateGeocoverage: function(geocoverage) {
            this.geocoverage.val(geocoverage);
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
                    this._ingestData(data);
                }, this)

            });

        },

        /*
         * Save form data.
         */
        _postFormData: function(coverage) {

            var self = this;

            // Get the data.
            var data = this._getDataForSave();

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

                    // Apply new form data.
                    self._ingestData(data.form);

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
                    this.description.setCode(newDescription);
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
        },

        /*
         * Handle locking the form so it can't change.
         */
        lockForm: function() {
            this._isLocked = true;
            this._disableCloseButton();
        },

        unlockForm: function() {
            this._isLocked = false;
            this._enableCloseButton();
        },

        isLocked: function() {
            return this._isLocked;
        }

    });

})( jQuery );
;/**
 * Geometry editor widget that appears at the top right corner of the
 * map during an item edit in the Neatline editor.
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


    $.widget('neatline.editgeometry', {

        options: {

            // Markup hooks.
            markup: {
                geo_edit_class: 'geo-edit'
            },

            // Animation constants.
            animation: {
                fade_duration: 500
            }

        },

        _create: function() {

            var self = this;

            // Get markup.
            this.editContainer =            $('#geo-edit');
            this.scaleButton =              $('#scale-button');
            this.rotateButton =             $('#rotate-button');
            this.dragButton =               $('#drag-button');
            this.deleteButton =             $('#delete-button');

            // Insert the containers.
            this.element.append(this.editContainer);

            // Store starting status data trackers.
            this.scaleButton.data('activated', false);
            this.rotateButton.data('activated', false);
            this.dragButton.data('activated', false);

            // Gloss the drag button.
            this.dragButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.dragButton.data('activated')) {

                        // Do the color change.
                        self.dragButton.addClass('btn-neatline');

                        // Change the trackers.
                        self.dragButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Do the color change.
                        self.dragButton.removeClass('btn-neatline');

                        // Change the tracker.
                        self.dragButton.data('activated', false);

                    }

                    // Fire out the update event.
                    self._trigger('update', {}, {
                        'drag': self.dragButton.data('activated'),
                        'rotate': self.rotateButton.data('activated'),
                        'scale': self.scaleButton.data('activated')
                    });

                }

            });

            // Gloss the scale button.
            this.scaleButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.scaleButton.data('activated')) {

                        // Do the color change.
                        self.scaleButton.addClass('btn-neatline');

                        // Change the trackers.
                        self.scaleButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Do the color change.
                        self.scaleButton.removeClass('btn-neatline');

                        // Change the tracker.
                        self.scaleButton.data('activated', false);

                    }

                    // Fire out the update event.
                    self._trigger('update', {}, {
                        'drag': self.dragButton.data('activated'),
                        'rotate': self.rotateButton.data('activated'),
                        'scale': self.scaleButton.data('activated')
                    });

                }

            });

            // Gloss the rotate button.
            this.rotateButton.bind({

                'mousedown': function() {

                    // If not activated, activate.
                    if (!self.rotateButton.data('activated')) {

                        // Do the color change.
                        self.rotateButton.addClass('btn-neatline');

                        // Change the tracker.
                        self.rotateButton.data('activated', true);

                    }

                    // If activated, deactivate.
                    else {

                        // Do the color change.
                        self.rotateButton.removeClass('btn-neatline');

                        // Change the tracker.
                        self.rotateButton.data('activated', false);

                    }

                    // Fire out the update event.
                    self._trigger('update', {}, {
                        'drag': self.dragButton.data('activated'),
                        'rotate': self.rotateButton.data('activated'),
                        'scale': self.scaleButton.data('activated')
                    });

                }

            });

            // Gloss the delete button.
            this.deleteButton.bind({

                // Fire out the delete event.
                'mousedown': function() {
                    self._trigger('delete');
                }

            });

        },

        /*
         * Position the opacity slider, layer switcher, and zoom bar.
         */
        positionControls: function(top, left, width, height) {

            // Container.
            this.editContainer.css({
                top: top+55,
                left: left+65
            });

        },

        showButtons: function() {

            // Display the edit controls.
            this.editContainer.css({
                'display': 'block',
                'opacity': 0,
                'z-index': 999
            }).stop().animate({ 'opacity': 1}, this.options.animation.fade_duration);

            this.deactivateAllButtons();

        },

        hideButtons: function() {

            var self = this;

            // Fade down.
            this.editContainer.stop().animate({
                'opacity': 0
            }, this.options.markup.fade_duration, function() {
                self.editContainer.css('z-index', -99);
            });

        },

        deactivateAllButtons: function() {

            // Drag.
            this.dragButton.removeClass('primary');
            this.dragButton.data('activated', false);

            // Scale.
            this.scaleButton.removeClass('primary');
            this.scaleButton.data('activated', false);

            // Rotate.
            this.rotateButton.removeClass('primary');
            this.rotateButton.data('activated', false);

        }

    });


})( jQuery );

;/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Dynamic layout builder application in the add view.
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


    $.widget('neatline.layoutbuilder', {

        options: {

            // CSS constants.
            css: {
                gloss_fade_duration: 300,
                vt1_percentage: 15,
                vt2_percentage: 85
            },

            // Hex defaults.
            colors: {
                map: {
                    def: '#fff',
                    target: '#fffcf4'
                },
                timeline: {
                    def: '#fff',
                    target: '#fffcf4'
                },
                items: {
                    def: '#fff',
                    target: '#fffcf4'
                }
            }

        },

        /*
         * Get markup, run start-up routine.
         */
        _create: function() {

            // Get window for mousemove binding.
            this._window = $(window);

            // Getters for options and dragbox divs.
            this.buttons = $('#options');
            this.dragbox = $('#drag-box');

            // Set tracker arrays that record the last parameter
            // loadouts that triggered a div slide.
            this._lastMapParams = null;
            this._lastTimelineParams = null;
            this._lastItemsParams = null;

            // Build and prepare markup.
            this._disableSelect();
            this._createDraggers();

            // Start-up routine.
            this._instantiatePositioner();
            this.getPxConstants();
            this._createButtons();
            this._setStartingParameters();
            this._addDragEvents();

        },

        /*
         * Run the positioning manager on the container.
         */
        _instantiatePositioner: function() {

            var self = this;

            // Instantiate the positioning manager.
            this.dragbox.positioner({

                // Block markup.
                markup: {
                    map:        '#drag-map',
                    timeline:   '#drag-timeline',
                    items:      '#drag-items'
                },

                // Positioning constants.
                constants: {
                    h_percent:  Neatline.proportions.horizontal,
                    v_percent:  Neatline.proportions.vertical
                },

                // Map not fullscreen.
                mapFullscreen: false,

                // On width drag.
                drag: function(event, obj) {
                    self._trigger('widthDrag', {}, obj);
                    self.centerAllTags();
                    self.getPxConstants();
                    self._computePositions();
                },

                // On width drag completion.
                layoutChange: function(event, obj) {
                    self.centerAllTags();
                    self.getPxConstants();
                    self._computePositions();
                }

            });

        },

        /*
         * Pull the saved positioning constants out of the Nealtine global
         * and prepare the buttons.
         */
        _setStartingParameters: function() {

            // Get starting parameters out of the Neatline global.
            this._top_element =             Neatline.record.top_element;
            this._items_h_pos =             Neatline.record.items_h_pos;
            this._items_v_pos =             Neatline.record.items_v_pos;
            this._items_height =            Neatline.record.items_height;
            this._is_map =                  Boolean(Neatline.record.is_map);
            this._is_timeline =             Boolean(Neatline.record.is_timeline);
            this._is_items =                Boolean(Neatline.record.is_items);

            // Push starting params into positioner and do first position.
            this._computePositions();

            // Enable the buttons.
            this.map_toggle.togglebutton('enable');
            this.timeline_toggle.togglebutton('enable');
            this.items_toggle.togglebutton('enable');

            // For each block, if active then temporarily knock false
            // the tracker (so that the button press initializes the
            // block to active) and trigger the button press.
            if (this._is_map) {
                this._is_map = false;
                this.map_toggle.togglebutton('press');
            } else {
                this._is_map = false;
            }

            if (this._is_timeline) {
                this._is_timeline = false;
                this.timeline_toggle.togglebutton('press');
            } else {
                this._is_timeline = false;
            }

            if (this._is_items) {
                this._is_items = false;
                this.items_toggle.togglebutton('press');
            } else {
                this._is_items = false;
            }

        },

        /*
         * Re-measure the container div.
         */
        getPxConstants: function() {

            // Hit the measuring method on the positioner.
            this.dragbox.positioner('measure');

            // Capture the new constants.
            this.width =                this.dragbox.positioner('getAttr', 'width');
            this.height =               this.dragbox.positioner('getAttr', 'height');
            this.minorWidth =           this.dragbox.positioner('getAttr', 'minorWidth');
            this.majorWidth =           this.dragbox.positioner('getAttr', 'majorWidth');
            this.majorHeight =          this.dragbox.positioner('getAttr', 'majorHeight');
            this.minorHeight =          this.dragbox.positioner('getAttr', 'minorHeight');

            // Get the offset of the container relative to the window.
            this.dragboxOffset =        this.dragbox.offset();

            // Compute the vertical dragging tiers for the items block.
            this.vt1 =                  this.height * (this.options.css.vt1_percentage / 100);
            this.vt2 =                  this.height * (this.options.css.vt2_percentage / 100);

        },

        /*
         * Compute new positions from the current values of the trackers.
         */
        _computePositions: function() {

            this.positions = this.dragbox.positioner(
                'compute',
                this._is_map,
                this._is_timeline,
                this._is_items,
                this._top_element,
                this._items_v_pos,
                this._items_h_pos,
                this._items_height
            );

        },

        /*
         * Turn off text selection on the container.
         */
        _disableSelect: function() {

            // Turn off text selection on the whole container div.
            this.element.css('MozUserSelect', 'none');
            this.element.bind('selectstart mousedown', function() {
                return false;
            });

            // Fix the pointer style in the drag box.
            this.dragbox.css('cursor', 'default');

        },

        /*
         * Construct the toggle button widgets.
         */
        _createButtons: function() {

            var self = this;

            // Instantiate buttons, define callbacks.
            this.map_toggle =               $('#toggle-map');
            this.timeline_toggle =          $('#toggle-timeline');
            this.items_toggle =             $('#toggle-items');

            this.map_toggle.togglebutton({
                pressed_by_default: false,
                enabled_by_default: false,
                press: function() { self._toggleMap(); },
                unpress: function() { self._toggleMap(); }
            });

            this.timeline_toggle.togglebutton({
                pressed_by_default: false,
                enabled_by_default: false,
                press: function() { self._toggleTimeline(); },
                unpress: function() { self._toggleTimeline(); }
            });

            this.items_toggle.togglebutton({
                pressed_by_default: false,
                enabled_by_default: false,
                press: function() { self._toggleItems(); },
                unpress: function() { self._toggleItems(); }
            });

        },

        /*
         * Build the markup for the drag boxes.
         */
        _createDraggers: function() {

            // Create the boxes.
            this.map_drag =         this.__createMapDiv();
            this.timeline_drag =    this.__createTimelineDiv();
            this.items_drag =       this.__createItemsDiv();

            // Inject.
            this.dragbox.append(
                this.map_drag,
                this.timeline_drag,
                this.items_drag);

        },

        /*
         * Bind event listeners onto the drag boxes.
         */
        _addDragEvents: function() {

            var self = this;

            // Gloss map.
            this.map_drag.bind({

                'mouseenter': function() {
                    if (!self._is_dragging) {
                        self.__mapHighlight('enter');
                    }
                },

                'mouseleave': function() {
                    if (!self._is_dragging) {
                        self.__mapHighlight('leave');
                    }
                },

                'mousedown': function(e) {
                    if (!self._is_dragging) {
                        self._current_dragger = 'map';
                        self.__doMapDrag(e);
                    }
                }

            });

            // Gloss timeline.
            this.timeline_drag.bind({

                'mouseenter': function() {
                    if (!self._is_dragging) {
                        self.__timelineHighlight('enter');
                    }
                },

                'mouseleave': function() {
                    if (!self._is_dragging) {
                        self.__timelineHighlight('leave');
                    }
                },

                'mousedown': function(e) {
                    if (!self._is_dragging) {
                        self._current_dragger = 'timeline';
                        self.__doTimelineDrag(e);
                    }
                }

            });

            // Gloss items.
            this.items_drag.bind({

                'mouseenter': function() {
                    if (!self._is_dragging) {
                        self.__itemsHighlight('enter');
                    }
                },

                'mouseleave': function() {
                    if (!self._is_dragging) {
                        self.__itemsHighlight('leave');
                    }
                },

                'mousedown': function(e) {
                    if (!self._is_dragging) {
                        self._current_dragger = 'items';
                        self.__doItemsDrag(e);
                    }
                }

            });

        },

        /*
         * Re-render the block width and height percentages.
         */
        applyProportions: function(h_percent, v_percent) {

            // Rerender
            this.dragbox.positioner(
                'applyProportions',
                h_percent,
                v_percent
            );

            // Center tags.
            this.centerAllTags();

        },

        /*
         * Re-render the block positioning.
         */
        _reposition: function() {

            // Manifest the parameters.
            this.dragbox.positioner('apply');

            // Center tags.
            this.centerAllTags();

        },

        /*
         * Center the label for an individual block.
         */
        _position_tag: function(draggable) {

            var tag = draggable.find('.drag-tag');
            var draggable_height = draggable.height();
            var tag_height = tag.height();

            tag.css('top', (draggable_height/2)-(tag_height/2) + 'px');

        },

        /*
         * Center the block labels.
         */
        centerAllTags: function() {

            this._position_tag(this.map_drag);
            this._position_tag(this.timeline_drag);
            this._position_tag(this.items_drag);

        },

        /*
         * Toggle the map block.
         */
        _toggleMap: function() {

            switch(this._is_map) {

                case true:

                    this._is_map = false;

                    // If no timeline, disable items.
                    if (!this._is_timeline && this._is_items) {
                        this.items_toggle.togglebutton('press');
                    }

                break;

                case false:
                    this._is_map = true;
                break;

            }

            // Recalculate all positions for all divs.
            this._computePositions();
            this._reposition();

        },

        /*
         * Toggle the timeline block.
         */
        _toggleTimeline: function() {

            switch(this._is_timeline) {

                case true:

                    this._is_timeline = false;

                    // If no timeline, disable items.
                    if (!this._is_map && this._is_items) {
                        this.items_toggle.togglebutton('press');
                    }

                break;

                case false:
                    this._is_timeline = true;
                break;

            }

            // Recalculate all positions for all divs.
            this._computePositions();
            this._reposition();

        },

        /*
         * Toggle the items block.
         */
        _toggleItems: function() {

            switch(this._is_items) {

                case true:
                    this._is_items = false;
                break;

                case false:
                    this._is_items = true;
                break;

            }

            // Recalculate all positions for all divs.
            this._computePositions();
            this._reposition();

        },

        /*
         * Slide a block tag to the center of the container.
         */
        _animate_position_tag: function(draggable, height) {

            var tag = draggable.find('.drag-tag');
            var tag_height = tag.height();

            tag.stop().animate({ 'top': (height/2)-(tag_height/2) + 'px' });

        },


        /*
         * =================
         * Glossing and dragging methods.
         * =================
         */


        /*
         * Highlight the map block.
         */
        __mapHighlight: function(enter_or_leave) {

            // Figure out which color to tween to.
            switch (enter_or_leave) {

                case 'enter':
                    var target = this.options.colors.map.target;
                break;

                case 'leave':
                    var target = this.options.colors.map.def;
                break;

            }

            this.map_drag.clearQueue().animate({
                'background-color': target
            }, this.options.css.gloss_fade_duration);

        },

        /*
         * Highlight the timeline block.
         */
        __timelineHighlight: function(enter_or_leave) {

            // Figure out which color to tween to.
            switch (enter_or_leave) {

                case 'enter':
                    var target = this.options.colors.timeline.target;
                break;

                case 'leave':
                    var target = this.options.colors.timeline.def;
                break;

            }

            this.timeline_drag.clearQueue().animate({
                'background-color': target
            }, this.options.css.gloss_fade_duration);

        },

        /*
         * Highlight the items block.
         */
        __itemsHighlight: function(enter_or_leave) {

            // Figure out which color to tween to.
            switch (enter_or_leave) {

                case 'enter':
                    var target = this.options.colors.items.target;
                break;

                case 'leave':
                    var target = this.options.colors.items.def;
                break;

            }

            this.items_drag.clearQueue().animate({
                'background-color': target
            }, this.options.css.gloss_fade_duration);

        },

        /*
         * Map drag handler.
         */
        __doMapDrag: function(trigger_event_object) {

            var self = this;

            // Set dragging tracker.
            this._is_dragging = true;

            // Get starting pointer coordinates.
            var startingX = trigger_event_object.pageX;
            var startingY = trigger_event_object.pageY;

            // Get starting div offsets.
            var startingOffsetX = this.positions.map.left;
            var startingOffsetY = this.positions.map.top;

            // Make the drag div see-through and always on top.
            this.__fadeDragger(this.map_drag);

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offsets.
                    var offsetX = e.pageX - startingX;
                    var offsetY = e.pageY - startingY;

                    // Apply new position.
                    self.map_drag.css({
                        'left': startingOffsetX + offsetX,
                        'top': startingOffsetY + offsetY
                    });

                    /*
                     * Repositioning listeners.
                     */

                    // TIMELINE and ITEMS.
                    if (self._is_timeline && self._is_items) {

                        // Vertical switching between map and timeline.

                        // MAP on top:
                        if (self._top_element === 'map') {

                            // ** Cursor down.
                            if (e.pageY > (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'timeline';
                                self.__slideTimeline(false);
                                self.__slideItems(false);
                            }

                        }

                        // TIMELINE on top:
                        else if (self._top_element === 'timeline') {

                            // ** Cursor up.
                            if (e.pageY < (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'map';
                                self.__slideTimeline(false);
                                self.__slideItems(false);

                            }

                        }

                        // Horizontal switching between map and items.

                        if (self.__mapIsLevelWithItems()) {

                            // ITEMS on right:
                            if (self._items_h_pos === 'right') {

                                // ** Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + self.majorWidth)) {
                                    self._items_h_pos = 'left';
                                    self.__slideItems(false);
                                }

                            }

                            // ITEMS on left:
                            else if (self._items_h_pos === 'left') {

                                // ** Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + self.minorWidth)) {
                                    self._items_h_pos = 'right';
                                    self.__slideItems(false);
                                }

                            }

                        }

                    }

                    // TIMELINE:
                    else if (self._is_timeline && !self._is_items) {

                        // Vertical switching between map and timeline.

                        // MAP on top:
                        if (self._top_element === 'map') {

                            // ** Cursor down.
                            if (e.pageY > (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'timeline';
                                self.__slideTimeline(false);
                            }

                        }

                        // TIMELINE on top:
                        else if (self._top_element === 'timeline') {

                            // ** Cursor up.
                            if (e.pageY < (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'map';
                                self.__slideTimeline(false);
                            }

                        }

                    }

                    // ITEMS:
                    else if (!self._is_timeline && self._is_items) {

                        // Horizontal switching between map and items.

                        if (self.__mapIsLevelWithItems()) {

                            // ITEMS on right:
                            if (self._items_h_pos === 'right') {

                                // ** Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + self.majorWidth)) {
                                    self._items_h_pos = 'left';
                                    self.__slideItems(false);
                                }

                            }

                            // ITEMS on left:
                            else if (self._items_h_pos === 'left') {

                                // ** Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + self.minorWidth)) {
                                    self._items_h_pos = 'right';
                                    self.__slideItems(false);
                                }

                            }

                        }

                    }

                },

                'mouseup': function() {

                    self.__slideMap(true);
                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Timeline drag handler.
         */
        __doTimelineDrag: function(trigger_event_object) {

            var self = this;

            // Set dragging tracker.
            this._is_dragging = true;

            // Get starting pointer coordinates.
            var startingX = trigger_event_object.pageX;
            var startingY = trigger_event_object.pageY;

            // Get starting div offsets.
            var startingOffsetX = this.positions.timeline.left;
            var startingOffsetY = this.positions.timeline.top;

            // Make the drag div see-through and always on top.
            this.__fadeDragger(this.timeline_drag);

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offsets.
                    var offsetX = e.pageX - startingX;
                    var offsetY = e.pageY - startingY;

                    // Apply new position.
                    self.timeline_drag.css({
                        'left': startingOffsetX + offsetX,
                        'top': startingOffsetY + offsetY
                    });

                    /*
                     * Repositioning listeners.
                     */

                    // MAP and ITEMS.
                    if (self._is_map && self._is_items) {

                        // Vertical switching between map and timeline.

                        // TIMELINE on top:
                        if (self._top_element === 'timeline') {

                            // ** Cursor down.
                            if (e.pageY > (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'map';
                                self.__slideMap(false);
                                self.__slideItems(false);
                            }

                        }

                        // MAP on top:
                        else if (self._top_element === 'map') {

                            // ** Cursor up.
                            if (e.pageY < (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'timeline';
                                self.__slideMap(false);
                                self.__slideItems(false);

                            }

                        }

                        // Horizontal switching between map and items.

                        if (self.__timelineIsLevelWithItems()) {

                            // ITEMS on right:
                            if (self._items_h_pos === 'right') {

                                // ** Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + self.majorWidth)) {
                                    self._items_h_pos = 'left';
                                    self.__slideItems(false);
                                }

                            }

                            // ITEMS on left:
                            else if (self._items_h_pos === 'left') {

                                // ** Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + self.minorWidth)) {
                                    self._items_h_pos = 'right';
                                    self.__slideItems(false);
                                }

                            }

                        }

                    }

                    // MAP:
                    else if (self._is_map && !self._is_items) {

                        // Vertical switching between map and timeline.

                        // TIMELINE on top:
                        if (self._top_element === 'timeline') {

                            // ** Cursor down.
                            if (e.pageY > (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'map';
                                self.__slideMap(false);
                            }

                        }

                        // MAP on top:
                        else if (self._top_element === 'map') {

                            // ** Cursor up.
                            if (e.pageY < (self.dragboxOffset.top + self.majorHeight)) {
                                self._top_element = 'timeline';
                                self.__slideMap(false);
                            }

                        }

                    }

                    // ITEMS:
                    else if (!self._is_map && self._is_items) {

                        // Horizontal switching between timeline and items.

                        if (self.__timelineIsLevelWithItems()) {

                            // ITEMS on right:
                            if (self._items_h_pos === 'right') {

                                // ** Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + self.majorWidth)) {
                                    self._items_h_pos = 'left';
                                    self.__slideItems(false);
                                }

                            }

                            // ITEMS on left:
                            else if (self._items_h_pos === 'left') {

                                // ** Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + self.minorWidth)) {
                                    self._items_h_pos = 'right';
                                    self.__slideItems(false);
                                }

                            }

                        }

                    }

                },

                'mouseup': function() {

                    self.__slideTimeline(true);
                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Items drag handler.
         */
        __doItemsDrag: function(trigger_event_object) {

            var self = this;

            // Set dragging tracker.
            this._is_dragging = true;

            // Get starting pointer coordinates.
            var startingX = trigger_event_object.pageX;
            var startingY = trigger_event_object.pageY;

            // Get starting div offsets.
            var startingOffsetX = this.positions.items.left;
            var startingOffsetY = this.positions.items.top;

            // Make the drag div see-through and always on top.
            this.__fadeDragger(this.items_drag);

            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offsets.
                    var offsetX = e.pageX - startingX;
                    var offsetY = e.pageY - startingY;

                    // Apply new position.
                    self.items_drag.css({
                        'left': startingOffsetX + offsetX,
                        'top': startingOffsetY + offsetY
                    });

                    /*
                     * Repositioning listeners.
                     */

                    // MAP and TIMELINE.
                    if (self._is_map && self._is_timeline) {

                        // Items height switching.

                        // Top tier.
                        if (e.pageY < (self.dragboxOffset.top + self.vt1)) {
                            self._items_height = 'partial';
                            self._items_v_pos = 'top';
                            self.__slideMap(false);
                            self.__slideTimeline(false);
                        }

                        // Middle tier.
                        if (e.pageY > (self.dragboxOffset.top + self.vt1) &&
                            e.pageY < (self.dragboxOffset.top + self.vt2)) {
                            self._items_height = 'full';
                            self.__slideMap(false);
                            self.__slideTimeline(false);
                        }

                        // Bottom tier.
                        if (e.pageY > (self.dragboxOffset.top + self.vt2)) {
                            self._items_height = 'partial';
                            self._items_v_pos = 'bottom';
                            self.__slideMap(false);
                            self.__slideTimeline(false);
                        }

                        // Horizontal switching.

                        // With map.
                        if (self.__mapIsLevelWithItems()) {

                            // Items on right.
                            if (self._items_h_pos === 'right') {

                                // Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + (self.width/2))) {
                                    self._items_h_pos = 'left';
                                    self.__slideMap(false);
                                }

                            }

                            // Items on left.
                            if (self._items_h_pos === 'left') {

                                // Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + (self.width/2))) {
                                    self._items_h_pos = 'right';
                                    self.__slideMap(false);
                                }

                            }

                        }

                        // With timeline.
                        if (self.__timelineIsLevelWithItems()) {

                            // Items on right.
                            if (self._items_h_pos === 'right') {

                                // Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + (self.width/2))) {
                                    self._items_h_pos = 'left';
                                    self.__slideTimeline(false);
                                }

                            }

                            // Items on left.
                            if (self._items_h_pos === 'left') {

                                // Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + (self.width/2))) {
                                    self._items_h_pos = 'right';
                                    self.__slideTimeline(false);
                                }

                            }

                        }

                        // With map and timeline.
                        if (self._items_height === 'full') {

                            // Items on right.
                            if (self._items_h_pos === 'right') {

                                // Cursor left.
                                if (e.pageX < (self.dragboxOffset.left + (self.width/2))) {
                                    self._items_h_pos = 'left';
                                    self.__slideMap(false);
                                    self.__slideTimeline(false);
                                }

                            }

                            // Items on left.
                            if (self._items_h_pos === 'left') {

                                // Cursor right.
                                if (e.pageX > (self.dragboxOffset.left + (self.width/2))) {
                                    self._items_h_pos = 'right';
                                    self.__slideMap(false);
                                    self.__slideTimeline(false);
                                }

                            }

                        }

                    }

                    // MAP.
                    else if (self._is_map && !self._is_timeline) {

                        // Map and items horizontal switching.

                        // Items on right.
                        if (self._items_h_pos === 'right') {

                            // Cursor left.
                            if (e.pageX < (self.dragboxOffset.left + (self.width/2))) {
                                self._items_h_pos = 'left';
                                self.__slideMap(false);
                            }

                        }

                        // Items on left.
                        if (self._items_h_pos === 'left') {

                            // Cursor right.
                            if (e.pageX > (self.dragboxOffset.left + (self.width/2))) {
                                self._items_h_pos = 'right';
                                self.__slideMap(false);
                            }

                        }

                    }

                    // TIMELINE.
                    else if (!self._is_map && self._is_timeline) {

                        // Map and items horizontal switching.

                        // Items on right.
                        if (self._items_h_pos === 'right') {

                            // Cursor left.
                            if (e.pageX < (self.dragboxOffset.left + (self.width/2))) {
                                self._items_h_pos = 'left';
                                self.__slideTimeline(false);
                            }

                        }

                        // Items on left.
                        if (self._items_h_pos === 'left') {

                            // Cursor right.
                            if (e.pageX > (self.dragboxOffset.left + (self.width/2))) {
                                self._items_h_pos = 'right';
                                self.__slideTimeline(false);
                            }

                        }

                    }

                },

                'mouseup': function() {

                    self.__slideItems(true);
                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Manifest new timeline position.
         *
         * - param boolean endingSlide: True if the slide was triggered by
         *   a mouseup on the dragger dif, which case the dragger should be
         *   pushed back to full opacity at the end of the slide tween.
         */
        __slideTimeline: function(endingSlide) {

            var self = this;

            // Capture the current positioning loadout.
            var newParams = [
                this._top_element,
                this._items_h_pos,
                this._items_v_pos,
                this._items_height
            ];

            // If there is a parameter change.
            if (!$.compare(newParams, this.lastTimelineParams) ||
                this._current_dragger === 'timeline') {

                // Recompute positions.
                this._computePositions();

                // If ending slide.
                if (endingSlide) {

                    // Slide the timeline.
                    this.timeline_drag.stop().animate({
                        'height': this.positions.timeline.height,
                        'width': this.positions.timeline.width,
                        'top': this.positions.timeline.top,
                        'left': this.positions.timeline.left,
                        'opacity': 1,
                        'z-index': 0
                    }, function() {
                        self._is_dragging = false;
                        self.timeline_drag.trigger('mouseleave');
                    });

                }

                // If not an ending slide.
                else {

                    // Slide the timeline.
                    this.timeline_drag.stop().animate({
                        'height': this.positions.timeline.height,
                        'width': this.positions.timeline.width,
                        'top': this.positions.timeline.top,
                        'left': this.positions.timeline.left
                    });

                }

                // Recenter the tag.
                this._animate_position_tag(
                    this.timeline_drag,
                    this.positions.timeline.height
                );

                // Capture the new positioning loadout.
                this.lastTimelineParams = [
                    this._top_element,
                    this._items_h_pos,
                    this._items_v_pos,
                    this._items_height
                ];

            }

        },

        /*
         * Manifest new map position.
         *
         * - param boolean endingSlide: True if the slide was triggered by
         *   a mouseup on the dragger dif, which case the dragger should be
         *   pushed back to full opacity at the end of the slide tween.
         */
        __slideMap: function(endingSlide) {

            var self = this;

            // Capture the current positioning loadout.
            var newParams = [
                this._top_element,
                this._items_h_pos,
                this._items_v_pos,
                this._items_height
            ];

            // If there is a parameter change.
            if (!$.compare(newParams, this.lastMapParams) ||
                this._current_dragger === 'map') {

                // Recompute positions.
                this._computePositions();

                // If ending slide.
                if (endingSlide) {

                    // Slide the timeline.
                    this.map_drag.stop().animate({
                        'height': this.positions.map.height,
                        'width': this.positions.map.width,
                        'top': this.positions.map.top,
                        'left': this.positions.map.left,
                        'opacity': 1,
                        'z-index': 0
                    }, function() {
                        self._is_dragging = false;
                        self.map_drag.trigger('mouseleave');
                    });

                }

                // If not an ending slide.
                else {

                    // Slide the timeline.
                    this.map_drag.stop().animate({
                        'height': this.positions.map.height,
                        'width': this.positions.map.width,
                        'top': this.positions.map.top,
                        'left': this.positions.map.left
                    });

                }

                // Recenter the tag.
                this._animate_position_tag(
                    this.map_drag,
                    this.positions.map.height
                );

                // Capture the new positioning loadout.
                this.lastMapParams = [
                    this._top_element,
                    this._items_h_pos,
                    this._items_v_pos,
                    this._items_height
                ];

            }

        },

        /*
         * Manifest new items position.
         *
         * - param boolean endingSlide: True if the slide was triggered by
         *   a mouseup on the dragger dif, which case the dragger should be
         *   pushed back to full opacity at the end of the slide tween.
         */
        __slideItems: function(endingSlide) {

            var self = this;

            // Capture the current positioning loadout.
            var newParams = [
                this._top_element,
                this._items_h_pos,
                this._items_v_pos,
                this._items_height
            ];

            // If there is a parameter change.
            if (!$.compare(newParams, this.lastItemParams) ||
                this._current_dragger === 'items') {

                // Recompute positions.
                this._computePositions();

                // If ending slide.
                if (endingSlide) {

                    // Slide the timeline.
                    this.items_drag.stop().animate({
                        'height': this.positions.items.height,
                        'width': this.positions.items.width,
                        'top': this.positions.items.top,
                        'left': this.positions.items.left,
                        'opacity': 1,
                        'z-index': 0
                    }, function() {
                        self._is_dragging = false;
                        self.items_drag.trigger('mouseleave');
                    });

                }

                // If not an ending slide.
                else {

                    // Slide the timeline.
                    this.items_drag.stop().animate({
                        'height': this.positions.items.height,
                        'width': this.positions.items.width,
                        'top': this.positions.items.top,
                        'left': this.positions.items.left
                    });

                }

                // Recenter the tag.
                this._animate_position_tag(
                    this.items_drag,
                    this.positions.items.height
                );

                // Capture the new positioning loadout.
                this.lastItemParams = [
                    this._top_element,
                    this._items_h_pos,
                    this._items_v_pos,
                    this._items_height
                ];

            }

        },


        /*
         * =================
         * Positioning calculators and DOM helpers.
         * =================
         */


        /*
         * Build the map dragger.
         */
        __createMapDiv: function() {

            return $('<div id="drag-map" class="draggable">\
                        <span class="drag-tag">Map</span>\
                      </div>');

        },

        /*
         * Build the timeline dragger.
         */
        __createTimelineDiv: function() {

            return $('<div id="drag-timeline" class="draggable">\
                        <span class="drag-tag">Timeline</span>\
                      </div>');

        },

        /*
         * Build the items dragger.
         */
        __createItemsDiv: function() {

            return $('<div id="drag-items" class="draggable">\
                        <span class="drag-tag">Items</span>\
                      </div>');

        },

        /*
         * Fade out a drag box when a drag event starts.
         */
        __fadeDragger: function(dragger) {

            dragger.css({
                'opacity': 0.5,
                'z-index': 99
            });

        },

        /*
         * Return boolean true if the map dragger is horizontally level with
         * the items block, and the items block is partial height.
         *
         * - return boolean: True if the map is level with ITEMS.
         */
        __mapIsLevelWithItems: function() {

            // If all three blocks are present.
            if (this._is_map && this._is_timeline && this._is_items) {

                if (this._top_element === 'map' &&
                    this._items_height === 'partial' &&
                    this._items_v_pos === 'top') {

                    return true;

                }

                if (this._top_element === 'timeline' &&
                    this._items_height === 'partial' &&
                    this._items_v_pos === 'bottom') {

                    return true;

                }

            }

            // If just the map and items are present.
            else if (this._is_map && !this._is_timeline && this._is_items) {
                return true;
            }

            return false;

        },

        /*
         * Return boolean true if the timeline dragger is horizontally level with
         * the items block, and the items block is partial height.
         *
         * - return boolean: True if the timeline is level with ITEMS.
         */
        __timelineIsLevelWithItems: function() {

            // If all three blocks are present.
            if (this._is_map && this._is_timeline && this._is_items) {

                if (this._top_element === 'timeline' &&
                    this._items_height === 'partial' &&
                    this._items_v_pos === 'top') {

                    return true;

                }

                if (this._top_element === 'map' &&
                    this._items_height === 'partial' &&
                    this._items_v_pos === 'bottom') {

                    return true;

                }

            }

            // If just the map and items are present.
            else if (!this._is_map && this._is_timeline && this._is_items) {
                return true;
            }

            return false;

        },

        /*
         * Emit current arrangement parameters.
         *
         * - return object: The parameters.
         */
        getArrangementParameters: function() {

            // Prep booleans for the database.
            var is_map =        this._is_map ? 1 : 0;
            var is_timeline =   this._is_timeline ? 1 : 0;
            var is_items =      this._is_items ? 1 : 0;

            // Get the horizontal and vertical percentages.
            var options = this.dragbox.positioner('getAttr', 'options');

            // Assemble an object with the position tracker variables.
            return {
                exhibit_id:     Neatline.record.id,
                is_map:         is_map,
                is_timeline:    is_timeline,
                is_items:       is_items,
                top_element:    this._top_element,
                items_h_pos:    this._items_h_pos,
                items_v_pos:    this._items_v_pos,
                items_height:   this._items_height,
                h_percent:      options.constants.h_percent,
                v_percent:      options.constants.v_percent
            };

        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return mixed: The attribute value.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });


    $.extend({

        /*
         * Evaluate two arrays for equality.
         */
        compare: function(array1, array2) {

            if (_.isUndefined(array1) || _.isUndefined(array2)) {
                return false;
            }

            if (array1.length !== array2.length) {
                return false;
            }

            var a = $.extend(true, [], array1);
            var b = $.extend(true, [], array2);

            a.sort();
            b.sort();

            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }

            return true;

        }

    });


})(jQuery);
;/**
 * Component widget that controls the undated items block. Instantiated by the
 * parent Neatline widget.
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


    $.widget('neatline.itemorderer', $.extend(
        {}, $.neatline.neatlineitems.prototype, {

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Trackers.
            this._isOrdering = false;
            this._dragId = null;

            return $.neatline.neatlineitems.prototype._create.apply(
                this,
                arguments
            );

        },

        /*
         * Build an array of the starting record id ordering.
         */
        _getRowOrder: function() {

            var self = this;
            this._order = [];

            // Re-get the items.
            var items = this.element.find('.item-title');

            // Walk the items.
            $.each(items, function(i, item) {

                var item = $(item);
                self._order.push(parseInt(item.attr('recordid')));

            });

        },

        /*
         * Build on the ordering application.
         */
        reorder: function() {

            // If there is an expanded description, close it.
            if (!_.isNull(this._currentRecord)) {
                this.contractDescription(this._currentRecord);
            }

            // Disable selection.
            this.element.disableSelection();

            // Hide the item descriptions, set tracker.
            this.__hideAllDescriptions();
            this._addOrderingEventsToItems();
            this._isOrdering = true;

            // Register the row order.
            this._getRowOrder();

        },

        /*
         * Remove the ordering application, return the order.
         */
        endreorder: function() {

            // Change the cursor.
            this.__setPointerCursor();

            // Recalculate native item offsets.
            this._getItemOffsets();
            this._removeOrderingEventsToItems();
            this._isOrdering = false;

            return this.objectifyOrder();

        },

        /*
         * Bind the dragging functionality onto the rows.
         */
        _addOrderingEventsToItems: function() {

            var self = this;

            // Set the cursor.
            self.__setMoveCursor();

            // Walk the items.
            $.each(this.items, function(i, item) {

                var item = $(item);

                // Strip off the default mousedown glossing.
                item.unbind('mousedown');

                // Bind on the click and move events.
                item.bind('mousedown', function() {
                    self._doItemDrag(item);
                });

            });

        },

        /*
         * Return the rows to normal state.
         */
        _removeOrderingEventsToItems: function() {

            var self = this;

            // Walk the items.
            $.each(this.items, function(i, item) {

                var item = $(item);
                item.unbind('mousedown');

            });

            // Regloss the items as normal.
            this.loadData();

        },

        /*
         * Drag item.
         */
        _doItemDrag: function(dragItem) {

            var self = this;

            // Get the description row.
            var dragDescription = dragItem.next('li.item-description');

            // Register the starting row order.
            this._getRowOrder();

            // Track the drag id.
            this._dragId = parseInt(dragItem.attr('recordid'));

            // Gray out the item.
            this.__fadeItem(dragItem);

            // On each of the items, listen for mouseenter.
            $.each(this.items, function(i, item) {

                var item = $(item);
                var enterItemId = parseInt(item.attr('recordid'));

                // Get the item description.
                var enterDescription = item.next('li.item-description');

                item.bind({

                    'mouseenter': function() {

                        // If the new item different from the item being dragged.
                        if (enterItemId != self._dragId) {

                            // If the item being dragged is currently below the item
                            // that is being dragged into.
                            if (self._order.indexOf(enterItemId)
                                < self._order.indexOf(self._dragId)) {

                                dragItem.detach().insertBefore(item);
                                dragDescription.detach().insertAfter(dragItem);

                            }

                            // If the item being dragged is currently above the item
                            // that is being dragged into.
                            else if (self._order.indexOf(enterItemId) >
                                     self._order.indexOf(self._dragId)) {

                                dragItem.detach().insertAfter(enterDescription);
                                dragDescription.detach().insertAfter(dragItem);

                            }

                        }

                        // Update the ordering and title offsets.
                        self._getRowOrder();

                    }

                });

            });

            // Listen for mouseup on window.
            this._window.bind({

                // Pop off the events, fade up.
                'mouseup': function() {
                    self._endItemDrag(dragItem);
                }

            });

        },

        /*
         * Close out an item drag.
         */
        _endItemDrag: function(dragItem) {

            this.__unfadeItem(dragItem);
            this._window.unbind('mouseup');
            this.items.unbind('mouseenter');

        },

        /*
         * DOM hits.
         */
        /*
         * Hide the item descriptions.
         */
        __hideAllDescriptions: function() {

            var self = this;

            $.each(this.items, function(i, item) {

                // Get the description.
                var item = $(item);
                var description = item.next('li.item-description');

                // Hide the description.
                description.css('display', 'none');

            });

        },

        /*
         * Set move cursor on item.
         */
        __setMoveCursor: function() {

            $.each(this.items, function(i, item) {
                $(item).css('cursor', 'move');
            });

        },

        /*
         * Set pointer cursor on item.
         */
        __setPointerCursor: function() {

            $.each(this.items, function(i, item) {
                $(item).css('cursor', 'pointer');
            });

        },

        /*
         * Gray out an item.
         */
        __fadeItem: function(item) {

            item.css('opacity', 0.4);

        },

        /*
         * Fade up an item.
         */
        __unfadeItem: function(item) {

            item.css('opacity', 1);

        },

        /*
         * Gray out the items.
         */
        __fadeItems: function() {

            this.items.animate({
                'opacity': 0.3
            }, 200);

        },

        /*
         * Return the items to full opacity.
         */
        __unfadeItems: function() {

            this.items.animate({
                'opacity': 1
            }, 200);

        },

        /*
         * Convert the ordering array into an object literal of format
         * recordid => order integer.
         */
        objectifyOrder: function() {

            var order = {};
            $.each(this._order, function(i, recordid) {
                order[recordid] = i;
            });

            return order;

        }

    }));

    $.neatline.neatlineitems.defaults = $.extend(
        {},$.neatline.neatlineitems.defaults);


})( jQuery );
;/**
 * Editing functionality for map.
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


    $.widget('neatline.mapeditor', $.extend(
        {}, $.neatline.neatlinemap.prototype, {

        /*
         * Instantiate the editor.
         */
        _create: function() {

            // Construct the editing manager.
            this._instantiateEditor();
            this.toolbar = null;

            return $.neatline.neatlinemap.prototype._create.apply(
                this,
                arguments
            );

        },

        /*
         * Initialize the editing manager widget.
         */
        _instantiateEditor: function() {

            var self = this;

            // Instantiate the geometry editor.
            this.element.editgeometry({

                // On update.
                'update': function(event, obj) {

                    // Default to reshape.
                    self.modifyFeatures.mode =
                        OpenLayers.Control.ModifyFeature.RESHAPE;

                    // Rotation.
                    if (obj.rotate) {
                        self.modifyFeatures.mode |=
                            OpenLayers.Control.ModifyFeature.ROTATE;
                    }

                    // Resize.
                    if (obj.scale) {
                        self.modifyFeatures.mode |=
                            OpenLayers.Control.ModifyFeature.RESIZE;
                    }

                    // Drag.
                    if (obj.drag) {
                        self.modifyFeatures.mode |=
                            OpenLayers.Control.ModifyFeature.DRAG;
                    }

                    // If rotate or drag, pop off reshape.
                    if (obj.drag || obj.rotate) {
                        self.modifyFeatures.mode &=
                            -OpenLayers.Control.ModifyFeature.RESHAPE;
                    }

                    var feature = self.modifyFeatures.feature;

                    // If there is a selected feature, unselect and
                    // reselect it to apply the new configuration.
                    if (feature !== null) {
                        self.modifyFeatures.unselectFeature(feature);
                        self.modifyFeatures.selectFeature(feature);
                    }

                },

                'delete': function() {

                    if (!_.isUndefined(self.modifyFeatures) &&
                        self.modifyFeatures.feature) {

                        var feature = self.modifyFeatures.feature;
                        self.modifyFeatures.unselectFeature(feature);
                        self._currentEditLayer.destroyFeatures([feature]);

                        // Emit new geocoverage.
                        self._trigger('featureadded', {}, {
                            geocoverage: self.getWktForSave()
                        });

                    }

                }

            });

        },

        /*
         * Build and activate the editing funcitonalty.
         */
        edit: function(item, immediate) {

            var self = this;

            // Try to get record and item id's.
            var recordid = item.attr('recordid');
            var itemid = item.attr('itemid');

            // If there is a record id, get the layer.
            if (recordid !== '') {
                this.record = this._db({ recordid: parseInt(recordid, 10) }).first();
                this._currentEditLayer = this.record.layer;
            }

            // If there is an item id, try to find a layer.
            else if (itemid !== '') {
                this.record = this._db({ itemid: parseInt(itemid, 10) }).first();
                this._currentEditLayer = this.record.layer;
            }

            // Store the current edit item so that the layer can be reactivatee as
            // the current layer after save.
            this._currentEditItem = item;

            // If the item does not have an existing vector layer, create a new one.
            if (!this._currentEditLayer) {

                var itemName = item.find('span.item-title-text').text();
                var newLayer = new OpenLayers.Layer.Vector(itemName);

                // Push the edit layer onto the non-base layers stack, add to map.
                this._currentEditLayer = newLayer;
                this._currentVectorLayers.push(this._currentEditLayer);
                this.map.addLayer(this._currentEditLayer);
                this._currentEditLayer.setMap(this.map);

                // Add the database record.
                self._db.insert({
                    itemid: itemid,
                    layerid: newLayer.id,
                    recordid: recordid,
                    data: item,
                    layer: newLayer
                });

            }

            // Create the controls and toolbar.
            this.panelControls = this._buildPanelControls();

            this.panelControls[0].events.register('activate', this, function(ev) {
                self.element.trigger('drawingmodeoff');
            });

            var i, pclen = this.panelControls.length;
            for (i=1; i<pclen; i++) {
                var pc = this.panelControls[i];
                pc.events.register('activate', this, function(ev) {
                    self.element.trigger('drawingmodeon');
                });
                pc.events.register('deactivate', this, function(ev) {
                    self.element.trigger('drawingmodeoff');
                });
            }

            // Instantiate the modify feature control.
            this.modifyFeatures = new OpenLayers.Control.ModifyFeature(
                this._currentEditLayer, {
                    standalone: true,
                    onModification: function() {

                        // Emit new geocoverage.
                        self._trigger('featureadded', {}, {
                            geocoverage: self.getWktForSave()
                        });

                        // Add click controls.
                        self._addClickControls();

                    }
                }
            );

            // Instantiate the edit toolbar.
            this.editToolbar = new OpenLayers.Control.Panel({
                defaultControl: this.panelControls[0],
                displayClass: 'olControlEditingToolbar'
            });

            // Add the controls.
            this.editToolbar.addControls(this.panelControls);

            // Show the toolbar, add and activate the other controls.
            this.map.addControl(this.editToolbar);
            this.map.addControl(this.modifyFeatures);
            this.modifyFeatures.activate();

            // Show the edit control markup.
            this.toolbar = $('.olControlEditingToolbar');
            this._popUpEditControls();
            this._positionToolbar();

        },

        /*
         * Remove editing functionality, return to default mode.
         */
        endEditWithoutSave: function(immediate) {

            // Unselect a selected feature.
            if (!_.isUndefined(this.modifyFeatures)) {
                this.modifyFeatures.unselectFeature(this._clickedFeature);
                // Remove control.
                this.map.removeControl(this.modifyFeatures);
            }

            // Remove control.
            this.map.removeControl(this.editToolbar);
            this.element.editgeometry('hideButtons');

            // Clear the item tracker, re-add the click controls.
            this._currentEditItem = null;
            this.record = null;
            this._addClickControls();

        },

        /*
         * Get the WKT representation of the current layer.
         */
        getWktForSave: function() {

            var wkts = [];

            // Unselect feature.
            if (!_.isUndefined(this.modifyFeatures)) {
                this.modifyFeatures.unselectFeature(this._clickedFeature);
            }

            // Cancel running sketch.
            this.cancelSketch();

            // Features -> KML.
            var formatter = new OpenLayers.Format.KML();
            var kml = formatter.write(this._currentEditLayer.features);

            // Re-select the feature.
            if (!_.isUndefined(this.modifyFeatures) &&
                !_.isNull(this._clickedFeature)) {
                try { this.modifyFeatures.selectFeature(this._clickedFeature); }
                catch (err) {}
            }

            return kml;

        },

        /*
         * Cancel the current sketch.
         */
        cancelSketch: function() {
            _.each(this.panelControls.slice(1,4), function(control) {
                control.cancel();
            });
        },

        /*
         * Get the current extent of the viewport.
         */
        getExtentForSave: function() {
            return this.map.getExtent().toString();
        },

        /*
         * Get the current center of the viewport.
         */
        getCenterForSave: function() {
            return this.map.getCenter().toShortString();
        },

        /*
         * Get the current zoom of the viewport.
         */
        getZoomForSave: function() {
            return this.map.getZoom();
        },

        /*
         * Get the current base layer for save.
         */
        getBaseLayerForSave: function() {
            return this.map.baseLayer.name;
        },


        /*
         * ======================
         * Style change handlers.
         * ======================
         */


        /*
         * Update the feature color for the current editing layer.
         */
        setCurrentRecordStyle: function(style, value) {

            var self = this;

            // If there is no extant data record, abort.
            if (_.isNull(this.record) || _.isUndefined(this.record.data)) {
                return;
            }

            // Update the record tracker object.
            this.record.data[style] = value;

            // Rebuild the style map.
            this._currentEditLayer.styleMap = this._getStyleMap(
                this.record.data.vector_color,
                this.record.data.vector_opacity,
                this.record.data.stroke_color,
                this.record.data.stroke_opacity,
                this.record.data.stroke_width,
                this.record.data.point_radius,
                this.record.data.point_image,
                this.record.data.highlight_color,
                this.record.data.select_opacity,
                this.record.data.graphic_opacity
            );

            // Rerender the layer to manifest the change.
            this._currentEditLayer.redraw();

            // redraw() (above) is _not_ working. This is a hack to
            // trigger a rerender on the features.
            $.each(this._currentEditLayer.features, function(i, feature) {
                self.highlightControl.unhighlight(feature);
            });

        },

        /*
         * Set default style.
         */
        setDefaultStyle: function(style, value) {

            var self = this;

            // Walk the current edit layers.
            this._db().each(function(record, id) {

                // Only push the change if the native style is null.
                if (_.isNull(record.data._native_styles[style])) {

                    // Update the record tracker object.
                    record.data[style] = value;

                    // Rebuild the style map.
                    record.layer.styleMap = self._getStyleMap(
                        record.data.vector_color,
                        record.data.vector_opacity,
                        record.data.stroke_color,
                        record.data.stroke_opacity,
                        record.data.stroke_width,
                        record.data.point_radius,
                        record.data.point_image,
                        record.data.highlight_color,
                        record.data.select_opacity,
                        record.data.graphic_opacity
                    );

                    // Rerender the layer to manifest the change.
                    $.each(record.layer.features, function(i, feature) {
                        self.highlightControl.unhighlight(feature);
                    });

                }

            });

        },


        /*
         * =================
         * Asset constructors.
         * =================
         */


        /*
         * Build the panel control handler object.
         */
        _buildPanelControls: function() {

            var self = this;

            // Create the controls and toolbar.
            return [

                // Panning.
                new OpenLayers.Control.Navigation(),

                // Draw lines.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Path, {
                        displayClass: 'olControlDrawFeaturePath',
                        featureAdded: function() {

                            // Emit new geocoverage.
                            self._trigger('featureadded', {}, {
                                geocoverage: self.getWktForSave()
                            });

                            // Add click controls.
                            self._addClickControls();

                        }
                    }
                ),

                // Draw points.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Point, {
                        displayClass: 'olControlDrawFeaturePoint',
                        featureAdded: function() {

                            // Emit new geocoverage.
                            self._trigger('featureadded', {}, {
                                geocoverage: self.getWktForSave()
                            });

                            // Add click controls.
                            self._addClickControls();

                        }
                    }
                ),

                // Draw polygons.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Polygon, {
                        displayClass: 'olControlDrawFeaturePolygon',
                        featureAdded: function() {

                            // Emit new geocoverage.
                            self._trigger('featureadded', {}, {
                                geocoverage: self.getWktForSave()
                            });

                            // Add click controls.
                            self._addClickControls();

                        }
                    }
                )

            ];

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Pop up the geometry add and edit buttons.
         */
        _popUpEditControls: function() {

            // Insert the edit geometry button.
            this.element.editgeometry('showButtons', false);
            this.toolbar.css('opacity', 1);
        },

        /*
         * Position the geometry toolbar.
         */
        _positionToolbar: function() {

            if (_.isNull(this.toolbar)) { return; }

            // Container.
            this.toolbar.css({
                top: this.pos.top+17,
                left: this.pos.left+60
            });

        },

        /*
         * Re-render the map and reposition the edit controls.
         */
        refresh: function(pos) {

            this.pos = pos;

            // Rerender map.
            this.map.updateSize();
            this.positionControls(
                pos.top,
                pos.left,
                pos.width,
                pos.height
            );

            // Position the controls.
            this.element.editgeometry('positionControls',
                pos.top,
                pos.left,
                pos.width,
                pos.height
            );

        }

    }));

    $.neatline.neatlinemap.defaults = $.extend(
        {},$.neatline.neatlinemap.defaults);


})( jQuery );
;/**
 * Map dropdown menu.
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


    $.widget('neatline.configurelayout', {

        /*
         * Get and prepare markup, run start-up routine.
         */
        _create: function() {

            // Get the buttons.
            this.saveArrangementButton =    $('#save-arrangement');
            this.fixPositionsButton =       $('#fix-positions');
            this.layoutBuilder =            $('#configure-layout');

            // Construct the dropdown manager.
            this._constructDropdown();

            // Instantiate the layout builder.
            this._instantiateLayoutBuilder();

            // Add events to buttons.
            this._addEvents();

        },

        /*
         * Run the layout builder application.
         */
        _instantiateLayoutBuilder: function() {

            var self = this;

            this.layoutBuilder.layoutbuilder({
                widthDrag: function(event, obj) {
                    self._trigger('widthDrag', {}, obj);
                }
            });

        },

        /*
         * Listen for mousedown on the buttons.
         */
        _addEvents: function() {

            var self = this;

            this.saveArrangementButton.bind({
                'mousedown': function() {
                    self.saveArrangement();
                }
            });

            this.fixPositionsButton.bind({
                'mousedown': function() {
                    self._trigger('savepositions');
                }
            });

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         */
        _constructDropdown: function() {

            this.element.nlDropdown({

                // On resize, update the layout builder markup.
                'resize': _.bind(function() {
                    this.layoutBuilder.layoutbuilder('getPxConstants');
                    this.layoutBuilder.layoutbuilder('centerAllTags');
                }, this),

                'showstart': _.bind(function() {
                    this.layoutBuilder.layoutbuilder('getPxConstants');
                    this.layoutBuilder.layoutbuilder('centerAllTags');
                }, this),

                'show': _.bind(function() {
                    this.layoutBuilder.layoutbuilder('getPxConstants');
                    this.layoutBuilder.layoutbuilder('centerAllTags');
                }, this)

            });

        },

        /*
         * Set viewport proportions on layout builder.
         */
        setViewportProportions: function(h_percent, v_percent) {

            // Rerender the viewports.
            this.layoutBuilder.layoutbuilder(
                'applyProportions',
                h_percent,
                v_percent
            );

        },

        /*
         * Post a new set of arrangement parameters.
         */
        saveArrangement: function() {

            var self = this;
            var params = this.layoutBuilder.layoutbuilder('getArrangementParameters');

            // Save data.
            $.ajax({

                url: 'ajax/arrangement',
                type: 'POST',
                dataType: 'json',
                data: params,

                success: function(data) {

                    // Trigger the block updates in the exhibit.
                    self._trigger('newarrangement', {}, {
                        'params': data
                    });

                }

            });

        },

        /*
         * Post a new positioning defaults.
         */
        savePositions: function(
            mapExtent,
            mapZoom,
            baseLayer,
            timelineCenter,
            timelineZoom) {

            var self = this;

            // Save data.
            $.ajax({

                url: 'ajax/positions',
                type: 'POST',

                data: {
                    exhibit_id: Neatline.record.id,
                    map_center: mapExtent,
                    map_zoom: mapZoom,
                    map_base_layer: baseLayer,
                    timeline_center: timelineCenter,
                    timeline_zoom: timelineZoom
                },

                success: function() {
                    self._trigger('newpositions');
                }

            });

        }

    });


})(jQuery);
;/**
 * Map dropdown menu.
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


    $.widget('neatline.configuremap', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this.content =              $('#configure-map');
            this.vectorColor =          this.content.find('input[name="default-vector-color"]');
            this.strokeColor =          this.content.find('input[name="default-stroke-color"]');
            this.highlightColor =       this.content.find('input[name="default-highlight-color"]');
            this.vectorOpacity =        this.content.find('input[name="default-vector-opacity"]');
            this.selectOpacity =        this.content.find('input[name="default-select-opacity"]');
            this.strokeOpacity =        this.content.find('input[name="default-stroke-opacity"]');
            this.graphicOpacity =       this.content.find('input[name="default-graphic-opacity"]');
            this.strokeWidth =          this.content.find('input[name="default-stroke-width"]');
            this.pointRadius =          this.content.find('input[name="default-point-radius"]');
            this.baseLayer =            this.content.find('select[name="base-layer"]');
            this.saveButton =           this.content.find('button.save');

            // Construct the dropdown manager and form widgets.
            this._constructDropdown();
            this._constructFormWidgets();

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         *
         * - return void.
         */
        _constructDropdown: function() {
            this.element.nlDropdown();
        },

        /*
         * Instantiate miniColors and integerDragger on the inputs.
         *
         * - return void.
         */
        _constructFormWidgets: function() {

            var self = this;

            // ** VECTOR COLOR.
            this.vectorColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('vectorcoloredit', {}, { 'color': hex });
                }

            });

            // ** STROKE COLOR.
            this.strokeColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('strokecoloredit', {}, { 'color': hex });
                }

            });

            // ** HIGHLIGHT COLOR.
            this.highlightColor.miniColors({

                // Change the color.
                change: function(hex, rgb) {
                    self._trigger('highlightcoloredit', {}, { 'color': hex });
                }

            });

            // ** VECTOR OPACITY.
            this.vectorOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('vectoropacityedit', {}, { 'value': obj.value });
                }
            });

            // ** SELECT OPACITY.
            this.selectOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('selectopacityedit', {}, { 'value': obj.value });
                }
            });

            // ** STROKE OPACITY.
            this.strokeOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('strokeopacityedit', {}, { 'value': obj.value });
                }
            });

            // ** GRAPHIC OPACITY.
            this.graphicOpacity.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 1,
                change: function(evt, obj) {
                    self._trigger('graphicopacityedit', {}, { 'value': obj.value });
                }
            });

            // ** STROKE WIDTH.
            this.strokeWidth.integerdragger({
                min: 0,
                def: 1,
                px_per_unit: 8,
                change: function(evt, obj) {
                    self._trigger('strokewidthedit', {}, { 'value': obj.value });
                }
            });

            // ** POINT RADIUS.
            this.pointRadius.integerdragger({
                min: 1,
                def: 6,
                px_per_unit: 8,
                change: function(evt, obj) {
                    self._trigger('pointradiusedit', {}, { 'value': obj.value });
                }
            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': function() {
                    self.postSettings();
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        /*
         * Get values out of inputs.
         *
         * - return object: The data.
         */
        _getData: function() {

            var data = {};

            data.exhibit_id =               Neatline.record.id;
            data.vector_color =             this.vectorColor.val();
            data.stroke_color =             this.strokeColor.val();
            data.highlight_color =          this.highlightColor.val();
            data.vector_opacity =           parseInt(this.vectorOpacity.val(), 10);
            data.select_opacity =           parseInt(this.selectOpacity.val(), 10);
            data.stroke_opacity =           parseInt(this.strokeOpacity.val(), 10);
            data.graphic_opacity =          parseInt(this.graphicOpacity.val(), 10);
            data.stroke_width =             parseInt(this.strokeWidth.val(), 10);
            data.point_radius =             parseInt(this.pointRadius.val(), 10);
            data.base_layer =               parseInt(this.baseLayer.val(), 10);

            return data;

        },

        /*
         * Commit the settings.
         *
         * - return void.
         */
        postSettings: function() {

            var self = this;

            // Get the settings.
            var data = this._getData();

            // Commit.
            $.ajax({

                url: 'ajax/mapsettings',
                type: 'POST',
                data: data,

                success: function() {
                    self._trigger('newdefaults');
                }

            });

        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return mixed: The attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });

})( jQuery );
;/**
 * Timeline dropdown menu.
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


    $.widget('neatline.configuretimeline', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this.content = $('#configure-timeline');
            this.bandActive = this.content.find('input[name="band-active"]');
            this.bandUnit = this.content.find('select[name="band-unit"]');
            this.bandHeight = this.content.find('input[name="band-height"]');
            this.saveButton = this.content.find('button.save');

            // Construct the dropdown manager and form widgets.
            this._constructDropdown();
            this._constructFormWidgets();

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         *
         * - return void.
         */
        _constructDropdown: function() {
            this.element.nlDropdown();
        },

        /*
         * Build integer dragger on height input.
         *
         * - return void.
         */
        _constructFormWidgets: function() {

            // ** BAND HEIGHT.
            this.bandHeight.integerdragger({
                min: 0,
                max: 100,
                px_per_unit: 2
            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': _.bind(function() {
                    this.postSettings();
                }, this),

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        /*
         * Get values out of inputs.
         *
         * - return object: The data.
         */
        _getData: function() {

            var data = {};

            data.exhibit_id =           Neatline.record.id;
            data.is_context_band =      this.bandActive.is(':checked') ? 1 : 0;
            data.context_band_unit =    this.bandUnit.val();
            data.context_band_height =  parseInt(this.bandHeight.val(), 10);

            return data;

        },

        /*
         * Commit the settings.
         *
         * - return void.
         */
        postSettings: function() {

            var self = this;

            // Get the settings.
            var data = this._getData();

            // Commit.
            $.ajax({

                url: 'ajax/timelinesettings',
                type: 'POST',
                data: data,

                success: function() {
                    self._trigger('newdefaults', {}, data);
                }

            });

        },

        /*
         * Emit a protected class attribute.
         *
         * - param string attr: The name of the attribute.
         *
         * - return mixed: The attribute.
         */
        getAttr: function(attr) {
            return this[attr];
        }

    });

})( jQuery );
;/**
 * Items dropdown menu.
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


    $.widget('neatline.configureitems', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this.content =              $('#configure-items');
            this.reorderButton =        this.content.find('button.loop');
            this.saveButton =           this.content.find('button.save');

            // Trackers.
            this._isOrdering = false;

            // Construct the dropdown manager and form widgets.
            this._constructDropdown();
            this._constructFormWidgets();

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         *
         * - return void.
         */
        _constructDropdown: function() {
            this.element.nlDropdown();
        },

        /*
         * Instantiate miniColors and integerDragger on the inputs.
         *
         * - return void.
         */
        _constructFormWidgets: function() {

            var self = this;

            // ** REORDER.
            this.reorderButton.bind({

                'mousedown': function() {

                    // End reorder.
                    if (self._isOrdering) {
                        self._trigger('endreorder');
                        self._isOrdering = false;
                        self.reorderButton.removeClass('btn-neatline');
                    }

                    // Start reorder.
                    else {
                        self._trigger('reorder');
                        self._isOrdering = true;
                        self.reorderButton.addClass('btn-neatline');
                    }

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // ** SAVE.
            this.saveButton.bind({

                'mousedown': function() {
                    self.saveOrder();
                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        /*
         * Set the order.
         *
         * - param object order: The order object.
         *
         * - return void.
         */
        setOrder: function(order) {
            this.order = order;
        },

        /*
         * Commit the order.
         *
         * - param object order: The order object.
         *
         * - return void.
         */
        saveOrder: function() {

            var self = this;

            // Get ordering.
            this._trigger('getorder');

            // Commit.
            $.ajax({

                url: 'ajax/order',
                type: 'POST',
                data: {
                    exhibit_id: Neatline.record.id,
                    order: this.order
                },

                success: function() {
                    self._trigger('neworder');
                }

            });

        }

    });

})( jQuery );
;/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Custom toggle button widget.
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
            this.enabled = true;
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

            if (this.enabled) {

                this.element.toggleClass('neatline-pressed');

                if (this.pressed) {
                    this._trigger('unpress');
                    this.pressed = false;
                } else {
                    this._trigger('press');
                    this.pressed = true;
                }

            }

        },

        disable: function() {

            this.enabled = false;
            this.element.css({
                'opacity': 0.5,
                'cursor': 'default'
            });

        },

        enable: function() {

            this.enabled = true;
            this.element.css({
                'opacity': 1,
                'cursor': 'pointer'
            });

        },

        isPressed: function() {

            return this.pressed;

        },

        _highlight: function() {

            this.element.toggleClass('neatline-highlighted');

        }

    });

})( jQuery );
;/**
 * Gradient builder application for item edit forms.
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


    $.widget('neatline.gradientbuilder', {

        options: {

            // CSS constants.
            css: {
                width_offset: 5
            }

        },

        /*
         * Get markup, shell out trackers, position the stop markers.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this.editor =                   this.element.find('.date-ambiguity-editor');
            this.leftMarker =               this.element.find('.stop-marker.left');
            this.rightMarker =              this.element.find('.stop-marker.right');
            this.swatches =                 this.element.find('.color-swatch')
            this.leftPercentInput =         this.element.find('input[name="left-ambiguity-percentage"]');
            this.rightPercentInput =        this.element.find('input[name="right-ambiguity-percentage"]');

            // Percentage trackers.
            this.leftPercent = parseInt(this.leftPercentInput.val());
            this.rightPercent = parseInt(this.rightPercentInput.val());

            // Measure markup.
            this.getDimensions();

            // Position the stop markers.
            this.positionMarkers(this.leftPercent, this.rightPercent);

            // Instantiate the span styler on the edit block.
            this.editor.spanstyler();

            // Add events to markers.
            this._addEvents();

        },

        /*
         * Get the size and position of the editor block.
         */
        getDimensions: function() {

            this.editorWidth = this.editor.width();
            this.editorHeight = this.editor.height();
            this.editorOffset = this.editor.offset();

        },

        /*
         * Set the starting positions of the markers. The percentage
         * parameters define the distance of the left and right markers
         * from the left boundary of the editor block as a percentage
         * of the total width.
         */
        positionMarkers: function(leftPercent, rightPercent) {

            // Calculate offets.
            var leftDecimal = leftPercent / 100;
            var rightDecimal = rightPercent / 100;
            var leftOffset = this.editorWidth * leftDecimal;
            var rightOffset = this.editorWidth - (this.editorWidth * rightDecimal);

            // Position.
            this.leftMarker.css({
                'left': leftOffset - this.options.css.width_offset,
                'top': this.editorHeight
            });

            this.rightMarker.css({
                'right': rightOffset - this.options.css.width_offset,
                'top': this.editorHeight
            });

            // Set the trackers and inputs.
            this.leftPercent = leftPercent;
            this.leftPercentInput.val(leftPercent);
            this.rightPercent = rightPercent;
            this.rightPercentInput.val(rightPercent);

        },

        /*
         * Set the base color of the editor block and the swatches.
         */
        setColor: function(color) {

            // Store the value.
            this.color = color;

            // Manifest the color on the block.
            this.editor.spanstyler('constructCss', color, this.leftPercent, this.rightPercent);
            this.editor.spanstyler('applyCss');

            // Change the colors of the stop markers.
            this.swatches.css('background', color);

        },

        /*
         * Recalculate the dimensions, push updated css.
         */
        refresh: function() {

            this.getDimensions();
            this.positionMarkers(this.leftPercent, this.rightPercent);
            this.setColor(this.color);

        },

        /*
         * Add the dragging functionality to the stop markers.
         */
        _addEvents: function() {

            var self = this;

            // Left handle.
            this.leftMarker.bind({
                'mousedown': function(e) {
                    self._doLeftDrag(e);
                }
            });

            // Right handle.
            this.rightMarker.bind({
                'mousedown': function(e) {
                    self._doRightDrag(e);
                }
            });

        },

        /*
         * Manifest a left stop marker drag.
         */
        _doLeftDrag: function(event) {

            var self = this;

            // Capture the starting mouse position and offset.
            var startingX = event.pageX;
            var startingOffset = this.__pxToInt(this.leftMarker.css('left'));

            // Add the mousemove event to the window.
            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offset.
                    var xDelta = e.pageX - startingX;
                    var newOffset = startingOffset + xDelta;
                    var newLeftPercent = self._leftPercentFromOffset(newOffset);

                    // If the new offset is in bounds.
                    if (newOffset + self.options.css.width_offset >= 0
                       && newLeftPercent < self.rightPercent-5) {

                        // Manifest new offest.
                        self.leftMarker.css('left', newOffset);

                    }

                    // If the drag extends beyond the position of the
                    // right dragger, fix the left dragger.
                    else if (newLeftPercent >= self.rightPercent-5) {
                        newOffset = ((self.rightPercent-5)/100) * self.editorWidth;
                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.width_offset);
                        self.leftMarker.css('left', newOffset);
                    }

                    // Register the new offest percentage and manifest
                    // the value in the hidden input.
                    self.leftPercent = self._leftPercentFromOffset(newOffset);
                    self.leftPercentInput.val(self.leftPercent);

                    // Build and apply the new css.
                    self.editor.spanstyler('constructCss', self.color, self.leftPercent, self.rightPercent);
                    self.editor.spanstyler('applyCss');

                    // Trigger the change out to the item editor.
                    self._trigger('stopHandleDrag', {}, {
                        'color': self.color,
                        'leftPercent': self.leftPercent,
                        'rightPercent': self.rightPercent
                    });

                },

                'mouseup': function() {

                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Manifest a right stop marker drag.
         */
        _doRightDrag: function(event) {

            var self = this;

            // Capture the starting mouse position and offset.
            var startingX = event.pageX;
            var startingOffset = this.__pxToInt(this.rightMarker.css('right'));

            // Add the mousemove event to the window.
            this._window.bind({

                'mousemove': function(e) {

                    // Calculate new offset.
                    var xDelta = e.pageX - startingX;
                    var newOffset = startingOffset - xDelta;
                    var newRightPercent = self._rightPercentFromOffset(newOffset);

                    // If the new offset is in bounds.
                    if (newOffset + self.options.css.width_offset >= 0
                       && newRightPercent > self.leftPercent+5) {

                        // Manifest new offest.
                        self.rightMarker.css('right', newOffset);

                    }

                    // If the drag extends beyond the position of the
                    // right dragger, fix the left dragger.
                    else if (newRightPercent <= self.leftPercent+5) {

                        // Get the offset of the right dragger.
                        newOffset = self.editorWidth -
                            (((self.leftPercent+5)/100) * self.editorWidth);

                        // Manifest.
                        self.rightMarker.css('right', newOffset);

                    }

                    // Otherwise, fix at zero.
                    else {
                        newOffset = -(self.options.css.width_offset);
                        self.rightMarker.css('right', newOffset);
                    }

                    // Register the new offest percentage and manifest
                    // the new value in the hidden input.
                    self.rightPercent = self._rightPercentFromOffset(newOffset);
                    self.rightPercentInput.val(self.rightPercent);

                    // Build and apply the new css.
                    self.editor.spanstyler('constructCss', self.color, self.leftPercent, self.rightPercent);
                    self.editor.spanstyler('applyCss');

                    // Trigger the change out to the item editor.
                    self._trigger('stopHandleDrag', {}, {
                        'color': self.color,
                        'leftPercent': self.leftPercent,
                        'rightPercent': self.rightPercent
                    });

                },

                'mouseup': function() {

                    self._window.unbind('mousemove mouseup');

                }

            });

        },

        /*
         * Given a left pixel offset, calculate the new relative
         * percentage of the left stop marker.
         */
        _leftPercentFromOffset: function(offset) {

            return Math.round(((offset + this.options.css.width_offset)
                    / this.editorWidth) * 100);

        },

        /*
         * Given a right pixel offset, calculate the new relative
         * percentage of the right stop marker.
         */
        _rightPercentFromOffset: function(offset) {

            return Math.round(((this.editorWidth - offset - this.options.css.width_offset)
                    / this.editorWidth) * 100);

        },

        /*
         * Extract an integer value from a css string value of format 'Xpx'.
         * No, jQuery does not provide this.
         */
        __pxToInt: function(px) {

            // Find the location of the 'px'.
            var pxIndex = px.indexOf('px');
            return parseInt(px.slice(0, pxIndex));

        }

    });


})( jQuery );
;/**
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
;/**
 * A simple gloss on a text input that lets the user click and drag up
 * or down to change the integer value of the input.
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


    $.widget('neatline.integerdragger', {

        options: {

            // The minimum possible value. If null, -inf.
            min: null,

            // The maximum possible value. If null, +inf.
            max: null,

            // The default value.
            def: 0,

            // Pixels of cursor movement per integer change.
            px_per_unit: 5,

            // Tooltip parameters.
            tip: {

                // Enable/disable.
                show: true,

                // Content.
                text: 'click and drag',

                // Left padding.
                padding: 10,

                // Element class.
                'class': 'intdragger-tooltip'

            }

        },

        /*
         * Set starting value, call methods to bind events.
         *
         * - return void.
         */
        _create: function() {

            // Get markup.
            this._body =        $('body');
            this._window =      $(window);

            // Trackers.
            this.currentVal = null;
            this.isDragging = false;

            // Set the starting value.
            this._setStartingValue();

            // Build the tooltip.
            if (this.options.tip.show) {
                this._buildToolTip();
            }

            // Bind listeners.
            this._addEvents();

        },

        /*
         * Construct and measure the tooltip.
         *
         * - return void.
         */
        _buildToolTip: function() {

            // Construct.
            this.tip = $('<span></span>')
                .addClass(this.options.tip['class'])
                .text(this.options.tip.text)
                .css('position', 'absolute');

            // Measure.
            this.tipHeight = this._measureToolTip();
            this.inputHeight = this.element.outerHeight(false);
            this.inputWidth = this.element.outerWidth();

        },

        /*
         * Listen for mouseenter, mouseleave, mousedown, mouseup and drag.
         *
         * - return void.
         */
        _addEvents: function() {

            var self = this;

            this.element.bind({

                // Show the tooltip.
                'mouseenter': function() {
                    if (self.options.tip.show && !self.isDragging) {
                        self._showToolTip();
                    }
                },

                // Hide the tooltip.
                'mouseleave': function() {
                    if (self.options.tip.show && !self.isDragging) {
                        self._hideToolTip();
                    }
                },

                // Listen for keystroke.
                'keyup': function() {

                    // Get element value.
                    var value = self.element.val();

                    // Apply value.
                    if (value !== '') {
                        self._setInputValue(
                            parseInt(self.element.val(), 10)
                        );
                    }

                },

                // Listen for drag.
                'mousedown': function(e) {

                    // Set dragging tracker.
                    self.isDragging = true;

                    // Capture starting y-offset and value.
                    var startY = e.pageY;
                    var startVal = parseInt(self.element.val(), 10);

                    self._window.bind({

                        // On move, compute y-delta and apply.
                        'mousemove': function(e) {
                            var yDelta = (startY - e.pageY) / self.options.px_per_unit;
                            self._setInputValue(startVal + Math.round(yDelta));
                        },

                        // Strip drag listener
                        'mouseup': function() {
                            self.isDragging = false;
                            self._window.unbind('mousemove');
                            if (self.options.tip.show) {
                                self._hideToolTip();
                            }
                        }

                    });

                }

            });

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Set the starting value. If there is a value in the input when
         * the widget is instantiated, try to use the existing value.
         * Otherwise, revent to the default in the options.
         *
         * - return void.
         */
        _setStartingValue: function() {

            // Get val.
            var val = this.element.val();

            // If integer, set.
            if (!isNaN(parseInt(val))) {
                this._setInputValue(val);
            }

            // Otherwise, revent to default.
            else {
                this._setInputValue(this.options.def);
            }

        },

        /*
         * Set the input's value, update tracker.
         *
         * - param integer val: The value.
         *
         * - return boolean: True if the value is permissible and the
         *   change is manifested, False if the value is impermissible.
         */
        _setInputValue: function(val) {

            // If a min is set, and the passed val is too small.
            if (this.options.min != null && val < this.options.min) {
                this.element.val(this.options.min);
                this.currentVal = this.options.min;
                return false;
            }

            // If a max is set, and the passed val is too large.
            else if (this.options.max != null && val > this.options.max) {
                this.element.val(this.options.max);
                this.currentVal = this.options.max;
                return false;
            }

            // If the passed value is NaN, set default.
            else if (_.isNaN(val)) {
                this.element.val(this.options.def);
                this.currentVal = this.options.def;
                return false;
            }

            // If passed val is permissible.
            this.element.val(val);
            this.currentVal = val;

            // Emit new value.
            this._trigger('change', {}, {
                value: this.currentVal
            });

            return true;

        },

        /*
         * Compute the height of the tooltip.
         *
         * - return integer: The height of the tip.
         */
        _measureToolTip: function() {

            // Inject, measure, detach.
            this.tip.css({ top: -1000, left: -1000 })
                .appendTo(this._body);

            return this.tip.height();

        },

        /*
         * Show the instruction tooltip to the right of the input.
         *
         * - return void.
         */
        _showToolTip: function() {

            // Get input offset, compute tip top offset.
            var elOff = this.element.offset();
            var topOffset = ((this.inputHeight - this.tipHeight) / 2);

            // Position.
            this.tip.css({
                top: elOff.top + topOffset,
                left: elOff.left + this.inputWidth + this.options.tip.padding,
                opacity: 0
            });

            // Inject and show.
            this._body.append(this.tip);
            this.tip.animate({ opacity: 1 }, 200)

        },

        /*
         * Destroy the instruction tooltip.
         *
         * - return void.
         */
        _hideToolTip: function() {

            var self = this;

            this.tip.animate({ opacity: 0 }, 200, function() {
                self.tip.remove();
            })

        }

    });


})( jQuery );
;/**
 * Widget instantiations for the Neatline editor.
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

jQuery(document).ready(function($) {


    // Get markup.
    var neatlineContainer =         $('#neatline');
    var editorContainer =           $('#item-browser');
    var configureLayoutButton =     $('#configure-layout-button');
    var configureMapButton =        $('#configure-map-button');
    var configureTimelineButton =   $('#configure-timeline-button');
    var configureItemsButton =      $('#configure-items-button');


    /*
     * =================
     * Item browser.
     * =================
     */


    editorContainer.itembrowser({

        'neatlineready': function() {

            /*
             * =================
             * neatline.
             * =================
             */

            neatlinecontainer.neatline({

                'ispublic': false,

                // when the user clicks on an item on the timeline.
                'timelineeventclick': function(event, obj) {

                    // show the edit form.
                    editorcontainer.itembrowser(
                        'showformbyrecordid',
                        obj.recordid,
                        true,
                        false,
                        true);

                },

                // when the user clicks on a feature on the map.
                'mapfeatureclick': function(event, obj) {

                    // show the edit form.
                    editorcontainer.itembrowser(
                        'showformbyrecordid',
                        obj.recordid,
                        false,
                        true,
                        true);

                },

                // when the user clicks on an item in the sequencing tray.
                'itemclick': function(event, obj) {

                    // show the edit form.
                    editorcontainer.itembrowser(
                        'showformbyrecordid',
                        obj.recordid,
                        true,
                        true,
                        obj.scrollitems);

                },

                // when a geometry vector is added to the map.
                'mapfeatureadded': function(event, obj) {

                    // update the geocoverage textarea.
                    editorcontainer.itembrowser('updategeocoverage', obj.geocoverage);

                },

                // when the item tray is reloaded.
                'newitems': function() {

                    // get the current edit item on the browser.
                    var editid = editorcontainer.itembrowser('getcurrenteditid');

                    // if there is an active edit form.
                    if (editid) {
                        neatlinecontainer.neatline('showitemdescription', editid);
                    }

                },

                // when the viewport dimensions are dragged.
                'widthdrag': function(event, obj) {
                    configurelayoutbutton.configurelayout(
                        'setviewportproportions',
                        obj.h_percent,
                        obj.v_percent
                    );
                }

            });

            neatlinecontainer.on({
                'drawingmodeon': function() {
                    var ec = editorcontainer.data('itembrowser');
                    if (ec.editform != null) {
                        ec.editform.itemform('lockform');
                    }
                },
                'drawingmodeoff': function() {
                    var ec = editorcontainer.data('itembrowser');
                    if (ec.editform != null) {
                        ec.editform.itemform('unlockform');
                    }
                }
            });

        },

        // When the window has been reisized and the Neatline blocks
        // need to be repositioned.
        'reposition': function() {
            neatlineContainer.neatline('positionDivs');
            neatlineContainer.neatline('positionBlockMarkup');
        },

        // When an item form is opened and the item's vector becomes
        // available for editing.
        'mapedit': function(event, obj) {
            neatlineContainer.neatline('editMap', obj.item, obj.immediate);
        },

        // When vector data is added to the map, and then the item
        // form is closed without saving.
        'endmapedit': function(event, obj) {
            neatlineContainer.neatline('endMapEditWithoutSave', obj.immediate);
        },

        // After an edit form save, reload viewport data.
        'savecomplete': function() {
            neatlineContainer.neatline('reloadTimeline');
            neatlineContainer.neatline('reloadMap');
            neatlineContainer.neatline('reloadItems');
        },

        // When an item edit form is opened, focus the map and timeline
        // on the data corresponding to the item, if plotted data exists.
        'itemedit': function(event, obj) {

            if (obj.scrollMap) {
                // Focus the map.
                neatlineContainer.neatline('zoomMapToItemVectors', obj.recordid);
            }

            if (obj.scrollTimeline) {
                // Focus the timeline.
                neatlineContainer.neatline('zoomTimelineToEvent', obj.recordid);
            }

            if (obj.focusItems) {
                // Focus the items tray.
                neatlineContainer.neatline('showItemDescription', obj.recordid);
            }

        },

        // When the fill color picker value is changed, push the new color onto
        // the item's vectors.
        'vectorcoloredit': function(event, obj) {
            neatlineContainer.neatline('setItemVectorColor', obj.color, obj.recordid);
        },

        // When the stroke color picker value is changed, push the new color onto
        // the item's vectors.
        'strokecoloredit': function(event, obj) {
            neatlineContainer.neatline('setItemStrokeColor', obj.color);
        },

        // When the stroke color picker value is changed, push the new color onto
        // the item's vectors.
        'highlightcoloredit': function(event, obj) {
            neatlineContainer.neatline('setItemHighlightColor', obj.color);
        },

        // When the vector opacity dragger is changed, push the value onto the
        // item's vectors.
        'vectoropacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemVectorOpacity', obj.value);
        },

        // When the stroke opacity dragger is changed, push the value onto the
        // item's vectors.
        'strokeopacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemStrokeOpacity', obj.value);
        },

        // When the stroke opacity dragger is changed, push the value onto the
        // item's vectors.
        'graphicopacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemGraphicOpacity', obj.value);
        },

        // When the stroke width dragger is changed, push the value onto the
        // item's vectors.
        'strokewidthedit': function(event, obj) {
            neatlineContainer.neatline('setItemStrokeWidth', obj.value);
        },

        // When the point radius dragger is changed, push the value onto the
        // item's vectors.
        'pointradiusedit': function(event, obj) {
            neatlineContainer.neatline('setItemPointRadius', obj.value);
        },

        // When date ambiguity sliders are changed in an item edit form.
        'ambiguityChange': function(event, obj) {

            neatlineContainer.neatline(
                'setDateAmbiguity',
                obj.recordid,
                obj.color,
                obj.leftPercent,
                obj.rightPercent);

        },

        // When the fix item-specific map focus button is pressed, get
        // the map center and pass to the ajax interface in the form.
        'savemapfocus': function() {

            // Get the map extent and zoom.
            var mapCenter = neatlineContainer.neatline('getMapCenter');
            var mapZoom = neatlineContainer.neatline('getMapZoom');

            // Set.
            editorContainer.itembrowser('saveMapFocus', mapCenter, mapZoom);

        },

        // When the save button is clicked, get the coverage data.
        'saveform': function() {

            // Get the map extent and zoom.
            var coverage = neatlineContainer.neatline('getWktForSave');

            // Post the data.
            editorContainer.itembrowser('saveForm', coverage);

        }

    });


    /*
     * =================
     * Dropdown menus.
     * =================
     */


    // Configure layout.
    configureLayoutButton.configurelayout({

        // When the 'Fix starting viewport positions' button is pushed.
        'savepositions': function() {

            // Get the map extent, zoom, and layer.
            var mapCenter = neatlineContainer.neatline('getMapCenter');
            var mapZoom = neatlineContainer.neatline('getMapZoom');
            var mapLayer = neatlineContainer.neatline('getMapBaseLayer');

            // Get the timeline center date and zoom.
            var timelineCenter =    neatlineContainer.neatline('getTimelineCenter');
            var timelineZoom =      neatlineContainer.neatline('getTimelineZoom');

            // Save.
            configureLayoutButton.configurelayout(
                'savePositions',
                mapCenter,
                mapZoom,
                mapLayer,
                timelineCenter,
                timelineZoom
            );

        },

        // When a new arrangement is saved and NL blocks need to be repositioned
        // to manifest the change.
        'newarrangement': function(event, obj) {

            // Reset the core attributes object and reposition.
            neatlineContainer.neatline('setParams', obj.params);
            neatlineContainer.neatline('positionDivs');
            neatlineContainer.neatline('positionBlockMarkup');
            neatlineContainer.neatline('instantiateBlocks');
            neatlineContainer.neatline('saveSuccess');

        },

        // When new starting positions are fixed, do success flash.
        'newpositions': function() {
            neatlineContainer.neatline('saveSuccess');
        },

        // When the width of the viewports is dragged.
        'widthDrag': function(event, obj) {
            neatlineContainer.neatline(
                'applyViewportProportions',
                obj.h_percent,
                obj.v_percent
            );
        }

    });

    // Configure map.
    configureMapButton.configuremap({

        // Manifest new default vector fill color.
        'vectorcoloredit': function(event, obj) {
            neatlineContainer.neatline('setDefaultVectorColor', obj.color);
        },

        // Manifest new default stroke color.
        'strokecoloredit': function(event, obj) {
            neatlineContainer.neatline('setDefaultStrokeColor', obj.color);
        },

        // Manifest new default highlight color.
        'highlightcoloredit': function(event, obj) {
            neatlineContainer.neatline('setDefaultHighlightColor', obj.color);
        },

        // Manifest new default vector opacity.
        'vectoropacityedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultVectorOpacity', obj.value);
        },

        // Manifest new default stroke opacity.
        'strokeopacityedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultStrokeOpacity', obj.value);
        },

        // Manifest new default graphic opacity.
        'graphicopacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemGraphicOpacity', obj.value);
        },

        // Manifest new default stroke width.
        'strokewidthedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultStrokeWidth', obj.value);
        },

        // Manifest new default point radius.
        'pointradiusedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultPointRadius', obj.value);
        },

        // When new defaults have been successfully committed.
        'newdefaults': function(event, obj) {
            neatlineContainer.neatline('saveSuccess');
            editorContainer.itembrowser('reloadItemForm');
        }

    });

    // Configure timeline.
    configureTimelineButton.configuretimeline({

        // When new defaults have been successfully committed.
        'newdefaults': function(event, obj) {
            neatlineContainer.neatline('saveSuccess');
            neatlineContainer.neatline('renderTimelineDefaults', 
                obj.context_band_height,
                obj.context_band_unit,
                obj.is_context_band
            );
        }

    });

    // Configure items.
    configureItemsButton.configureitems({

        // Put the item try into reorder mode.
        'reorder': function() {
            neatlineContainer.neatline('reorderItems');
        },

        // Get ordering.
        'getorder': function() {
            var order = neatlineContainer.neatline('getOrder');
            configureItemsButton.configureitems('setOrder', order);
        },

        // End reordering session and set new order.
        'endreorder': function() {
            var order = neatlineContainer.neatline('endReorderItems');
            configureItemsButton.configureitems('setOrder', order);
        },

        // When a order save succeeds.
        'neworder': function(event, obj) {
            neatlineContainer.neatline('saveSuccess');
        }

    });

    var radioSet = [
        configureLayoutButton.data('configurelayout').element.data('nlDropdown'),
        configureMapButton.data('configuremap').element.data('nlDropdown'),
        configureTimelineButton.data('configuretimeline').element.data('nlDropdown'),
        configureItemsButton.data('configureitems').element.data('nlDropdown')
    ];
    var i, rslen;

    _.each(radioSet, function(r) {
        r.setRadioDropdowns(radioSet);
    });

});
;if(jQuery)(function($){$.extend($.fn,{miniColors:function(o,data){var create=function(input,o,data){var color=cleanHex(input.val());if(!color)color='FFFFFF';var hsb=hex2hsb(color);var trigger=$('<a class="miniColors-trigger" style="background-color: #'+color+'" href="#"></a>');trigger.insertAfter(input);input.addClass('miniColors').attr('maxlength',7).attr('autocomplete','off');input.data('trigger',trigger);input.data('hsb',hsb);if(o.change)input.data('change',o.change);if(o.readonly)input.attr('readonly',true);if(o.disabled)disable(input);trigger.bind('click.miniColors',function(event){event.preventDefault();input.trigger('focus');});input.bind('focus.miniColors',function(event){show(input);});input.bind('blur.miniColors',function(event){var hex=cleanHex(input.val());input.val(hex?'#'+hex:'');});input.bind('keydown.miniColors',function(event){if(event.keyCode===9)hide(input);});input.bind('keyup.miniColors',function(event){var filteredHex=input.val().replace(/[^A-F0-9#]/ig,'');input.val(filteredHex);if(!setColorFromInput(input)){input.data('trigger').css('backgroundColor','#FFF');}});input.bind('paste.miniColors',function(event){setTimeout(function(){input.trigger('keyup');},5);});};var destroy=function(input){hide();input=$(input);input.data('trigger').remove();input.removeAttr('autocomplete');input.removeData('trigger');input.removeData('selector');input.removeData('hsb');input.removeData('huePicker');input.removeData('colorPicker');input.removeData('mousebutton');input.removeData('moving');input.unbind('click.miniColors');input.unbind('focus.miniColors');input.unbind('blur.miniColors');input.unbind('keyup.miniColors');input.unbind('keydown.miniColors');input.unbind('paste.miniColors');$(document).unbind('mousedown.miniColors');$(document).unbind('mousemove.miniColors');};var enable=function(input){input.attr('disabled',false);input.data('trigger').css('opacity',1);};var disable=function(input){hide(input);input.attr('disabled',true);input.data('trigger').css('opacity',.5);};var show=function(input){if(input.attr('disabled'))return false;hide();var selector=$('<div class="miniColors-selector"></div>');selector.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>');selector.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>');selector.css({top:input.is(':visible')?input.offset().top+input.outerHeight():input.data('trigger').offset().top+input.data('trigger').outerHeight(),left:input.is(':visible')?input.offset().left:input.data('trigger').offset().left,display:'none'}).addClass(input.attr('class'));var hsb=input.data('hsb');selector.find('.miniColors-colors').css('backgroundColor','#'+hsb2hex({h:hsb.h,s:100,b:100}));var colorPosition=input.data('colorPosition');if(!colorPosition)colorPosition=getColorPositionFromHSB(hsb);selector.find('.miniColors-colorPicker').css('top',colorPosition.y+'px').css('left',colorPosition.x+'px');var huePosition=input.data('huePosition');if(!huePosition)huePosition=getHuePositionFromHSB(hsb);selector.find('.miniColors-huePicker').css('top',huePosition.y+'px');input.data('selector',selector);input.data('huePicker',selector.find('.miniColors-huePicker'));input.data('colorPicker',selector.find('.miniColors-colorPicker'));input.data('mousebutton',0);$('BODY').append(selector);selector.fadeIn(100);selector.bind('selectstart',function(){return false;});$(document).bind('mousedown.miniColors',function(event){input.data('mousebutton',1);if($(event.target).parents().andSelf().hasClass('miniColors-colors')){event.preventDefault();input.data('moving','colors');moveColor(input,event);}
if($(event.target).parents().andSelf().hasClass('miniColors-hues')){event.preventDefault();input.data('moving','hues');moveHue(input,event);}
if($(event.target).parents().andSelf().hasClass('miniColors-selector')){event.preventDefault();return;}
if($(event.target).parents().andSelf().hasClass('miniColors'))return;hide(input);});$(document).bind('mouseup.miniColors',function(event){input.data('mousebutton',0);input.removeData('moving');});$(document).bind('mousemove.miniColors',function(event){if(input.data('mousebutton')===1){if(input.data('moving')==='colors')moveColor(input,event);if(input.data('moving')==='hues')moveHue(input,event);}});};var hide=function(input){if(!input)input='.miniColors';$(input).each(function(){var selector=$(this).data('selector');$(this).removeData('selector');$(selector).fadeOut(100,function(){$(this).remove();});});$(document).unbind('mousedown.miniColors');$(document).unbind('mousemove.miniColors');};var moveColor=function(input,event){var colorPicker=input.data('colorPicker');colorPicker.hide();var position={x:event.clientX-input.data('selector').find('.miniColors-colors').offset().left+$(document).scrollLeft()-5,y:event.clientY-input.data('selector').find('.miniColors-colors').offset().top+$(document).scrollTop()-5};if(position.x<=-5)position.x=-5;if(position.x>=144)position.x=144;if(position.y<=-5)position.y=-5;if(position.y>=144)position.y=144;input.data('colorPosition',position);colorPicker.css('left',position.x).css('top',position.y).show();var s=Math.round((position.x+5)*.67);if(s<0)s=0;if(s>100)s=100;var b=100-Math.round((position.y+5)*.67);if(b<0)b=0;if(b>100)b=100;var hsb=input.data('hsb');hsb.s=s;hsb.b=b;setColor(input,hsb,true);};var moveHue=function(input,event){var huePicker=input.data('huePicker');huePicker.hide();var position={y:event.clientY-input.data('selector').find('.miniColors-colors').offset().top+$(document).scrollTop()-1};if(position.y<=-1)position.y=-1;if(position.y>=149)position.y=149;input.data('huePosition',position);huePicker.css('top',position.y).show();var h=Math.round((150-position.y-1)*2.4);if(h<0)h=0;if(h>360)h=360;var hsb=input.data('hsb');hsb.h=h;setColor(input,hsb,true);};var setColor=function(input,hsb,updateInputValue){input.data('hsb',hsb);var hex=hsb2hex(hsb);if(updateInputValue)input.val('#'+hex);input.data('trigger').css('backgroundColor','#'+hex);if(input.data('selector'))input.data('selector').find('.miniColors-colors').css('backgroundColor','#'+hsb2hex({h:hsb.h,s:100,b:100}));if(input.data('change')){input.data('change').call(input,'#'+hex,hsb2rgb(hsb));}};var setColorFromInput=function(input){var hex=cleanHex(input.val());if(!hex)return false;var hsb=hex2hsb(hex);var currentHSB=input.data('hsb');if(hsb.h===currentHSB.h&&hsb.s===currentHSB.s&&hsb.b===currentHSB.b)return true;var colorPosition=getColorPositionFromHSB(hsb);var colorPicker=$(input.data('colorPicker'));colorPicker.css('top',colorPosition.y+'px').css('left',colorPosition.x+'px');var huePosition=getHuePositionFromHSB(hsb);var huePicker=$(input.data('huePicker'));huePicker.css('top',huePosition.y+'px');setColor(input,hsb,false);return true;};var getColorPositionFromHSB=function(hsb){var x=Math.ceil(hsb.s/.67);if(x<0)x=0;if(x>150)x=150;var y=150-Math.ceil(hsb.b/.67);if(y<0)y=0;if(y>150)y=150;return{x:x-5,y:y-5};}
var getHuePositionFromHSB=function(hsb){var y=150-(hsb.h/2.4);if(y<0)h=0;if(y>150)h=150;return{y:y-1};}
var cleanHex=function(hex){hex=hex.replace(/[^A-Fa-f0-9]/,'');if(hex.length==3){hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
return hex.length===6?hex:null;};var hsb2rgb=function(hsb){var rgb={};var h=Math.round(hsb.h);var s=Math.round(hsb.s*255/100);var v=Math.round(hsb.b*255/100);if(s==0){rgb.r=rgb.g=rgb.b=v;}else{var t1=v;var t2=(255-s)*v/255;var t3=(t1-t2)*(h%60)/60;if(h==360)h=0;if(h<60){rgb.r=t1;rgb.b=t2;rgb.g=t2+t3;}
else if(h<120){rgb.g=t1;rgb.b=t2;rgb.r=t1-t3;}
else if(h<180){rgb.g=t1;rgb.r=t2;rgb.b=t2+t3;}
else if(h<240){rgb.b=t1;rgb.r=t2;rgb.g=t1-t3;}
else if(h<300){rgb.b=t1;rgb.g=t2;rgb.r=t2+t3;}
else if(h<360){rgb.r=t1;rgb.g=t2;rgb.b=t1-t3;}
else{rgb.r=0;rgb.g=0;rgb.b=0;}}
return{r:Math.round(rgb.r),g:Math.round(rgb.g),b:Math.round(rgb.b)};};var rgb2hex=function(rgb){var hex=[rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];$.each(hex,function(nr,val){if(val.length==1)hex[nr]='0'+val;});return hex.join('');};var hex2rgb=function(hex){var hex=parseInt(((hex.indexOf('#')>-1)?hex.substring(1):hex),16);return{r:hex>>16,g:(hex&0x00FF00)>>8,b:(hex&0x0000FF)};};var rgb2hsb=function(rgb){var hsb={h:0,s:0,b:0};var min=Math.min(rgb.r,rgb.g,rgb.b);var max=Math.max(rgb.r,rgb.g,rgb.b);var delta=max-min;hsb.b=max;hsb.s=max!=0?255*delta/max:0;if(hsb.s!=0){if(rgb.r==max){hsb.h=(rgb.g-rgb.b)/delta;}else if(rgb.g==max){hsb.h=2+(rgb.b-rgb.r)/delta;}else{hsb.h=4+(rgb.r-rgb.g)/delta;}}else{hsb.h=-1;}
hsb.h*=60;if(hsb.h<0){hsb.h+=360;}
hsb.s*=100/255;hsb.b*=100/255;return hsb;};var hex2hsb=function(hex){var hsb=rgb2hsb(hex2rgb(hex));if(hsb.s===0)hsb.h=360;return hsb;};var hsb2hex=function(hsb){return rgb2hex(hsb2rgb(hsb));};switch(o){case'readonly':$(this).each(function(){$(this).attr('readonly',data);});return $(this);break;case'disabled':$(this).each(function(){if(data){disable($(this));}else{enable($(this));}});return $(this);case'value':$(this).each(function(){$(this).val(data).trigger('keyup');});return $(this);break;case'destroy':$(this).each(function(){destroy($(this));});return $(this);default:if(!o)o={};$(this).each(function(){if($(this)[0].tagName.toLowerCase()!=='input')return;if($(this).data('trigger'))return;create($(this),o,data);});return $(this);}}});})(jQuery);