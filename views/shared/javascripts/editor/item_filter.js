/*
 * Item filter dropdown in the Neatline editor.
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


    $.widget('neatline.itemfilter', {

        options: {

            // Durations and CSS constants.
            fade_duration: 400,
            bottom: 75,
            header: 40,

            // Hexes.
            colors: {
                purple: '#724E85',
                hover_gray: '#EEEEEE',
                default_gray: '#F5F5F5'
            }

        },

        /*
         * Get markup and run preparatory routines.
         */
        _create: function() {

            // Getters.
            this._window =                  $(window);
            this._body =                    $('body');
            this.topbar =                   $('#topbar');
            this.container =                $('#item-browser');
            this.dropdown =                 $('#filter-items');
            this.tab =                      $('#filter-items-tab');
            this.tabLink =                  this.tab.find('a');

            // Initialize tracker object for the selections.
            this.selected = {
                tags: [],
                types: [],
                collections: [],
                all: false
            };

            // Get the containers for the checkbox columns.
            this.tagsContainer =            $('div.filter-items-column.tags');
            this.typesContainer =           $('div.filter-items-column.types');
            this.collectionsContainer =     $('div.filter-items-column.collections');

            // Get the container divs for the taxonomy headers.
            this.allNoneContainer =         $('div.filter-option.all-none');
            this.allTagsContainer =         this.tagsContainer.find('.filter-header');
            this.allTypesContainer =        this.typesContainer.find('.filter-header');
            this.allCollectionsContainer =  this.collectionsContainer.find('.filter-header');

            // Get the inputs divs for the taxonomy headers.
            this.allNoneInput =             this.allNoneContainer.find('input');
            this.allTagsInput =             this.allTagsContainer.find('input');
            this.allTypesInput =            this.allTypesContainer.find('input');
            this.allCollectionsInput =      this.allCollectionsContainer.find('input');

            // Get the container divs for the individual options.
            this.tags =                     this.tagsContainer.find('.filter-option');
            this.types =                    this.typesContainer.find('.filter-option');
            this.collections =              this.collectionsContainer.find('.filter-option');

            // Get the individual checkbox inputs.
            this.tagsInputs =               this.tagsContainer.find('.filter-option input');
            this.typesInputs =              this.typesContainer.find('.filter-option input');
            this.collectionsInputs =        this.collectionsContainer.find('.filter-option input');

            this.allInputs = this.allNoneInput
                .add(this.allTagsInput)
                .add(this.tagsInputs)
                .add(this.allTypesInput)
                .add(this.typesInputs)
                .add(this.allCollectionsInput)
                .add(this.collectionsInputs);

            this.allIndividualInputs = this.tags
                .add(this.types)
                .add(this.collections);

            // Status tracker starters.
            this._isOnDropdown =            false;
            this._isOnTab =                 false;
            this._isExpanded =              false;
            this._allChecked =              false;
            this._allTagsChecked =          false;
            this._allTypesChecked =         false;
            this._allCollectionsChecked =   false;

            // Measure markup, position divs, add events.
            this._getDimensions();
            this._positionDivs();
            this._glossTab();
            this._addCheckBoxEvents();

            // By default, check all the boxes.
            this.allNoneInput.trigger('mousedown');

        },

        /*
         * Measure the offset of the tab and the size of the dropdown.
         */
        _getDimensions: function() {

            // Get the position and size of the tab.
            this.tabOffset = this.tab.offset();
            this.tabHeight = this.tab.height();

            // Measure the topbar.
            this.topBarHeight = this.topbar.height();

            // Measure the stack, top offset, and window.
            this.totalHeight = this.element.height();
            this.topOffset = this.tabOffset.top + this.tabHeight;

            // Get the dropdown height.
            this._getHeight();

        },

        /*
         * Calculate an adjusted height for the dropdown that will fit
         * into the vertical space available.
         */
        _getHeight: function() {

            // Measure the window.
            this.windowHeight = this._window.height();

            // Calculate the maximum height given the current size of the window.
            this.maxHeight = this.windowHeight - this.options.header -
                this.options.bottom;

            // Set the height based on the amount of space available.
            if (this.totalHeight > this.maxHeight) {
                this.height = this.maxHeight;
                this.element.css('border-bottom', '1px solid #d2d2d2');
            } else {
                this.height = this.totalHeight;
                this.element.css('border-bottom', 'none');
            }

            // Set the collapsed top target.
            this.collapsedTop = -(this.height - this.tabHeight);

        },

        /*
         * Set the starting contracted position for the stack.
         */
        _positionDivs: function() {

            // Position the stack.
            this.element.css({
                'left': this.tabOffset.left,
                'top': this.collapsedTop
            });

        },

        /*
         * Attach event listeners to the tab.
         */
        _glossTab: function() {

            var self = this;

            // Gloss the 'Filter Items' tab.
            this.tab.bind({

                'mousedown': function() {

                    // If hidden, show.
                    if (!self._isExpanded) {
                        self.show();
                        self.tabLink.css('background', self.options.colors.hover_gray);
                    }

                    // If exapnded, hide.
                    else {
                        self.hide();
                        self.tabLink.css('background', self.options.colors.default_gray);
                    }

                },

                // Track cursor enter/exit on the tab.
                'mouseenter': function() {
                    self._isOnTab = true;
                },

                'mouseleave': function() {
                    self._isOnTab = false;
                }

            });

            // Track cursor enter/exit on the stack.
            this.dropdown.bind({

                'mouseenter': function() {
                    self._isOnDropdown = true;
                },

                'mouseleave': function() {
                    self._isOnDropdown = false;
                }

            });

            // Listen for window clicks and resize.
            this._window.bind({

                'mousedown': function() {

                    if (!self._isOnDropdown && !self._isOnTab && self._isExpanded) {
                          self.hide();
                          self.tabLink.css('background',self.options.colors.default_gray);
                    }

                },

                'resize': function() {
                    self.resize();
                }

            });

        },

        /*
         * Expand the stack.
         */
        show: function() {

            var self = this;

            // Calculate the height.
            this._getDimensions();
            this._positionDivs();

            // Show and set height.
            this.element.css({
                'display': 'block',
                'height': this.height
            });

            // Animate.
            this.element.stop().animate({
                'top': this.options.header + this.topBarHeight - 1
            }, this.options.fade_duration, function() {

                // Add the scrollbar.
                if (self.totalHeight > self.maxHeight) {
                    self._addScrollbar();
                    self.element.smallscroll('positionBar');
                }

            });

            // Register the show.
            this._isExpanded = true;

        },

        /*
         * Reposition the stack on window resize.
         */
        resize: function() {

            // Calculate the height.
            this._getHeight();

            // Reset the height.
            this.element.css('height', this.height);

            // Reposition the bar.
            this.element.smallscroll('positionBar');
            this.element.smallscroll('scrollContent');

        },

        /*
         * Contract the stack.
         */
        hide: function() {

            var self = this;

            // Register the hide.
            this._isExpanded = false;

            // Hide.
            this.element.stop().animate({
                'top': this.collapsedTop
            }, this.options.fade_duration, function() {
                self.element.css('display', 'none');
            });

        },

        /*
         * Instantiate smallscroll on the stack.
         */
        _addScrollbar: function() {

            this.element.smallscroll();

        },

        /*
         * Push or pop a tag/type/collection in or out of the selection.
         */
        _addCheckBoxEvents: function() {

            var self = this;

            // Toggle individual boxes.
            $.each(this.allIndividualInputs, function(i, input) {

                input = $(input);
                var checkbox = input.find('input');

                // Add the mousedown event to the whole element.
                input.bind({

                    'mousedown': function() {

                        // Check the box, call method push on or off
                        // the record id in the tracker object, trigger
                        // the selection change event.
                        var val = checkbox.prop('checked');
                        checkbox.prop('checked', !val);
                        self._toggleArrayMembership(input, !val);

                        self.selected.all = false;
                        self._trigger('selectionchange', null, self.selected);

                    },

                    'click': function(event) {
                        event.preventDefault();
                    }

                });

            });

            // Toggle all / none.
            $(this.allNoneContainer, this.allNoneInput).bind({

                'mousedown': function() {

                    // Check or uncheck all, and switch the tracker.
                    var newValue = !self.allChecked;
                    self.allInputs.prop('checked', newValue);
                    self.allChecked = newValue;

                    // Update the component trackers.
                    self.allTagsChecked = self.allChecked;
                    self.allTypesChecked = self.allChecked;
                    self.allCollectionsChecked = self.allChecked;

                    // Update the tracker array for each of the inputs.
                    $.each(self.allInputs, function(i, input) {
                        self._toggleArrayMembership($(input), newValue);
                    });

                    // Update the all-selected tracker.
                    self.selected.all = self.allChecked;

                    // Trigger the event in item_browser.
                    self._trigger('selectionchange', null, self.selected);

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Toggle tags.
            $(this.allTagsContainer, this.allTagsInput).bind({

                'mousedown': function() {

                    // Get the combined checkboxes bucket.
                    var checkboxes = self.allTagsInput.add(self.tagsInputs);

                    // Check or uncheck all, and switch the tracker.
                    var newValue = !self.allTagsChecked;
                    checkboxes.prop('checked', newValue);
                    self.allTagsChecked = newValue;

                    // Update the tracker array for each of the inputs.
                    $.each(self.tagsInputs, function(i, input) {
                        self._toggleArrayMembership($(input), newValue);
                    });

                    // Push all selected to false
                    self.selected.all = false;

                    // Trigger the event in item_browser.
                    self._trigger('selectionchange', null, self.selected);

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Toggle types.
            $(this.allTypesContainer, this.allTypesInput).bind({

                'mousedown': function() {

                    // Get the combined checkboxes bucket.
                    var checkboxes = self.allTypesInput.add(self.typesInputs);

                    // Check or uncheck all, and switch the tracker.
                    var newValue = !self.allTypesChecked;
                    checkboxes.prop('checked', newValue);
                    self.allTypesChecked = newValue;

                    // Update the tracker array for each of the inputs.
                    $.each(self.typesInputs, function(i, input) {
                        self._toggleArrayMembership($(input), newValue);
                    });

                    // Push all selected to false
                    self.selected.all = false;

                    // Trigger the event in item_browser.
                    self._trigger('selectionchange', null, self.selected);

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

            // Toggle collections.
            $(this.allCollectionsContainer, this.allCollectionsInput).bind({

                'mousedown': function() {

                    // Get the combined checkboxes bucket.
                    var checkboxes = self.allCollectionsInput.add(self.collectionsInputs);

                    // Check or uncheck all, and switch the tracker.
                    var newValue = !self.allCollectionsChecked;
                    checkboxes.prop('checked', newValue);
                    self.allCollectionsChecked = newValue;

                    // Update the tracker array for each of the inputs.
                    $.each(self.collectionsInputs, function(i, input) {
                        self._toggleArrayMembership($(input), newValue);
                    });

                    // Push all selected to false
                    self.selected.all = false;

                    // Trigger the event in item_browser.
                    self._trigger('selectionchange', null, self.selected);

                },

                'click': function(event) {
                    event.preventDefault();
                }

            });

        },

        /*
         * Push or pop a tag/type/collection in or out of the selection.
         */
        _toggleArrayMembership: function(input, value) {

            var recordDiv = input.closest('.filter-option').find('recordid');
            var id = parseInt(recordDiv.text());
            var type = recordDiv.attr('type');

            switch(type) {

                case 'tag':

                    // If it's not there already, push the id onto
                    // the tracker array.
                    if (value) {
                        this.selected.tags.push(id);
                    }

                    // Otherwise, pop it.
                    else {
                        this.selected.tags.remove(id);
                    }

                break;

                case 'type':

                    // If it's not there already, push the id onto
                    // the tracker array.
                    if (value) {
                        this.selected.types.push(id);
                    }

                    // Otherwise, pop it.
                    else {
                        this.selected.types.remove(id);
                    }

                break;

                case 'collection':

                    // If it's not there already, push the id onto
                    // the tracker array.
                    if (value) {
                        this.selected.collections.push(id);
                    }

                    // Otherwise, pop it.
                    else {
                        this.selected.collections.remove(id);
                    }

                break;

            }

        },

        /*
         * Emit the current selected array.
         */
        getSelected: function() {

            return this.selected;

        },

    });


})( jQuery );
