/*
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
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {


    $.widget('neatline.neatlineundateditems', {

        options: {

            // Markup hooks.
            markup: {
                list_container_id: 'undated-items-list-container',
                item_title_text_class: 'item-title-text',
                item_title_fader_class: 'item-title-fader',
                item_row_class: '.item-row',
                header_container_id: 'public-items-list-header'
            },

            // Hexes.
            colors: {

            }

        },

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.listContainer = $('#' + this.options.markup.list_container_id);
            this.listHeader = $('#' + this.options.markup.header_container_id);
            this.params = Neatline;

            // Id-to-item association object.
            this._idToItem = {};

            // Get starting offets and position markup.
            this.__getScrollBarWidth();
            this._positionMarkup();
            this._addWindowResizeListener();

            // Build list.
            this._getItems();

        },

        /*
         * Get the offset of the container.
         */
        _getOffsets: function() {

            this.containerOffset = this.element.offset();
            this.containerHeight = this.element.height();
            this.containerWidth = this.element.width();

        },

        /*
         * Position the header.
         */
        _positionMarkup: function() {

            // Reget offsets.
            this._getOffsets();

            // Set the top and left offsets for the header.
            this.listHeader.css({
                'top': this.containerOffset.top,
                'left': this.containerOffset.left,
                'width': this.containerWidth - this.scrollbarWidth
            });

        },

        /*
         * On window resize, reposition the header.
         */
        _addWindowResizeListener: function() {

            var self = this;

            this._window.bind('resize', function() {
                self._positionMarkup();
            });

        },

        /*
         * Request item markup and gloss the results.
         */
        loadData: function() {

            // Build list.
            this._getItems();

        },

        /*
         * Populate content.
         */
        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: this.params.dataSources.undated,
                dataType: 'html',

                success: function(data) {
                    self.listContainer.html(data);
                    self._glossItems();
                }

            });

        },

        /*
         * Once the raw markup is from the items ajax query is pushed into the
         * container, build the functionality for each item.
         */
        _glossItems: function() {

            var self = this;

            // Get the new items.
            this.items = this.listContainer.find('.item-row');

            // Empty the id-to-item association object.
            this._idToItem = {};

            // Position the faders.
            this._positionTitleFaders();

            // Bind events to the item rows.
            $.each(this.items, function(i, item) {

                var item = $(item);
                var itemId = item.attr('recordid');
                self._idToItem[itemId] = item;

                // Listen for events.
                item.bind({

                    'mousedown': function() {

                        // Trigger out to the deployment code.
                        self._trigger('undateditemclick', {}, {
                            'itemId': itemId
                        });

                    }

                });

            });

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
                var textSpan = item.find('.' + self.options.markup.item_title_text_class);
                var faderSpan = item.find('.' + self.options.markup.item_title_fader_class);

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
         * Calculate the width of the browser-default scrollbar. Used by the
         * calculation that positions the static browser pane top bar (with the
         * search box and item filterer).
         */
        __getScrollBarWidth: function() {

            this.scrollbarWidth = 0;

            if ($.browser.msie) {

                var textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                    .css({
                        position: 'absolute',
                        top: -1000,
                        left: -1000
                    }).appendTo('body');

                var textarea2 = $('<textarea cols="10" rows="2"></textarea>')
                    .css({
                        position: 'absolute',
                        top: -1000,
                        left: -1000,
                        overflow: 'hidden'
                    }).appendTo('body');

                this.scrollbarWidth = textarea1.width() - textarea2.width();
                textarea1.remove();
                textarea2.remove();

            }

            else {

                var div = $('<div />')
                    .css({
                        width: 100,
                        height: 100,
                        overflow: 'auto',
                        position: 'absolute',
                        top: -1000,
                        left: -1000
                    }).prependTo('body').append('<div />').find('div').css({
                        width: '100%',
                        height: 200
                    });

                this.scrollbarWidth = 100 - div.width();
                div.parent().remove();

            }

        }

    });


})( jQuery );
