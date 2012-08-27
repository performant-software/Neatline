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
