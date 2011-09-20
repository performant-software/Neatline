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

            // Markup hooks.
            container_id: 'item-browser',
            tab_li_id: 'filter-items-tab',
            dropdown_id: 'filter-items',
            tags_container_class: 'tags',
            types_container_class: 'types',
            collections_container_class: 'collections',
            column_class: 'filter-items-column',
            all_none_class: 'all-none',
            filter_option_class: 'filter-option',
            filter_header_class: 'filter-header',

            // Durations and CSS constants.
            bottom_padding: 75,
            fade_duration: 300,

            // Hexes.
            colors: {
                purple: '#724E85',
                hover_gray: '#EEEEEE',
                default_gray: '#F5F5F5'
            }

        },

        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.container = $('#' + this.options.container_id);
            this.dropdown = $('#' + this.options.dropdown_id);
            this.tab = $('#' + this.options.tab_li_id);
            this.tabLink = this.tab.find('a');

            // Get the containers for the checkbox columns.
            this.tagsContainer =
                $('div.' + this.options.column_class +
                  '.' + this.options.tags_container_class);

            this.typesContainer =
                $('div.' + this.options.column_class +
                  '.' + this.options.types_container_class);

            this.collectionsContainer =
                $('div.' + this.options.column_class +
                  '.' + this.options.collections_container_class);

            // Get the container divs for the taxonomy headers.
            this.allNoneContainer =
                $('div.' + this.options.filter_option_class +
                  '.' + this.options.all_none_class);

            this.allTagsContainer =
                this.tagsContainer.find('.' + this.options.filter_header_class);

            this.allTagsInput = this.allTagsContainer.find('input');

            this.allTypesContainer =
                this.typesContainer.find('.' + this.options.filter_header_class);

            this.allTypesInput = this.allTypesContainer.find('input');

            this.allCollectionsContainer =
                this.collectionsContainer.find('.' + this.options.filter_header_class);

            this.allCollectionsInput = this.allCollectionsContainer.find('input');

            // Get the container divs for the individual checkboxes.
            this.allNoneInput = this.allNoneContainer.find('input');

            this.tags = this.tagsContainer
                .find('.' + this.options.filter_option_class);

            this.tagsInputs = this.tagsContainer
                .find('.' + this.options.filter_option_class + ' input');

            this.types = this.typesContainer
                .find('.' + this.options.filter_option_class);

            this.typesInputs = this.typesContainer
                .find('.' + this.options.filter_option_class + ' input');

            this.collections = this.collectionsContainer
                .find('.' + this.options.filter_option_class);

            this.collectionsInputs = this.collectionsContainer
                .find('.' + this.options.filter_option_class + ' input');

            this.allInputs = this.allNoneInput
                .add(this.allTagsInput)
                .add(this.tagsInputs)
                .add(this.allTypesInput)
                .add(this.typesInputs)
                .add(this.allCollectionsInput)
                .add(this.collectionsInputs);

            // Status tracker starters.
            this._isOnDropdown = false;
            this._isOnTab = false;
            this._isExpanded = false;

            // Measure.
            this._getDimensions();

            // Bind events to the tab.
            this._glossTab();

            // Gloss the checkboxes.
            this._addCheckBoxEvents();

        },

        _getDimensions: function() {

            // Get total height of stack.
            this.totalHeight = this.element.height();

            // Get static css.
            this.topOffset = this.element.css('top').replace('px', '');

        },

        _glossTab: function() {

            var self = this;

            this.tab.bind({

                'mousedown': function() {

                    if (!self._isExpanded) {
                        self.show();
                        self.tabLink.css('background',self.options.colors.hover_gray);
                    }

                    else {
                        self.hide();
                        self.tabLink.css('background', self.options.colors.default_gray);
                    }

                },

                'mouseenter': function() {
                    self._isOnTab = true;
                },

                'mouseleave': function() {
                    self._isOnTab = false;
                }

            });

            this.dropdown.bind({

                'mouseenter': function() {
                    self._isOnDropdown = true;
                },

                'mouseleave': function() {
                    self._isOnDropdown = false;
                }

            });

            this._window.bind({

                'mousedown': function() {

                    if (!self._isOnDropdown &&
                        !self._isOnTab &&
                        self._isExpanded) {

                          self.hide();
                          self.tabLink.css('background', self.options.colors.default_gray);

                    }

                }

            });

        },

        show: function() {

            var self = this;

            // Register the show.
            this._isExpanded = true;

            // Get the current window height.
            var windowHeight = this._window.height();

            // Calculate the maximum height given the current size
            // of the window.
            var maxHeight = windowHeight - this.topOffset -
                this.options.bottom_padding;

            // Set the height based on the amount of space available.
            var height = (this.totalHeight > maxHeight) ? maxHeight :
                this.totalHeight;

            // Show and animate.
            this.element.css({

                'display': 'block',
                'height': 0

            }).stop().animate({

                'height': height

            }, this.options.fade_duration, function() {

                // Add the scrollbar.
                if (self.totalHeight > maxHeight) {
                    self._addScrollbar();
                }

            });


        },

        hide: function() {

            var self = this;

            // Register the hide.
            this._isExpanded = false;

            // Hide.
            this.element.stop().animate({

                'height': 0

            }, this.options.fade_duration, function() {

                self.element.css('display', 'none');

            });

        },

        _addScrollbar: function() {

            this.element.smallscroll();

        },

        _addCheckBoxEvents: function() {

            var self = this;

            // Toggle all / none.
            $(this.allNoneContainer, this.allNoneInput).bind({

                'click': function(event) {

                    event.preventDefault();
                    self.allInputs.prop('checked', true);

                }

            });

            // Toggle tags.
            $(this.allTagsContainer, this.allTagsInput).bind({

                'click': function(event) {
                    event.preventDefault();
                    // select all / none.
                }

            });

            // Toggle types.
            $(this.allTypesContainer, this.allTypesInput).bind({

                'click': function(event) {
                    event.preventDefault();
                    // select all / none.
                }

            });

            // Toggle collections.
            $(this.allCollectionsContainer, this.allCollectionsInput).bind({

                'click': function(event) {
                    event.preventDefault();
                    // select all / none.
                }

            });

        }

    });


})( jQuery );
